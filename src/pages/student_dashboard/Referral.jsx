import { useState } from 'react'

const referralCode = 'LEARN-7K4P'

const Referral = () => {
  const [copyMessage, setCopyMessage] = useState('')
  const referralLink = `${window.location.origin}/signin?ref=${referralCode}`

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopyMessage('Link copied. Send it to someone who would enjoy learning with us.')
    } catch {
      setCopyMessage('Copy is unavailable in this browser. Select and copy the link above.')
    }
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8" aria-labelledby="referral-title">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Pass it along</p>
          <h1 id="referral-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Invite a friend</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Learning is better together. Share your invite link with a friend who’s ready to learn something new.</p>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">Referral overview</span>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        <section className="relative overflow-hidden rounded-3xl bg-indigo-700 p-7 text-white shadow-sm sm:p-10" aria-labelledby="share-invite-heading">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-10 border-white/10" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold text-indigo-200">Your personal invite</p>
            <h2 id="share-invite-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Good things are worth sharing.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">Your friend can use this link to open the learner sign-up page. Referral rewards aren’t enabled yet.</p>

            <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
              <label htmlFor="referral-link" className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Sign-up invite link</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input id="referral-link" readOnly value={referralLink} onFocus={(event) => event.target.select()} className="h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 text-sm text-white outline-none selection:bg-white/30" />
                <button type="button" onClick={copyReferralLink} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg>
                  Copy link
                </button>
              </div>
              {copyMessage && <p role="status" className="mt-3 text-sm text-indigo-100">{copyMessage}</p>}
            </div>
            <p className="mt-4 text-xs text-indigo-200">Invite code <span className="ml-1 rounded-md bg-white/10 px-2 py-1 font-mono font-bold tracking-wide text-white">{referralCode}</span></p>
          </div>
        </section>

        <aside className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold text-slate-500">Your invites</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">—</p>
            <p className="mt-2 text-sm text-slate-500">Invite activity will appear here once referrals are connected.</p>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-500">Referral rewards</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Not active yet</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">We’ll show invite activity here once referrals are connected to your account.</p>
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="referral-steps-heading">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Three simple steps</p>
            <h2 id="referral-steps-heading" className="mt-1 text-xl font-bold text-slate-900">How inviting works</h2>
          </div>
          <p className="text-sm text-slate-500">Easy to share, no pressure.</p>
        </div>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { number: '01', title: 'Copy your link', detail: 'Use the invite link above to get started.' },
            { number: '02', title: 'Send it to a friend', detail: 'Share it in a message or wherever you keep in touch.' },
            { number: '03', title: 'Learn together', detail: 'Your friend can explore the courses and join the community.' },
          ].map((step) => (
            <li key={step.number} className="rounded-xl bg-slate-50 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">{step.number}</span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TODO: Replace the preview invite link and zeroed activity with referral-service data and rewards rules. */}
    </section>
  )
}

export default Referral
