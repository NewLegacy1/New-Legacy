import { getSupabaseAdmin } from "@/lib/db/supabaseAdmin";

export const runtime = "nodejs";

const DEFAULT_BUCKET = "intake-uploads";
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

function sanitizeFilename(name: string) {
  // Keep it simple and safe for object storage keys.
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json(
        { error: "Missing file", message: "Upload field must be named 'file'." },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return Response.json(
        { error: "Empty file", message: "Please choose a file to upload." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return Response.json(
        {
          error: "File too large",
          message: "Please upload a file under 5MB.",
        },
        { status: 413 }
      );
    }

    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return Response.json(
        {
          error: "Unsupported file type",
          message: "Please upload PNG, JPG, WEBP, GIF, or SVG.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const bucket = process.env.SUPABASE_UPLOADS_BUCKET ?? DEFAULT_BUCKET;

    const bytes = await file.arrayBuffer();
    const ext = sanitizeFilename(file.name || "upload");
    const path = `logos/${crypto.randomUUID()}-${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return Response.json(
        { error: "Upload failed", message: uploadError.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return Response.json({ url: data.publicUrl, path, bucket });
  } catch (e) {
    return Response.json(
      {
        error: "Upload failed",
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

