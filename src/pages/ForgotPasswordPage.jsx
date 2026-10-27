import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [developmentResetUrl, setDevelopmentResetUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setDevelopmentResetUrl("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          result.error || "We could not process that request. Try again.",
        );
        return;
      }
      setMessage(result.message);
      setDevelopmentResetUrl(result.developmentResetUrl || "");
    } catch {
      setError(
        "The password recovery service is unavailable. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-150px)] w-full max-w-5xl place-items-center px-4 py-10">
      <div className="app-card w-full max-w-xl rounded-[28px] border p-7 shadow-xl shadow-[#173c35]/5 sm:p-10">
        <Link
          to="/login"
          className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]"
        >
          E-LearnersHub
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#173c35]">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#64756c]">
          Enter your account email and we’ll send a one-time password reset
          link.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label
            htmlFor="recovery-email"
            className="block text-sm font-semibold text-[#29483f]"
          >
            Email address
            <input
              id="recovery-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 font-normal text-[#203832] outline-none transition placeholder:text-[#9aa398] focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
            />
          </label>

          {message && (
            <p
              role="status"
              className="rounded-xl border border-[#c9d8ae] bg-[#eff4e3] px-3.5 py-3 text-sm leading-5 text-[#355c4c]"
            >
              {message}
            </p>
          )}
          {developmentResetUrl && (
            <div className="rounded-xl border border-[#d9d4c7] bg-[#f5f3ec] px-3.5 py-3 text-sm leading-5 text-[#53685e]">
              <p className="font-semibold">
                Development mode: use this reset link
              </p>
              <a
                className="mt-1 block break-all font-medium text-[#527f69] underline"
                href={developmentResetUrl}
              >
                {developmentResetUrl}
              </a>
            </div>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-[#e4c8b9] bg-[#f8eee8] px-3.5 py-3 text-sm leading-5 text-[#80523b]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#173c35] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#28584a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-65"
          >
            {isSubmitting ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#64756c]">
          Remembered it?{" "}
          <Link
            to="/login"
            className="font-bold text-[#527f69] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
