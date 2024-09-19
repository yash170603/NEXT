"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message,MessageModel } from "@/model/Message";
import { ApiResponse } from "@/types/ApiResponse";
import { acceptMessageSchema } from "@/validation/acceptMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";

import { getSession, useSession } from "next-auth/react";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      console.log("This is testing response at line 38 at dashbaord")
      console.log( response.data)
      setValue(acceptMessages, response.data.isAcceptingMessages);
    } catch (error) {
      if (error instanceof TypeError) {
        // Handle TypeError differently, or log it and continue
        //console.log("TypeError caught, but ignoring:", error);
      } else {
        const axiosError = error as AxiosError;
        console.log(`this is the error at line 42`, axiosError);
        toast({
          title: "Error",
          description: axiosError.message || "Failed to fetch message settings line 47",
          variant: "destructive",
        });
      }
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
          const session= await getSession();
          console.log(`This is the session o line 60 at dashbaord.tsx`,session)
        const response = await axios.get("/api/get-messages");
        console.log(`This is the response form the line 63 at dashboard, after the api call of get messages`,response)
        console.log(`this is the response.data.messages`,response.data.messages);
        toast({
          description:response.data.message,
          variant:"destructive"
        })
        setMessages(response.data.messages || []);
      
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
            variant:"destructive"
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log(`THis is the axiosError, idk why but fuck this `,axiosError)
        if( axiosError){
          toast({
            title: "Error",
            description:
              axiosError?.response?.data.message||
              "Failed to fetch message settings",
            variant: "destructive",
          });
        }
        
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "destructive",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("There was an error at dashboard, line 98", axiosError);
      toast({
        title: "Error during fetching messages",
        description: axiosError?.response?.data.message,
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  const { username } = session.user;
  const baseUrl = `${window.location.protocol} || ${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url copied!",
      description: "Url has been copied to clipboard",
    });
  };

  return (
    <div className=" bg-black my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4"> User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2"> Copy your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />

        <span className="ml-2">
          Accept Messages:{acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="destructive"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key ={String(message._id)}  
              message={message}
              OnMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <>NO Message to display</>
        )}
      </div> */}
    </div>
  );
};

export default page;
