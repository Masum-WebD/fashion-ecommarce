'use client';

import { useRouter } from "next/navigation";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <main className="flex-1 bg-section-alt flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[calc(100vh-200px)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border">
          <ForgotPasswordFlow
            onSuccess={() => router.push("/login")}
            onSwitchToLogin={() => router.push("/login")}
          />
        </div>
      </div>
    </main>
  );
}
