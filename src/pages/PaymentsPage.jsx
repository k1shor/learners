import { Link } from "react-router-dom";

const PaymentsPage = () => (
  <section aria-label="Payments page" className="mx-auto w-full max-w-6xl">
    <header className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
        Account &amp; billing
      </p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
        Payments
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64756c]">
        View your payment activity and find receipts in one place.
      </p>
    </header>

    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <article className="app-card rounded-[22px] border p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eff4e3] text-[#527f69]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7.5h16M6.5 4.5h11A2.5 2.5 0 0 1 20 7v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17V7a2.5 2.5 0 0 1 2.5-2.5Z" />
              <path d="M4 11h16" />
            </svg>
          </span>
          <div>
            <h3 className="text-base font-bold text-[#203832]">
              Payment activity
            </h3>
            <p className="mt-1 text-sm leading-6 text-[#64756c]">
              Completed payments and receipts will be listed here.
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e7e3d8]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 border-collapse text-left">
              <thead className="bg-[#f7f5ed] text-xs font-bold uppercase tracking-[0.08em] text-[#78877b]">
                <tr>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Title</th>
                  <th className="px-4 py-3 font-bold">Due</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    className="bg-[#fbfaf6] px-5 py-9 text-center"
                  >
                    <p className="text-sm font-semibold text-[#355c4c]">
                      No payments recorded
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#78877b]">
                      Your payment history is empty. Receipts will appear here
                      when available.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <aside className="app-card rounded-[22px] border p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a968d]">
          Payment methods
        </p>
        <h3 className="mt-2 text-lg font-bold text-[#203832]">
          No method saved
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#64756c]">
          Payment options are presented during enrollment when a course requires
          payment.
        </p>
        <div className="mt-5 border-t border-[#eeeae1] pt-4">
          <Link
            to="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#d9d4c7] bg-[#fffefa] px-3.5 py-2 text-sm font-semibold text-[#355c4c] shadow-sm transition hover:border-[#b8c9a1] hover:bg-[#f3f6e8]"
          >
            Browse courses <span aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>
    </div>
  </section>
);

export default PaymentsPage;
