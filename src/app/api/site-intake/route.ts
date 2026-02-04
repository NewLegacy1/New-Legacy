import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/db/supabaseAdmin";
import { intakeSchema } from "@/lib/validators/intake";
import { Resend } from "resend";

export const runtime = "nodejs";

// Simple in-memory rate limiter (good enough for now; replace with Upstash/Redis later)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateBucket: Map<string, { count: number; resetAt: number }> =
  (globalThis as any).__intakeRateBucket ?? new Map();
(globalThis as any).__intakeRateBucket = rateBucket;

function getClientIp() {
  const h = headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  entry.count += 1;
  return { ok: true };
}

export async function POST(req: Request) {
  const ip = getClientIp();
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  const json = await req.json().catch(() => null);
  if (!json) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const RELAXED = process.env.NODE_ENV !== "production";

  // In dev, allow drafts so you can click through and submit while editing.
  // In production, keep strict validation.
  let data: any = json;
  if (!RELAXED) {
    const parsed = intakeSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    data = parsed.data;
  }

  // Honeypot spam protection
  if (typeof data.website === "string" && data.website.trim().length > 0) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const record = {
    id: `intake_${crypto.randomUUID()}`,
    createdAt: new Date(),
    name: String(data.name ?? ""),
    businessName: String(data.businessName ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    timezone: String(data.timezone ?? ""),
    payload: data as any,
  };

  const hasSupabase =
    !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) {
    return Response.json(
      {
        error: "Supabase not configured",
        message:
          "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (server-only).",
      },
      { status: 500 }
    );
  }

  let intakeId = record.id;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("intake_submissions").insert({
      id: record.id,
      created_at: record.createdAt.toISOString(),
      name: record.name,
      business_name: record.businessName,
      email: record.email,
      phone: record.phone,
      timezone: record.timezone,
      payload: record.payload,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    return Response.json(
      {
        error: "Database write failed",
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }

  // Optional email notification (gracefully skip if not configured)
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.INTAKE_NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    try {
      const resend = new Resend(resendKey);
      const from =
        process.env.INTAKE_FROM_EMAIL ??
        "New Legacy Intake <intake@updates.yourdomain.com>";
      await resend.emails.send({
        from,
        to: [notifyEmail],
        subject: `New Intake: ${data.businessName} (${intakeId})`,
        text: [
          `Intake ID: ${intakeId}`,
          `Name: ${data.name}`,
          `Business: ${data.businessName}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone}`,
          `Timezone: ${data.timezone}`,
          "",
          "— Payload —",
          JSON.stringify(data, null, 2),
        ].join("\n"),
      });
    } catch {
      // ignore email failures (submission still saved)
    }
  }

  return Response.json({ intakeId });
}

