export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="min-h-screen bg-charcoal text-pure-white">
      <div className="container mx-auto px-4 pb-24 pt-32">
        <div className="mx-auto max-w-2xl rounded-2xl border border-ash-gray/20 bg-charcoal/80 p-8 text-center backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-phoenix-gold/70">
            Payment received
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            You’re all set.
          </h1>
          <p className="mt-3 text-sm text-ash-gray">
            We’ll reach out shortly to kick things off.
          </p>

          {searchParams.session_id ? (
            <p className="mt-6 text-xs text-ash-gray">
              Session: <span className="text-pure-white">{searchParams.session_id}</span>
            </p>
          ) : null}

          <a href="/" className="btn-primary mt-8 inline-flex justify-center">
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

