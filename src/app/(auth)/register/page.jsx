"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";

const REDIRECT_TO = "/";

const RULES = [
  { key: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p), error: "Password must have an uppercase letter." },
  { key: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p), error: "Password must have a lowercase letter." },
  { key: "length", label: "At least 6 characters", test: (p) => p.length >= 6, error: "Password must be at least 6 characters long." },
];

const inputBase =
  "w-full rounded-xl border bg-white/20 px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4";
const inputOk = "border-white/30 focus:border-[#F28C1B] focus:ring-[#F28C1B]/25";
const inputBad = "border-red-400 focus:border-red-400 focus:ring-red-200";
const labelCls = "mb-1.5 block text-sm font-medium text-white/90";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = ({ name, email, photoURL, password }) => {
    const er = {};
    if (name.length < 2) er.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = "Enter a valid email address.";
    if (photoURL && !/^https?:\/\/\S+$/i.test(photoURL))
      er.photoURL = "Enter a valid image URL starting with http:// or https://";

    const failed = RULES.filter((r) => !r.test(password));
    if (failed.length) er.password = failed[0].error;

    setErrors(er);

    if (er.name) toast.error(er.name);
    if (er.email) toast.error(er.email);
    if (er.photoURL) toast.error(er.photoURL);
    failed.forEach((r) => toast.error(r.error));

    return Object.keys(er).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const values = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      photoURL: String(data.get("photoURL") || "").trim(),
      password: String(data.get("password") || ""),
    };

    if (!validate(values)) return;

    setLoading(true);

    try {
      const { data: result, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.photoURL || undefined,
      });

      if (error) {
        toast.error(error.message || "Couldn't create your account. Try again.");
        return;
      }

      console.log("Registration Successful:", result);
      toast.success("Account created successfully. Welcome to DevSphere!");
      setTimeout(() => {
        window.location.href = REDIRECT_TO;
      }, 1000);
      return;
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-sm text-white/70">It takes less than a minute to get started.</p>

        <form onSubmit={handleRegister} noValidate className="mt-7 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelCls}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={form.name}
              onChange={onChange}
              aria-invalid={Boolean(errors.name)}
              className={`${inputBase} ${errors.name ? inputBad : inputOk}`}
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-200">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelCls}>
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

          {/* Photo URL */}
          <div>
            <label htmlFor="photoURL" className={labelCls}>
              Photo URL
            </label>
            <input
              id="photoURL"
              name="photoURL"
              type="url"
              autoComplete="off"
              placeholder="https://example.com/photo.jpg"
              value={form.photoURL}
              onChange={onChange}
              aria-invalid={Boolean(errors.photoURL)}
              className={`${inputBase} ${errors.photoURL ? inputBad : inputOk}`}
            />
            {errors.photoURL && <p className="mt-1.5 text-sm text-red-200">{errors.photoURL}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelCls}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
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

            <ul className="mt-3 space-y-1.5" aria-live="polite">
              {RULES.map((r) => {
                const ok = r.test(form.password);
                return (
                  <li
                    key={r.key}
                    className={`flex items-center gap-2 text-[13px] transition-colors ${ok ? "text-[#F28C1B]" : "text-white/60"}`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${ok ? "bg-[#F28C1B] text-white" : "border border-white/40 text-transparent"
                        }`}
                    >
                      ✓
                    </span>
                    {r.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F28C1B] px-4 py-3 text-[15px] font-semibold text-white shadow-lg transition hover:bg-[#dc7b12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F28C1B]/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-white/80">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#F28C1B] hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}