'use client';

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  sendRegistrationOtp,
  verifyOtp,
  registerCustomer,
} from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react"

type Step = "phone" | "otp" | "details"

const phoneSchema = z.object({
  phone: z.string().min(10, { message: "Enter a valid phone number" }),
})

const otpSchema = z.object({
  otp: z.string().min(4, { message: "Enter the OTP" }),
})

const detailsSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

interface RegisterFlowProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

import { useAuth } from "@/providers/AuthProvider"

export function RegisterFlow({ onSuccess, onSwitchToLogin }: RegisterFlowProps) {
  const { setAuth } = useAuth()
  const [step, setStep] = useState<Step>("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // State to hold data between steps
  const [phone, setPhone] = useState("")
  const [verifyToken, setVerifyToken] = useState("")

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  const detailsForm = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: "", password: "" },
  })

  async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
    setIsLoading(true)
    setErrorMsg("")
    try {
      await sendRegistrationOtp(values.phone)
      setPhone(values.phone)
      setStep("otp")
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setIsLoading(true)
    setErrorMsg("")
    try {
      const res = await verifyOtp(phone, values.otp)
      if (res.data?.verify_token) {
        setVerifyToken(res.data.verify_token)
      }
      setStep("details")
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onDetailsSubmit(values: z.infer<typeof detailsSchema>) {
    setIsLoading(true)
    setErrorMsg("")
    try {
      const res = await registerCustomer(values.name, phone, values.password, verifyToken)
      if (res.data && res.data.token && (res.data.user || res.data.customer)) {
        setAuth(res.data.user ?? res.data.customer!, res.data.token)
      }
      onSuccess()
    } catch (error: any) {
      setErrorMsg(error.message || "Registration failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full relative overflow-hidden">
      {/* PHONE STEP */}
      {step === "phone" && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Enter your phone number to get started
            </p>
          </div>

          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
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

          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Button variant="link" className="p-0 font-bold text-[#0fa550] hover:text-[#0c8c43]" onClick={onSwitchToLogin}>
              Log in instead
            </Button>
          </div>
        </div>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <Button
            variant="ghost"
            className="mb-4 -ml-4"
            onClick={() => setStep("phone")}
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

      {/* DETAILS STEP */}
      {step === "details" && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Complete Setup</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Enter your details to finish creating your account
            </p>
          </div>

          <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4">
              <FormField
                control={detailsForm.control}
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
                control={detailsForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Password</FormLabel>
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
                    <FormDescription>
                      Must be at least 6 characters.
                    </FormDescription>
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
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
