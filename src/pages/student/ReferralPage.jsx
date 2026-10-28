import { useState } from "react";

export default function ReferralPage({ userName }) {
  const [copyMessage, setCopyMessage] = useState("");
  const referralCode = `LEARN-${userName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-") || "STUDENT"}`;
  const referralLink = `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopyMessage("Referral link copied.");
    } catch {
      setCopyMessage("Could not copy the link. Please copy it manually.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Refer a Friend</h2>
        <p className="mt-1 text-sm text-slate-600">
          Share your learning experience and invite someone to join E-learners
          Hub.
        </p>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Student referral
          </span>
          <h3 className="mt-2 text-2xl font-bold text-indigo-950">
            Learning is better together
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Send your personal link to a friend. Referral tracking and rewards
            will be available when the referral program is connected.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-indigo-100 bg-white p-4">
          <label
            htmlFor="student-referral-link"
            className="block text-sm font-semibold text-slate-700"
          >
            Your referral link
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="student-referral-link"
              type="text"
              readOnly
              value={referralLink}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Copy link
            </button>
          </div>
          <p aria-live="polite" className="mt-2 min-h-5 text-sm text-indigo-700">
            {copyMessage}
          </p>
          <p className="text-xs text-slate-500">
            Preview only: referral tracking is not connected yet.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-indigo-100 bg-slate-50 p-5">
        <h3 className="font-semibold text-slate-800">Referral activity</h3>
        <p className="mt-1 text-sm text-slate-600">
          Your invitations and referral status will appear here once tracking
          is enabled.
        </p>
      </section>
    </div>
  );
}
