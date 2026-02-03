import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/db/supabaseAdmin";
import { leadSchema } from "@/lib/validators/lead";

export const runtime = "nodejs";

// Simple in-memory rate limiter (replace with Upstash/Redis later)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const rateBucket: Map<string, { count: number; resetAt: number }> =
  (globalThis as any).__leadRateBucket ?? new Map();
(globalThis as any).__leadRateBucket = rateBucket;

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
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)) },
      }
    );
  }

  const json = await req.json().catch(() => null);
  if (!json) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot spam protection
  if (data.website && data.website.trim().length > 0) {
    return Response.json({ ok: true }, { status: 200 });
  }

  let supabase: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    return Response.json(
      {
        error: "Supabase is not configured for leads.",
        message:
          e instanceof Error ? e.message : "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 500 }
    );
  }

  const id = `lead_${crypto.randomUUID()}`;
  const h = headers();
  const ua = h.get("user-agent") ?? "";
  const referer = h.get("referer") ?? "";

  const table = process.env.SUPABASE_LEADS_TABLE ?? "lead_submissions";

  const { error } = await supabase.from(table).insert({
    id,
    created_at: new Date().toISOString(),
    name: data.name,
    business_name: data.businessName,
    email: data.email,
    phone: data.phone,
    website_url: data.websiteUrl ?? null,
    services_interested: data.servicesInterested,
    message: data.message,
    preferred_contact: data.preferredContact,
    source_path: data.sourcePath,
    metadata: {
      ip,
      ua,
      referer,
      utm: data.utm,
    },
    status: "new",
  });

  if (error) {
    return Response.json(
      { error: "Database write failed", message: error.message },
      { status: 500 }
    );
  }

  return Response.json({ leadId: id });
}

