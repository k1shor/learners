import { useState } from 'react'
import { Link } from 'react-router-dom'

const Payment = () => {
  const [notice, setNotice] = useState('')

  return (
    <section className="mx-auto max-w-7xl space-y-8" aria-labelledby="payment-title">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Your account</p>
          <h1 id="payment-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Payments & billing</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Manage your payment details and keep track of course charges in one place.</p>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">Billing overview</span>
      </header>

      {notice && (
        <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message" className="font-bold text-indigo-700 hover:text-indigo-950">✕</button>
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]" aria-label="Billing summary">
        <article className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-sm sm:p-9">
          <div className="pointer-events-none absolute -right-14 -top-24 h-64 w-64 rounded-full border-9 border-white/5" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <p className="text-sm font-medium text-slate-300">Current plan</p>
              <h2 className="mt-3 text-2xl font-bold">No active plan</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">When you enroll in a paid course, your plan and billing details will appear here.</p>
            </div>
            <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
                <span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" /> No billing activity
              </span>
              <Link to="/student-dashboard/courses" className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                Browse courses <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>

        <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Payment methods</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Your saved cards</h2>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700" aria-hidden="true">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18m-14 5h3" /></svg>
            </span>
          </div>
          <div className="my-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-7 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-slate-400 shadow-sm" aria-hidden="true">＋</span>
            <p className="mt-3 text-sm font-semibold text-slate-800">No payment method added</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">A card can be added securely when payment processing is set up.</p>
          </div>
          <button type="button" onClick={() => setNotice('Payment processing is not connected yet. No card information has been requested or saved.')} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
            <span aria-hidden="true">+</span> Add payment method
          </button>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="billing-history-title">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Receipts and records</p>
            <h2 id="billing-history-title" className="mt-1 text-xl font-bold text-slate-900">Billing history</h2>
          </div>
          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">0 transactions</span>
        </div>

        <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr] gap-4 bg-slate-50 px-7 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
          <span>Description</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        <div className="flex flex-col items-center px-6 py-12 text-center sm:py-14">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500" aria-hidden="true">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 3.75h7l4 4V20a1.25 1.25 0 0 1-1.25 1.25h-9.5A1.25 1.25 0 0 1 6 20V5a1.25 1.25 0 0 1 1-1.25Z" /><path d="M14 4v4h4m-9 4h6m-6 3h6" /></svg>
          </span>
          <h3 className="mt-4 font-semibold text-slate-900">No transactions yet</h3>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Course payments and downloadable receipts will show up here after billing is connected.</p>
        </div>
      </section>

      <p className="flex items-start gap-2 text-xs leading-5 text-slate-400">
        <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></svg>
        Payment tools are currently a preview. No payment details are collected or stored on this page.
      </p>

      {/* TODO: Connect a payment provider and load the learner's plans, payment methods, and transaction history. */}
    </section>
  )
}

export default Payment
