"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { VerificationCodeScehma } from "@/validation/verifySchema"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ApiResponse } from "@/types/ApiResponse"

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof VerificationCodeScehma>>({
    resolver: zodResolver(VerificationCodeScehma),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof VerificationCodeScehma>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      })
      toast({
        description: response.data.message,
        duration: 3000,
        className: 'bg-green-500 text-white'
      })
      if (router) router.replace(`/sign-in`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in verification of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
        className: 'bg-red-500 text-white'
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Verify Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Please enter the verification code sent to your email
          </p>
        </div>
        <div className="mt-8 bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-300">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Input
                          type="text"
                          {...field}
                          className="block w-full pl-10 sm:text-sm border-gray-700 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter 6-digit code"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="mt-2 text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Account"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount