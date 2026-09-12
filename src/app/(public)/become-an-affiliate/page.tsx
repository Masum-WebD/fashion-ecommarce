'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import {
  sendAffiliateRegistrationOtp,
  verifyAffiliateOtp,
  registerAffiliate,
  loginAffiliate,
  forgotAffiliatePasswordOtp,
  resetAffiliatePassword,
} from "@/lib/api/auth";

type AuthView = "login" | "register" | "forgot";
type RegisterStep = "phone" | "otp" | "details";
type ForgotStep = "phone" | "otp" | "reset";

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#0fa550]/20 to-[#0fa550]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
    <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-[#0fa550]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "12s", animationDelay: "2s" }} />
    <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-[#0fa550]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "10s", animationDelay: "4s" }} />
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-[#0fa550]/10 rounded-full"
        style={{
          top: `${15 + i * 15}%`,
          left: `${10 + i * 14}%`,
          animation: `float ${6 + i * 2}s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`,
        }}
      />
    ))}
  </div>
);

const TakaIcon = ({ size = 24, className = "" }: { size?: number | string; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16.5 15.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M7 7a2 2 0 1 1 4 0v9a3 3 0 0 0 6 0v-.5" />
    <path d="M8 11h6" />
  </svg>
);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm backdrop-blur-sm border border-slate-200/60 hover:bg-slate-50 transition-all duration-300 group">
    <div className="w-11 h-11 rounded-xl bg-[#0fa550] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-[#0fa550]/20">
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <p className="text-[13px] text-slate-500 mt-1 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {steps.map((label, i) => (
      <div key={label} className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${i < currentStep
              ? "bg-[#0fa550] text-white shadow-lg shadow-[#0fa550]/30"
              : i === currentStep
                ? "bg-[#0fa550] text-white shadow-md shadow-[#0fa550]/30 scale-110"
                : "bg-slate-200 text-slate-500"
              }`}
          >
            {i < currentStep ? <CheckCircle2 size={16} /> : i + 1}
          </div>
          <span className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${i <= currentStep ? "text-slate-800" : "text-slate-400"}`}>
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-8 h-0.5 rounded-full transition-all duration-500 mb-4 ${i < currentStep ? "bg-[#0fa550]/10" : "bg-slate-100"}`} />
        )}
      </div>
    ))}
  </div>
);

export default function AffiliateAuthPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuth();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [view, setView] = useState<AuthView>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  const [regStep, setRegStep] = useState<RegisterStep>("phone");
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");

  const [forgotStep, setForgotStep] = useState<ForgotStep>("phone");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [showForgotPw, setShowForgotPw] = useState(false);

  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard/affiliate");
  }, [isAuthenticated, router]);

  const handleOtpChange = useCallback(
    (index: number, value: string, setter: (val: string) => void) => {
      if (!/^\d*$/.test(value)) return;
      const newDigits = [...otpDigits];
      newDigits[index] = value.slice(-1);
      setOtpDigits(newDigits);
      setter(newDigits.join(""));
      if (value && index < 3) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otpDigits]
  );

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (regStep === "otp" || forgotStep === "otp") {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [regStep, forgotStep]);

  const resetOtpDigits = () => setOtpDigits(["", "", "", ""]);

  const switchView = (newView: AuthView) => {
    setView(newView);
    setErrorMsg("");
    setRegStep("phone");
    setForgotStep("phone");
    resetOtpDigits();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone.length < 10) { toast.error("Enter a valid phone number"); return; }
    if (!loginPassword) { toast.error("Enter your password"); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await loginAffiliate(loginPhone, loginPassword);
      const customer = res.data.user ?? res.data.customer;

      if (!customer?.is_affiliate) {
        throw new Error("This account is not an affiliate. Please register as affiliate first.");
      }

      setAuth(customer!, res.data.token);
      toast.success("Welcome back! Redirecting to dashboard...");
      router.push("/dashboard/affiliate");
    } catch (err: any) {
      const msg = err?.message || "Login failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPhone.length < 10) { toast.error("Enter a valid phone number"); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      await sendAffiliateRegistrationOtp(regPhone);
      toast.success("OTP sent to your phone!");
      setRegStep("otp");
      resetOtpDigits();
    } catch (err: any) {
      const msg = err?.message || "Failed to send OTP";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regOtp.length < 4) { toast.error("Enter the 4-digit OTP"); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await verifyAffiliateOtp(regPhone, regOtp);
      setVerifyToken(res.data?.verify_token || "");
      toast.success("Phone verified successfully!");
      setRegStep("details");
    } catch (err: any) {
      const msg = err?.message || "Invalid OTP";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regName.length < 2) { toast.error("Name is too short"); return; }
    if (!regUsername || regUsername.length < 3) { toast.error("Username must be at least 3 characters"); return; }
    if (regPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await registerAffiliate(regName, regPhone, regPassword, verifyToken, regUsername);
      const customer = res.data.user ?? res.data.customer;
      setAuth(customer!, res.data.token);
      toast.success("Account created! Welcome aboard! 🎉");
      router.push("/dashboard/affiliate");
    } catch (err: any) {
      const msg = err?.message || "Registration failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPhone.length < 10) { toast.error("Enter a valid phone number"); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      await forgotAffiliatePasswordOtp(forgotPhone);
      toast.success("OTP sent to your phone!");
      setForgotStep("otp");
      resetOtpDigits();
    } catch (err: any) {
      const msg = err?.message || "Failed to send OTP";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtp.length < 4) { toast.error("Enter the 4-digit OTP"); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      await verifyAffiliateOtp(forgotPhone, forgotOtp);
      toast.success("OTP verified!");
      setForgotStep("reset");
    } catch (err: any) {
      const msg = err?.message || "Invalid OTP";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setIsLoading(true);
    setErrorMsg("");
    try {
      await resetAffiliatePassword(forgotPhone, forgotPassword);
      toast.success("Password reset successful! Please login.");
      switchView("login");
    } catch (err: any) {
      const msg = err?.message || "Password reset failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOtpInputRow = (setter: (val: string) => void) => (
    <div className="flex items-center justify-center gap-3">
      {otpDigits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { otpRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpChange(i, e.target.value, setter)}
          onKeyDown={(e) => handleOtpKeyDown(i, e)}
          className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-300 bg-white shadow-lg shadow-slate-200/50 text-slate-900 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 focus:bg-slate-100 outline-none transition-all duration-300"
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex-1 bg-slate-50 flex relative overflow-hidden">

        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
        }
        @keyframes slideUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes slideRight { from { opacity:0; transform: translateX(-16px); } to { opacity:1; transform: translateX(0); } }
        .animate-slide-up { animation: slideUp 0.4s ease-out both; }
        .animate-slide-right { animation: slideRight 0.4s ease-out both; }
      `}</style>

        <FloatingOrbs />

        <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-center px-12 xl:px-16 relative z-10">
          <div className="animate-slide-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0fa550]/10 border border-[#0fa550]/20 mb-6">
              <span className="text-xs font-bold text-[#0fa550] tracking-wide">অ্যাফিলিয়েট প্রোগ্রাম</span>
            </div>

            <h1 className="text-3xl xl:text-[2.6rem] font-extrabold text-slate-900 leading-[1.3] mb-5 tracking-tight">
              আপনার পছন্দের
              <span className="bg-[#0fa550] bg-clip-text text-transparent"> প্রোডাক্ট শেয়ার করে </span>
              আয় করুন
            </h1>
            <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-md font-medium">
              আমাদের অ্যাফিলিয়েট প্রোগ্রামে যুক্ত হোন এবং আপনার রেফার করা প্রতিটি সফল সেল বা নতুন কাস্টমার সাইনআপ থেকে কমিশন বুঝে নিন। আজই অ্যাকাউন্ট করুন এবং আয় শুরু করুন!
            </p>

            <div className="space-y-4">
              <FeatureCard icon={TakaIcon} title="আকর্ষণীয় কমিশন" desc="প্রতিটি সফল রেফারেল সেলে বুঝে নিন দারুণ সব কমিশন" />
              <FeatureCard icon={TrendingUp} title="রিয়েল-টাইম অ্যানালিটিক্স" desc="আপনার ড্যাশবোর্ড থেকে ক্লিক, কনভার্শন এবং আয় ট্র্যাক করুন" />
              <FeatureCard icon={Users} title="বৃহৎ নেটওয়ার্ক" desc="ইতোমধ্যে আয় করছেন এমন হাজারো সফল অ্যাফিলিয়েটদের সাথে যুক্ত হোন" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 relative z-10">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-200/60 rounded-2xl p-6 sm:p-8">
              {view !== "forgot" && (
                <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
                  {(["login", "register"] as AuthView[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => switchView(v)}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${view === v
                        ? "bg-[#0fa550] text-white shadow-md shadow-[#0fa550]/30"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                      {v === "login" ? "Sign In" : "Create Account"}
                    </button>
                  ))}
                </div>
              )}

              {view === "login" && (
                <div className="animate-slide-up">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-sm text-slate-500 mt-1">Sign in to your affiliate dashboard</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ""))}
                          maxLength={11}
                          placeholder="01XXXXXXXXX"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showLoginPw ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                        />
                        <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="button" onClick={() => switchView("forgot")} className="text-xs text-[#0fa550] hover:text-[#0fa550] transition-colors font-medium">
                        Forgot password?
                      </button>
                    </div>

                    {errorMsg && (
                      <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 animate-slide-up">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#0fa550] hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-[#0fa550]/30 hover:shadow-[#0fa550]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-white"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
                    </button>
                  </form>
                </div>
              )}

              {view === "register" && (
                <div className="animate-slide-up">
                  <StepIndicator currentStep={regStep === "phone" ? 0 : regStep === "otp" ? 1 : 2} steps={["Phone", "Verify", "Details"]} />

                  {regStep === "phone" && (
                    <div className="animate-slide-up">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Get Started</h2>
                        <p className="text-sm text-slate-500 mt-1">Enter your phone number to begin</p>
                      </div>
                      <form onSubmit={handleRegSendOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
                          <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel"
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                              maxLength={11}
                              placeholder="01XXXXXXXXX"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                              autoFocus
                            />
                          </div>
                        </div>
                        {errorMsg && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 animate-slide-up">
                            {errorMsg}
                          </div>
                        )}
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#0fa550] hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-[#0fa550]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Send OTP</span><ArrowRight size={16} /></>}
                        </button>
                      </form>
                    </div>
                  )}

                  {regStep === "otp" && (
                    <div className="animate-slide-up">
                      <button onClick={() => { setRegStep("phone"); setErrorMsg(""); resetOtpDigits(); }} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4" disabled={isLoading}>
                        <ArrowLeft size={14} /> Back
                      </button>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0fa550]/10 border border-[#0fa550] mb-3">
                          <Shield size={24} className="text-[#0fa550]" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Verify Phone</h2>
                        <p className="text-sm text-slate-500 mt-1">
                          We sent a code to <span className="text-[#0fa550] font-medium">{regPhone}</span>
                        </p>
                      </div>
                      <form onSubmit={handleRegVerifyOtp} className="space-y-5">
                        {renderOtpInputRow(setRegOtp)}
                        {errorMsg && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 animate-slide-up">
                            {errorMsg}
                          </div>
                        )}
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#0fa550] hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-[#0fa550]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Verify OTP</span><CheckCircle2 size={16} /></>}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            try { await sendAffiliateRegistrationOtp(regPhone); toast.success("OTP resent!"); resetOtpDigits(); } catch { toast.error("Failed to resend OTP"); }
                          }}
                          className="w-full text-center text-xs text-slate-900/40 hover:text-[#0fa550] transition-colors"
                        >
                          Didn't receive? Resend OTP
                        </button>
                      </form>
                    </div>
                  )}

                  {regStep === "details" && (
                    <div className="animate-slide-up">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0fa550]/10 border border-[#0fa550] mb-3">
                          <Sparkles size={24} className="text-[#0fa550]" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Almost There!</h2>
                        <p className="text-sm text-slate-500 mt-1">Complete your profile to get started</p>
                      </div>
                      <form onSubmit={handleRegComplete} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
                          <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">Username</label>
                          <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={regUsername}
                              onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                              placeholder="Choose a username"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Lowercase letters, numbers, hyphens/underscores only</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showRegPw ? "text" : "password"}
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder="Min 6 characters"
                              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                            />
                            <button type="button" onClick={() => setShowRegPw(!showRegPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                              {showRegPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Must be at least 6 characters</p>
                        </div>
                        {errorMsg && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 animate-slide-up">
                            {errorMsg}
                          </div>
                        )}
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#0fa550] hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-[#0fa550]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Create Account</span><Sparkles size={16} /></>}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {view === "forgot" && (
                <div className="animate-slide-up">
                  <button onClick={() => switchView("login")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4" disabled={isLoading}>
                    <ArrowLeft size={14} /> Back to Login
                  </button>

                  <StepIndicator currentStep={forgotStep === "phone" ? 0 : forgotStep === "otp" ? 1 : 2} steps={["Phone", "Verify", "Reset"]} />

                  {forgotStep === "phone" && (
                    <div className="animate-slide-up">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Forgot Password</h2>
                        <p className="text-sm text-slate-500 mt-1">We'll send you a code to reset it</p>
                      </div>
                      <form onSubmit={handleForgotSendOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
                          <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel"
                              value={forgotPhone}
                              onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ""))}
                              maxLength={11}
                              placeholder="01XXXXXXXXX"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                              autoFocus
                            />
                          </div>
                        </div>
                        {errorMsg && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 animate-slide-up">
                            {errorMsg}
                          </div>
                        )}
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#0fa550] hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-[#0fa550]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Send OTP</span><ArrowRight size={16} /></>}
                        </button>
                      </form>
                    </div>
                  )}

                  {forgotStep === "otp" && (
                    <div className="animate-slide-up">
                      <button onClick={() => { setForgotStep("phone"); setErrorMsg(""); resetOtpDigits(); }} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4" disabled={isLoading}>
                        <ArrowLeft size={14} /> Back
                      </button>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0fa550]/10 border border-[#0fa550] mb-3">
                          <Shield size={24} className="text-[#0fa550]" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Verify Phone</h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Code sent to <span className="text-[#0fa550] font-medium">{forgotPhone}</span>
                        </p>
                      </div>
                      <form onSubmit={handleForgotVerifyOtp} className="space-y-5">
                        {renderOtpInputRow(setForgotOtp)}
                        {errorMsg && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 animate-slide-up">
                            {errorMsg}
                          </div>
                        )}
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#0fa550] hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-[#0fa550]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Verify OTP</span><CheckCircle2 size={16} /></>}
                        </button>
                      </form>
                    </div>
                  )}

                  {forgotStep === "reset" && (
                    <div className="animate-slide-up">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">New Password</h2>
                        <p className="text-sm text-slate-500 mt-1">Choose a strong new password</p>
                      </div>
                      <form onSubmit={handleForgotReset} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">New Password</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showForgotPw ? "text" : "password"}
                              value={forgotPassword}
                              onChange={(e) => setForgotPassword(e.target.value)}
                              placeholder="Min 6 characters"
                              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:border-[#0fa550] focus:ring-2 focus:ring-[#0fa550]/20 outline-none transition-all duration-300 text-sm"
                              autoFocus
                            />
                            <button type="button" onClick={() => setShowForgotPw(!showForgotPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                              {showForgotPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        {errorMsg && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 animate-slide-up">
                            {errorMsg}
                          </div>
                        )}
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#0fa550] hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-[#0fa550]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Reset Password</span><CheckCircle2 size={16} /></>}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-200/60 text-center">
                <p className="text-xs text-slate-400">
                  Not an affiliate?{" "}
                  <Link href="/login" className="text-[#0fa550] hover:text-[#0fa550] font-medium transition-colors">
                    Customer Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
