'use client';

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/providers/AuthProvider";
import Cookies from "js-cookie";

function LoginFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectUrl = searchParams.get("redirect") || (user.affiliate_approved ? "/dashboard/affiliate" : "/dashboard/customer");
      router.replace(redirectUrl);
    }
  }, [user, searchParams, router]);

  const handleSuccess = () => {
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      const userCookie = Cookies.get("sirajtech_user");
      if (userCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userCookie));
          if (userData.affiliate_approved || userData.role === "affiliate") {
            router.push("/dashboard/affiliate");
            return;
          }
        } catch (e) {}
      }
      router.push("/dashboard/customer");
    }
  };

  return (
    <LoginForm
      onSuccess={handleSuccess}
      onSwitchToRegister={() => router.push("/register")}
      onSwitchToForgot={() => router.push("/forgot-password")}
    />
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 bg-section-alt flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[calc(100vh-200px)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-2">
          Login & Register
        </h1>
        <p className="text-sm text-slate-500 px-2">
          Log in or create an account to manage your orders and track deliveries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border">
          <Suspense fallback={<div className="h-48 flex items-center justify-center text-sm text-slate-400">Loading...</div>}>
            <LoginFormContainer />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
