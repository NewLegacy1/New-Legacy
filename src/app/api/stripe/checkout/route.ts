import Stripe from "stripe";

export const runtime = "nodejs";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
  });
}

type CheckoutRequestBody = {
  plan: "website" | "bundle";
  addons: Array<{
    id: string;
    name: string;
    setup: number;
    monthly: number;
  }>;
  setupPrice: number; // dollars
  monthlyPrice: number; // dollars
};

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return Response.json(
        { error: "Missing STRIPE_SECRET_KEY env var" },
        { status: 500 }
      );
    }

    const origin = req.headers.get("origin") || process.env.APP_URL || "";
    if (!origin) {
      return Response.json(
        { error: "Missing APP_URL (or Origin header)" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as CheckoutRequestBody;

    // Base plan: one-time setup + recurring monthly.
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: body.plan === "bundle" ? "Growth System Bundle (Setup)" : "Custom Website Build (Setup)",
          },
          unit_amount: Math.round(body.setupPrice * 100),
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: body.plan === "bundle" ? "Growth System Bundle (Monthly)" : "Custom Website Build (Monthly)",
          },
          unit_amount: Math.round(body.monthlyPrice * 100),
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ];

    // Add-ons: for website plan only.
    for (const addon of body.addons ?? []) {
      if (addon.setup > 0) {
        line_items.push({
          price_data: {
            currency: "cad",
            product_data: { name: `${addon.name} (Setup)` },
            unit_amount: Math.round(addon.setup * 100),
          },
          quantity: 1,
        });
      }

      if (addon.monthly > 0) {
        line_items.push({
          price_data: {
            currency: "cad",
            product_data: { name: `${addon.name} (Monthly)` },
            unit_amount: Math.round(addon.monthly * 100),
            recurring: { interval: "month" },
          },
          quantity: 1,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items,

      billing_address_collection: "required",
      phone_number_collection: { enabled: true },

      success_url: `${origin}/checkout-payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error creating session";
    return Response.json({ error: message }, { status: 500 });
  }
}

