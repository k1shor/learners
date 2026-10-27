import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PasswordField from "../components/auth/PasswordField";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!token) {
      setError("This reset link is missing its token. Request a new link.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || "We could not update your password.");
        return;
      }
      setMessage(result.message || "Password updated. You can sign in now.");
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
          Choose a new password
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#64756c]">
          Use at least 8 characters. The reset link can only be used once.
        </p>

        {message ? (
          <div className="mt-6 space-y-4">
            <p
              role="status"
              className="rounded-xl border border-[#c9d8ae] bg-[#eff4e3] px-3.5 py-3 text-sm leading-5 text-[#355c4c]"
            >
              {message}
            </p>
            <Link
              to="/login"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#173c35] px-4 py-2 text-sm font-bold text-white hover:bg-[#28584a]"
            >
              Sign in with your new password
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <PasswordField
              id="new-password"
              label="New password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              placeholder="At least 8 characters"
            />
            <PasswordField
              id="confirm-new-password"
              label="Confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              placeholder="Enter it again"
            />
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
              disabled={isSubmitting || !token}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#173c35] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#28584a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ResetPasswordPage;
