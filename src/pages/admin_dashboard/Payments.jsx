import { useMemo, useState } from 'react'
import useAdminData from './useAdminData'

const EMPTY_PAYMENTS = []

const getAmount = (amount) => Number(String(amount).replace(/[^\d.]/g, '')) || 0

const Payments = () => {
	const [data, updateData] = useAdminData()
	const payments = data.payments || EMPTY_PAYMENTS
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('All payments')

	const filteredPayments = useMemo(() => payments.filter((payment) => {
		const matchesQuery = `${payment.id} ${payment.amount}`.toLowerCase().includes(query.toLowerCase())
		return matchesQuery && (statusFilter === 'All payments' || payment.status === statusFilter)
	}), [payments, query, statusFilter])

	const paidTotal = payments.filter((payment) => payment.status === 'Paid').reduce((total, payment) => total + getAmount(payment.amount), 0)
	const pendingTotal = payments.filter((payment) => payment.status === 'Pending').reduce((total, payment) => total + getAmount(payment.amount), 0)

	const markAsPaid = (payment) => {
		updateData((currentData) => ({
			...currentData,
			payments: currentData.payments.map((item) => item.id === payment.id ? { ...item, status: 'Paid' } : item),
		}))
	}

	return (
		<section className="mx-auto max-w-7xl space-y-7" aria-labelledby="payments-title">
			<header>
				<p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Admin portal / Payments</p>
				<h1 id="payments-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Payment overview</h1>
				<p className="mt-2 text-slate-500">Review payment records and quickly see what has been received or is still pending.</p>
			</header>

			<div className="grid gap-4 sm:grid-cols-3">
				{[
					{ label: 'Payment records', value: payments.length, color: 'text-indigo-700' },
					{ label: 'Received', value: `$${paidTotal.toLocaleString()}`, color: 'text-emerald-700' },
					{ label: 'Pending', value: `$${pendingTotal.toLocaleString()}`, color: 'text-amber-700' },
				].map((stat) => (
					<article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<p className="text-sm font-medium text-slate-500">{stat.label}</p>
						<p className={`mt-3 text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
					</article>
				))}
			</div>

			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="payment-list-title">
				<div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div><h2 id="payment-list-title" className="text-lg font-bold text-slate-900">Payment records</h2><p className="mt-1 text-sm text-slate-500">Mark a pending record as paid once it has been confirmed.</p></div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<label><span className="sr-only">Search payments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search payment ID..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-56" /></label>
						<label><span className="sr-only">Filter payment status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-40"><option>All payments</option><option>Paid</option><option>Pending</option></select></label>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-w-120 text-left text-sm">
						<thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th scope="col" className="px-5 py-3.5 font-semibold">Payment ID</th><th scope="col" className="px-5 py-3.5 font-semibold">Amount</th><th scope="col" className="px-5 py-3.5 font-semibold">Status</th><th scope="col" className="px-5 py-3.5 text-right font-semibold">Action</th></tr></thead>
						<tbody className="divide-y divide-slate-100">
							{filteredPayments.map((payment) => (
								<tr key={payment.id} className="hover:bg-slate-50/70">
									<td className="px-5 py-4 font-semibold text-slate-900">{payment.id}</td>
									<td className="px-5 py-4 font-medium text-slate-700">{payment.amount}</td>
									<td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{payment.status}</span></td>
									<td className="px-5 py-4 text-right">{payment.status === 'Pending' ? <button type="button" onClick={() => markAsPaid(payment)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">Mark paid</button> : <span className="text-xs font-medium text-slate-400">Complete</span>}</td>
								</tr>
							))}
							{filteredPayments.length === 0 && <tr><td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">No payments match your search.</td></tr>}
						</tbody>
					</table>
				</div>
				<footer className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {filteredPayments.length} of {payments.length} payments</footer>
			</section>
		</section>
	)
}

export default Payments
