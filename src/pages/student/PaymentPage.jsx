import { useMemo, useState } from "react";

const initialPayments = [
  {
    id: "ELH-2026-001",
    course: "Introduction to React",
    date: "Oct 1, 2026",
    amount: 299,
    status: "Paid",
  },
  {
    id: "ELH-2026-002",
    course: "Advanced JavaScript",
    date: "Aug 1, 2026",
    amount: 349,
    status: "Paid",
  },
  {
    id: "ELH-2026-003",
    course: "UI/UX Design Fundamentals",
    date: "Nov 10, 2026",
    amount: 249,
    status: "Pending",
  },
  {
    id: "ELH-2026-004",
    course: "Full-Stack Web Development",
    date: "Nov 15, 2026",
    amount: 499,
    status: "Pending",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

function downloadReceipt(payment) {
  const receipt = [
    "E-learners Hub - Payment Receipt",
    `Receipt: ${payment.id}`,
    `Course: ${payment.course}`,
    `Date: ${payment.date}`,
    `Amount: ${formatCurrency(payment.amount)}`,
    `Status: ${payment.status}`,
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([receipt], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${payment.id}-receipt.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PaymentPage({ userName = "Student" }) {
  const [payments, setPayments] = useState(initialPayments);
  const cardEnding = "4242";
  const [notice, setNotice] = useState("");

  const totals = useMemo(
    () =>
      payments.reduce(
        (summary, payment) => {
          summary[payment.status.toLowerCase()] += payment.amount;
          return summary;
        },
        { paid: 0, pending: 0 },
      ),
    [payments],
  );

  const settlePayment = (paymentId) => {
    setPayments((currentPayments) =>
      currentPayments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "Paid",
              date: new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date()),
            }
          : payment,
      ),
    );
    setNotice("Payment recorded in this demo.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Payments</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review your course charges, payment method, and receipts, {userName}.
        </p>
      </div>

      <div
        role="note"
        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        These are sample records for the demo. Payments are not processed.
      </div>

      {notice && (
        <p role="status" className="text-sm font-medium text-indigo-700">
          {notice}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <PaymentSummary label="Total paid" amount={totals.paid} tone="indigo" />
        <PaymentSummary
          label="Upcoming payments"
          amount={totals.pending}
          tone="amber"
        />
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Payment method</p>
          <div className="mt-2">
            <p className="font-semibold text-slate-900">
              Visa ending in {cardEnding}
            </p>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-indigo-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 px-5 py-4">
          <div>
            <h3 className="font-semibold text-slate-800">Payment history</h3>
            <p className="mt-1 text-xs text-slate-500">
              Course charges and downloadable receipts
            </p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {payments.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-indigo-50 text-xs uppercase tracking-wide text-indigo-900">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Receipt</th>
                <th scope="col" className="px-5 py-3 font-semibold">Course</th>
                <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                <th scope="col" className="px-5 py-3 font-semibold">Amount</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {payment.id}
                  </td>
                  <td className="px-5 py-4 text-slate-700">{payment.course}</td>
                  <td className="px-5 py-4 text-slate-600">{payment.date}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        payment.status === "Paid"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {payment.status === "Paid" ? (
                      <button
                        type="button"
                        onClick={() => downloadReceipt(payment)}
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Download receipt
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => settlePayment(payment.id)}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Pay now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PaymentSummary({ label, amount, tone }) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : "border-indigo-100 bg-indigo-50 text-indigo-950";

  return (
    <article className={`rounded-xl border p-5 shadow-sm ${toneClass}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-bold">{formatCurrency(amount)}</p>
    </article>
  );
}
