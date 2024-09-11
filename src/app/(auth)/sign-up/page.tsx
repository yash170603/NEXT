"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/validation/signUpSchema";
import dbConnect from "@/lib/dbConnect";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [userNameMessage, setuserNameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      await dbConnect();
      if (username) {
        setIsCheckingUsername(true);
        setuserNameMessage("");
        try {
          const usernameExists = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          console.log(
            `This is the response from the check username api, at line 48 in sign-up`,
            usernameExists
          );
          setuserNameMessage(usernameExists.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(
            `This is the axiosError on line 52, at sign-up page,tsx`,
            axiosError
          );
          setuserNameMessage(
            axiosError.response?.data.message ??
              "Error chekcing unique username "
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(`This is line 69 , before toast`, response.data.message);
      toast({
        title: "Success",
        description: response.data.message,
        duration: 3000,
      });
      if (router) router.replace(`/verify/${username}`);
      setisSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setisSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center  h-screen bg-gray-400">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="">Sign up to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}

                    <p
                      className={`text-sm ${
                        userNameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {userNameMessage}
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="text-blue-500
            hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
