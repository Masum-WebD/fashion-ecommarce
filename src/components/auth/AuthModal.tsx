'use client';

import { useState } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { RegisterFlow } from "./RegisterFlow"
import { ForgotPasswordFlow } from "./ForgotPasswordFlow"
import { toast } from "sonner"

type AuthView = "login" | "register" | "forgot_password"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultView?: AuthView
  onSuccess?: () => void
}

export function AuthModal({ open, onOpenChange, defaultView = "login", onSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView)

  const handleSuccess = (message: string) => {
    toast.success(message)
    onOpenChange(false)
    if (onSuccess) onSuccess()
  }

  // Reset view when modal is closed so next time it opens fresh
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => setView(defaultView), 300)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-6">
        <div className="relative w-full h-full min-h-[350px] flex flex-col justify-center">
          {view === "login" && (
            <LoginForm
              onSuccess={() => handleSuccess("Successfully logged in")}
              onSwitchToRegister={() => setView("register")}
              onSwitchToForgot={() => setView("forgot_password")}
              onClose={() => onOpenChange(false)}
            />
          )}

          {view === "register" && (
            <RegisterFlow
              onSuccess={() => handleSuccess("Account created successfully")}
              onSwitchToLogin={() => setView("login")}
            />
          )}

          {view === "forgot_password" && (
            <ForgotPasswordFlow
              onSuccess={() => {
                toast.success("Password reset successfully")
                setView("login")
              }}
              onSwitchToLogin={() => setView("login")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
