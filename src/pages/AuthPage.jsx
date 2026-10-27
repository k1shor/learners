import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import PasswordField from "../components/auth/PasswordField";

const AuthPage = ({ mode }) => {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onAuthenticated } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (isSignup && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/auth/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            ...(isSignup ? { name } : {}),
            email,
            password,
          }),
        },
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || "We could not sign you in. Please try again.");
        return;
      }

      onAuthenticated(result.user);
      navigate(destination, { replace: true });
    } catch {
      setError(
        "The sign-in service is unavailable. Start the API server and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-150px)] w-full max-w-5xl place-items-center px-4 py-10">
      <div className="app-card grid w-full overflow-hidden rounded-[28px] border shadow-xl shadow-[#173c35]/5 md:grid-cols-[1.1fr_0.9fr]">
        <div className="p-7 sm:p-10">
          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]"
          >
            E-LearnersHub
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64756c]">
            {isSignup
              ? "Join the learning space and keep your courses, tasks, and achievements together."
              : "Sign in to get back to your courses and saved progress."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {isSignup && (
              <label className="block text-sm font-semibold text-[#29483f]">
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 font-normal text-[#203832] outline-none transition placeholder:text-[#9aa398] focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
                />
              </label>
            )}
            <label className="block text-sm font-semibold text-[#29483f]">
              Email address
              <input
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
            <PasswordField
              id="auth-password"
              label="Password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={isSignup ? 8 : undefined}
              placeholder={isSignup ? "At least 8 characters" : "Your password"}
            />

            {isSignup && (
              <PasswordField
                id="auth-confirm-password"
                label="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                placeholder="Enter your password again"
              />
            )}

            {!isSignup && (
              <div className="-mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#527f69] underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
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
              {isSubmitting
                ? "Please wait…"
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#64756c]">
            {isSignup ? "Already registered?" : "New to E-LearnersHub?"}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              state={location.state}
              className="font-bold text-[#527f69] underline-offset-4 hover:underline"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>

        <aside className="relative hidden overflow-hidden bg-[#173c35] p-9 text-white md:flex md:flex-col md:justify-end">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-12 size-64 rounded-full border-[28px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-14 size-64 rounded-full bg-[#d9ef79]/10"
          />
          <div className="relative">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#d9ef79] text-2xl font-bold text-[#173c35]">
              ✳
            </span>
            <p className="mt-5 text-2xl font-bold leading-snug">
              Learn at your pace. Celebrate every step.
            </p>
            <p className="mt-2 text-sm leading-6 text-[#c5d7c4]">
              Your courses, task lists, and earned certificates are ready when
              you are.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AuthPage;
