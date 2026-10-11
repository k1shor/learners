const learnerName = 'Your Name'
const courseTitle = 'Introduction to Web Development'
const issuedDate = new Date().toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })

const Certification = () => {
  const downloadPreview = () => {
    // TODO: Replace this SVG preview download with the official certificate generator/API.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
      <rect width="1200" height="850" fill="#f8fafc"/><rect x="28" y="28" width="1144" height="794" rx="8" fill="#fff" stroke="#4338ca" stroke-width="8"/><rect x="48" y="48" width="1104" height="754" rx="4" fill="none" stroke="#c7d2fe" stroke-width="2"/>
      <text x="600" y="150" text-anchor="middle" font-family="Georgia,serif" font-size="26" letter-spacing="7" fill="#4f46e5">LEARNERS HUB</text>
      <text x="600" y="255" text-anchor="middle" font-family="Georgia,serif" font-size="54" fill="#172554">Certificate of Achievement</text>
      <text x="600" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" fill="#64748b">This preview is presented to</text>
      <text x="600" y="425" text-anchor="middle" font-family="Georgia,serif" font-size="56" fill="#4338ca">${learnerName}</text>
      <path d="M280 450h640" stroke="#c7d2fe" stroke-width="2"/>
      <text x="600" y="520" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#64748b">for completing the learning preview for</text>
      <text x="600" y="590" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#172554">${courseTitle}</text>
      <text x="600" y="690" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#64748b">Preview date: ${issuedDate}</text>
      <text x="600" y="770" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="8" fill="#be123c">SAMPLE · NOT AN OFFICIAL CERTIFICATE</text>
    </svg>`
    const file = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const fileUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'learners-hub-certificate-preview.svg'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8" aria-labelledby="certification-title">
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { background: white !important; }
          body * { visibility: hidden !important; }
          #certificate-preview, #certificate-preview * { visibility: visible !important; }
          #certificate-preview { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; border: 10px double #4338ca !important; border-radius: 0 !important; box-shadow: none !important; padding: 7vh 7vw !important; }
          .certificate-no-print { display: none !important; }
        }
      `}</style>

      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Celebrate your progress</p>
          <h1 id="certification-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Certificates</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Your achievements, collected in one place and ready to share.</p>
        </div>
        <span className="w-fit rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">Certificate center</span>
      </header>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Certificate summary">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Earned certificates</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
          <p className="mt-1 text-xs text-slate-400">Complete a course to earn your first</p>
        </article>
        <article className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">Preview available</p>
          <p className="mt-3 text-3xl font-bold text-indigo-950">1</p>
          <p className="mt-1 text-xs text-indigo-700/70">Try the sample certificate template</p>
        </article>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="preview-heading">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Sample only</p>
              <h2 id="preview-heading" className="mt-1 text-xl font-bold text-slate-900">Certificate preview</h2>
            </div>
            <div className="certificate-no-print flex flex-wrap gap-2">
              <button type="button" onClick={downloadPreview} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                <span aria-hidden="true">↓</span> Download SVG
              </button>
              <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                <span aria-hidden="true">▣</span> Print / Save PDF
              </button>
            </div>
          </div>

          <article id="certificate-preview" className="relative overflow-hidden rounded-xl border-6 border-indigo-700 bg-white px-5 py-9 text-center shadow-inner sm:border-10 sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute inset-2 border border-indigo-200 sm:inset-3" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl text-indigo-700 ring-1 ring-indigo-100" aria-hidden="true">✦</span>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-indigo-600">Learners Hub</p>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-slate-900 sm:text-4xl">Certificate of Achievement</h3>
              <p className="mt-5 text-sm text-slate-500 sm:text-base">This preview is presented to</p>
              <p className="mx-auto mt-3 max-w-xl border-b border-indigo-200 pb-3 font-serif text-3xl italic text-indigo-800 sm:text-5xl">{learnerName}</p>
              <p className="mt-5 text-sm text-slate-500 sm:text-base">for completing the learning preview for</p>
              <p className="mt-2 font-serif text-xl font-semibold text-slate-800 sm:text-2xl">{courseTitle}</p>
              <p className="mt-6 text-sm text-slate-500">Preview date: {issuedDate}</p>
              <span className="mt-6 inline-flex rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700 ring-1 ring-rose-100">Sample · not an official certificate</span>
            </div>
          </article>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6" aria-labelledby="preview-note-heading">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg text-amber-800" aria-hidden="true">i</div>
            <h2 id="preview-note-heading" className="mt-4 font-bold text-amber-950">Preview certificate</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900/80">This is a downloadable sample to test the layout. It does not confirm course completion and is not an official credential.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="next-steps-heading">
            <h2 id="next-steps-heading" className="font-bold text-slate-900">What happens next?</h2>
            <ol className="mt-4 space-y-4 text-sm text-slate-600">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">1</span><span>Complete all lessons and course requirements.</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">2</span><span>Your earned certificate will appear here.</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">3</span><span>Download or print it to share your achievement.</span></li>
            </ol>
          </section>
        </aside>
      </div>

      {/* TODO: Load earned certificates from learner progress and connect official PDF generation here. */}
    </div>
  )
}

export default Certification