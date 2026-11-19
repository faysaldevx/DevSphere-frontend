"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";

const REDIRECT_TO = "/";

const inputBase =
  "w-full rounded-xl border bg-white/20 px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4";
const inputOk = "border-white/30 focus:border-[#F28C1B] focus:ring-[#F28C1B]/25";
const inputBad = "border-red-400 focus:border-red-400 focus:ring-red-200";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.6 5.9c4.4-4.1 6.9-10.1 6.9-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = (email, password) => {
    const er = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = "Enter a valid email address.";
    if (!password) er.password = "Enter your password.";
    setErrors(er);
    if (er.email) toast.error(er.email);
    else if (er.password) toast.error(er.password);
    return Object.keys(er).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    if (!validate(email, password)) return;

    setLoading(true);

    try {
      const { data: result, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Email or password is incorrect.");
        return;
      }

      console.log("Login Successful:", result);
      toast.success("Signed in successfully. Welcome back!");

      setTimeout(() => {
        window.location.href = REDIRECT_TO;
      }, 1000);
      return; 
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: REDIRECT_TO,
      });
      if (error) {
        setGoogleLoading(false);
        toast.error(error.message || "Couldn't sign in with Google. Try again.");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      setGoogleLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04353A] px-5 py-12">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: "#04353A", color: "#fff", fontSize: "14px" },
          success: { iconTheme: { primary: "#1B8F3F", secondary: "#fff" } },
          error: { iconTheme: { primary: "#F28C1B", secondary: "#fff" } },
        }}
      />

      {/* Blurred background glow (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#1B8F3F]/50 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-[#F28C1B]/40 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Glass card */}
      <section className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl sm:p-10">
        {/* DevSphere brand */}
        <div className="flex flex-col items-center text-center">
          <Logo light />
          <p className="mt-4 text-sm text-white/80">Good work happens when people find each other.</p>
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1.5 text-sm text-white/70">Welcome back. Enter your details to continue.</p>

        <form onSubmit={handleLogin} noValidate className="mt-7 space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/90">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              aria-invalid={Boolean(errors.email)}
              className={`${inputBase} ${errors.email ? inputBad : inputOk}`}
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-200">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/90">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={onChange}
                aria-invalid={Boolean(errors.password)}
                className={`${inputBase} pr-16 ${errors.password ? inputBad : inputOk}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-medium text-red-500 hover:text-[#04353A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C1B]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-sm text-red-200">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F28C1B] px-4 py-3 text-[15px] font-semibold text-white shadow-lg transition hover:bg-[#dc7b12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F28C1B]/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-sm text-white/60">
          <span className="h-px flex-1 bg-white/20" />
          or
          <span className="h-px flex-1 bg-white/20" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/30 bg-white px-4 py-3 text-[15px] font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <GoogleIcon />
          {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
        </button>

        <p className="mt-7 text-center text-sm text-white/80">
          New to DevSphere?{" "}
          <Link href="/register" className="font-semibold text-[#F28C1B] hover:underline">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}