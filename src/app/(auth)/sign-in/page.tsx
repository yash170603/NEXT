"use client"

import React, { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/validation/signInSchema"
import { ApiResponse } from "@/types/ApiResponse"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import { AxiosError } from "axios"

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const signingIn = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      console.log(`this is line 71 at signinin in`, signingIn)

      if (signingIn?.error) {
        toast({
          title: "Login unsuccessful!",
          description: "Incorrect Credentials or password",
          variant: 'destructive',
          className: 'bg-red-500 text-white'
        })
      }
      if (signingIn?.url) {
        toast({
          title: "Login successful!",
          variant: 'default',
          className: 'bg-gray-500 text-white'
        })
        router.replace(`/dashboard`)
      }

      setIsSubmitting(false)
    } catch (error) {
      console.error("Error during sign-in! Please try again", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Signin failed",
        description: errorMessage,
        variant: "destructive",
        className: 'bg-gray-500 text-white'
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl mb-6">
            Mystery Message
          </h1>
          <p className="text-gray-400">Sign in to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username/Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Enter your username or email"
                        {...field}
                        className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Not a member?{" "}
            <Link
              href="/sign-up"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage