'use client';

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { loginCustomer } from "@/lib/api/auth"
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
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  phone: z.string().min(10, { message: "Phone number is too short." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
  onSwitchToForgot: () => void
  onClose?: () => void
}

import { useAuth } from "@/providers/AuthProvider"

export function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToForgot, onClose }: LoginFormProps) {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    setErrorMsg("")
    try {
      await login(values.phone, values.password)
      onSuccess()
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Enter your phone and password to login
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="01XXXXXXXXX" 
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#0fa550] transition-colors"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Password</FormLabel>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs font-semibold text-[#0fa550] hover:text-[#0c8c43]"
                    type="button"
                    onClick={onSwitchToForgot}
                  >
                    Forgot password?
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#0fa550] transition-colors pr-10"
                      {...field} 
                    />
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
              "Log in"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm flex flex-col gap-4">
        <div className="text-slate-600">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 font-bold text-[#0fa550] hover:text-[#0c8c43]"
            onClick={onSwitchToRegister}
          >
            Register here
          </Button>
        </div>
        <div className="text-slate-500 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5">
          <span>Are you an Affiliate?</span>
          <Link href="/become-an-affiliate" onClick={onClose} className="text-[#0fa550] font-bold hover:underline">
            Login / Register here
          </Link>
        </div>
      </div>
    </div>
  )
}
