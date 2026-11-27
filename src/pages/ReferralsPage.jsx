import { Link } from "react-router-dom";

const ReferralsPage = () => (
  <section aria-label="Referrals page" className="mx-auto w-full max-w-6xl">
    <header className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
        Grow together
      </p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
        Referrals
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64756c]">
        We are preparing a simple way to invite friends to learn with you.
      </p>
    </header>

    <article className="app-card overflow-hidden rounded-[22px] border shadow-sm">
      <div className="grid gap-6 bg-linear-to-br from-[#f2f6e8] via-[#fffefa] to-[#e9f1ea] p-6 sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d6e2c9] bg-[#fffefa]/80 px-3 py-1.5 text-xs font-semibold text-[#527f69]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#8cac5b]"
            />
            Coming soon
          </span>
          <h3 className="mt-4 max-w-lg text-2xl font-bold tracking-tight text-[#173c35] sm:text-3xl">
            Share the learning journey
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#64756c]">
            Referral links, invite tracking, and any reward details will be
            available here once the program launches.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e0d5] bg-[#fffefa]/90 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a968d]">
            Referral program
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[#53685e]">
            <li className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#eff4e3] text-xs font-bold text-[#527f69]">
                1
              </span>
              Your personal invite link
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#eff4e3] text-xs font-bold text-[#527f69]">
                2
              </span>
              A clear view of invite activity
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#eff4e3] text-xs font-bold text-[#527f69]">
                3
              </span>
              Updates on program rewards
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-3 border-t border-[#eeeae1] px-6 py-4 sm:flex-row sm:items-center sm:px-9">
        <p className="text-xs leading-5 text-[#78877b]">
          Referral tracking is not active yet; no invitations or rewards are
          being counted.
        </p>
        <Link
          to="/"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-[#d9d4c7] bg-[#fffefa] px-3.5 py-2 text-sm font-semibold text-[#355c4c] shadow-sm transition hover:border-[#b8c9a1] hover:bg-[#f3f6e8]"
        >
          Explore courses <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  </section>
);

export default ReferralsPage;
