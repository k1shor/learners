export default function PaymentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Payments</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review your billing information and payment history.
        </p>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Billing overview
        </span>
        <h3 className="mt-2 text-2xl font-bold text-indigo-950">
          Your payment history
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Once billing is connected, this page will show your course payments,
          receipts, and payment status.
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-indigo-100 bg-white">
        <div className="border-b border-indigo-100 px-5 py-4">
          <h3 className="font-semibold text-slate-800">Recent transactions</h3>
        </div>
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18M7 15h3" />
            </svg>
          </div>
          <h4 className="mt-4 font-semibold text-slate-800">
            No payment records yet
          </h4>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Your transactions and downloadable receipts will show here when
            payment processing is available.
          </p>
        </div>
      </section>
    </div>
  );
}
