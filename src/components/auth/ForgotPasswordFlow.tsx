'use client';

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { forgotPasswordOtp, verifyOtp, resetPassword } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react"

type Step = "request" | "otp" | "reset"

const requestSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  phone: z.string().min(10, { message: "Enter a valid phone number" }),
})

const otpSchema = z.object({
  otp: z.string().min(4, { message: "Enter the OTP" }),
})

const resetSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

interface ForgotPasswordFlowProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export function ForgotPasswordFlow({
  onSuccess,
  onSwitchToLogin,
}: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<Step>("request")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [phone, setPhone] = useState("")

  const requestForm = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { name: "", phone: "" },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "" },
  })

  async function onRequestSubmit(values: z.infer<typeof requestSchema>) {
    setIsLoading(true)
    setErrorMsg("")
    try {
      await forgotPasswordOtp(values.name, values.phone)
      setPhone(values.phone)
      setStep("otp")
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send reset request.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setIsLoading(true)
    setErrorMsg("")
    try {
      await verifyOtp(phone, values.otp)
      setStep("reset")
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true)
    setErrorMsg("")
    try {
      await resetPassword(phone, values.password)
      onSuccess()
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to reset password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full relative overflow-hidden">
      {/* REQUEST STEP */}
      {step === "request" && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <Button
            variant="ghost"
            className="mb-4 -ml-4"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Button>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Forgot Password</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Enter your details to receive an OTP
            </p>
          </div>

          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
              <FormField
                control={requestForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#0fa550] transition-colors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={requestForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#0fa550] transition-colors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMsg && (
                <div className="text-sm text-destructive font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <Button type="submit" className="w-full group h-12 rounded-xl bg-[#0fa550] hover:bg-[#0c8c43] text-white font-bold text-base shadow-md shadow-[#0fa550]/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <Button
            variant="ghost"
            className="mb-4 -ml-4"
            onClick={() => setStep("request")}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Verify Phone</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              We sent a code to <span className="font-medium text-foreground">{phone}</span>
            </p>
          </div>

          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center">
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMsg && (
                <div className="text-sm text-destructive font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl bg-[#0fa550] hover:bg-[#0c8c43] text-white font-bold text-base shadow-md shadow-[#0fa550]/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* RESET STEP */}
      {step === "reset" && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Enter your new password for <span className="font-medium text-foreground">{phone}</span>
            </p>
          </div>

          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 uppercase tracking-wide">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#0fa550] transition-colors pr-10" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMsg && (
                <div className="text-sm text-destructive font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl bg-[#0fa550] hover:bg-[#0c8c43] text-white font-bold text-base shadow-md shadow-[#0fa550]/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
