
'use client'

import { useParams } from "next/navigation"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Loader2, Send, User, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { CoreMessage } from "ai"

const formSchema = z.object({
  message: z.string().min(10, "Message should be at least 10 characters long"),
})

export default function EnhancedPublicProfileMessage() {
  const { username } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const { toast } = useToast()
  const [avatarUrl, setAvatarUrl] = useState("")
  const[suggestions,setSuggestions]= useState<any>();
  const[isSuggesting, setIsSuggesting]= useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  useEffect(() => {
    // Simulating avatar fetch
    setAvatarUrl(`https://api.dicebear.com/9.x/initials/svg?seed=${username}`)
  }, [username])

  const onSubmit = async (content: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: content.message,
      })
      console.log(response)
      toast({
        title: "Success!",
        description: response.data.message || "Message was sent",
        className: "bg-gray-800 text-white",
        variant: "destructive",

      })
      form.reset()
      setCharCount(0)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
        className: "bg-gray-800 text-white",

      })
    } finally {
      setIsSubmitting(false)
    }
  }

  
    
  const getResponse = async () => {
         setIsSuggesting(true)
         try {
          const result = await axios.post("/api/suggest-messages")
          setSuggestions(result)
          console.log(result)
         } catch (error) {
          const axiosError = error as AxiosError;
            console.log(axiosError)
         }
         finally{
          setIsSuggesting(false)
         }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl"
      >
        <div className="text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={avatarUrl} alt={String(username)} />
            <AvatarFallback><User className="w-12 h-12" /></AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-gray-100">Send a Message</h1>
          <p className="text-xl text-gray-400">to {username}&apos;s Public Profile</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Type your message here..."
                        {...field}
                        className="min-h-[120px] bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg resize-none"
                        onChange={(e) => {
                          field.onChange(e)
                          setCharCount(e.target.value.length)
                        }}
                      />
                      <AnimatePresence >
                        {charCount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-2 right-2 text-sm text-gray-400"
                          >
                            {charCount} / 280
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-700 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-gray-500 text-sm">
          <MessageSquare className="inline-block mr-2 h-4 w-4" />
          Your message will be delivered instantly
        </div>
      </motion.div>


      {/* <section>
          <div>
          <Button
              type="submit"
              disabled={isSuggesting}
              onClick={()=>getResponse()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-700 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-105"
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Suggesting Messages, Please wait!...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Suggest Messages!
                </>
              )}
            </Button>
          </div>
      </section> */}
    </div>
  )
}