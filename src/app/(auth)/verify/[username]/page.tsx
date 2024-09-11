"use client";
 
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VerificationCodeScehma } from "@/validation/verifySchema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof VerificationCodeScehma>>({
    resolver: zodResolver(VerificationCodeScehma),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof VerificationCodeScehma>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast({
        description: response.data.message,
        duration: 3000,
      });
      if (router) router.replace(`/sign-in`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verification
        </h1>
        <p className="text-gray-600">Please Verify your account</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">OTP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your OTP"
                      type="string"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-gray-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;