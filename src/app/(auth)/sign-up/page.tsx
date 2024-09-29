"use client"

import React, { useEffect, useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/validation/signUpSchema"
import dbConnect from "@/lib/dbConnect"
import axios, { AxiosError } from "axios"
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
import { Loader2, Mail, Lock, User } from "lucide-react"

const SignUpPage = () => {
  const [username, setUsername] = useState("")
  const [userNameMessage, setUserNameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      await dbConnect()
      if (username) {
        setIsCheckingUsername(true)
        setUserNameMessage("")
        try {
          const usernameExists = await axios.get(
            `/api/check-unique-username?username=${username}`
          )
          console.log(
            `This is the response from the check username api, at line 48 in sign-up`,
            usernameExists
          )
          setUserNameMessage(usernameExists.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          console.log(
            `This is the axiosError on line 52, at sign-up page,tsx`,
            axiosError
          )
          setUserNameMessage(
            axiosError.response?.data.message ??
              "Error checking unique username "
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)
      console.log(`This is line 69 , before toast`, response.data.message)
      toast({
        title: "Success",
        description: response.data.message,
        duration: 3000,
        className: 'bg-gray-500 text-white'
      })
      if (router) router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Signup failed",
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
          <p className="text-gray-400">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </div>
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin text-blue-500 mt-2" />
                  )}
                  <p
                    className={`text-sm mt-1 ${
                      userNameMessage === "Username is unique"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {userNameMessage}
                  </p>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Enter your email"
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
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage