"use client";
//import { useSession, signIn, signOut } from "next-auth/react";
// export default function Component(){
//   const {data:session}=useSession()
//   if(session){
//     return(
//       <>
//       Signed in as {session.user.email} <br />
//       <button onClick={()=>signOut()}> Sign out</button>
//       </>
//     )
//   }
//   return (
//     <>
//     Not Signed in <br />
//     <button onClick={()=>signIn} className='bg-red-500 px-3 py-3 rounded-lg mx-3 my-3'>Sign in</button>
//     </>
//   )
// }
"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
 
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/validation/signInSchema";
 
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
import { signIn } from "next-auth/react";
import { AxiosError } from "axios";

const page = () => {
 
  const [isSubmitting, setisSubmitting] = useState(false);
 
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier:"",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setisSubmitting(true);
    try {
      const signingIn = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      });

      console.log(`this is line 71 at signinin in`,signingIn)

      if( signingIn?.error){
         toast({
             title:"Login unsuccessful!",
             description:"Incorrect Credentials or password",
             variant:'destructive',
             className:'bg-gray-800 text-white'
         })
      }
      if( signingIn?.url){
        toast({
          title:"Login successful!",
          variant:'destructive',
          className:'bg-gray-800 text-white'

      })
        router.replace(`/dashboard`);
      }

       setisSubmitting(false);
    } catch (error) {
      console.error("Error during sign-in! Please try again", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signin failed",
        description: errorMessage,
        variant: "destructive",
        className:'bg-gray-800 text-white'

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
            <p className="">Signin to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
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
                  "Signin"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Not a member?{" "}
              <Link
                href="/sign-up"
                className="text-blue-500
            hover:text-blue-800"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
