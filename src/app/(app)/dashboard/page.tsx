"use client";
import { useState, useCallback, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Copy, Moon, Sun } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { acceptMessageSchema } from "@/validation/acceptMessage";

const Switch = ({ checked, onCheckedChange, disabled }:{checked:any,onCheckedChange:any,disabled:any}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={onCheckedChange}
    className={`
      relative inline-flex items-center h-6 rounded-full w-11 
      transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      ${checked ? 'bg-blue-600' : 'bg-gray-400'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <span className="sr-only">Toggle messages</span>
    <span
      className={`
        inline-block w-5 h-5 transform transition-transform duration-300 ease-in-out bg-white rounded-full shadow-md
        ${checked ? 'translate-x-6' : 'translate-x-0.5'}
      `}
    />
  </button>
);

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            error.response?.data.message || "Failed to fetch message settings",
          variant: "destructive",
        });
      }
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
            variant: "destructive",
            className: "bg-gray-800 text-white",
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: "Error",
            description:
              error.response?.data.message || "Failed to fetch messages",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
        className: "bg-gray-800 text-white",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            error.response?.data.message || "Failed to update message settings",
          variant: "destructive",
          className:'bg-gray-800 text-white'

        });
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 dark:text-white text-xl">
        Please login to access the dashboard
      </div>
    );
  }

  const { username } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied!",
      description: "URL has been copied to clipboard",
      variant: "default",
      className: "bg-gray-800 text-white",
    });
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center">
            {isDarkMode ? <Moon className="mr-2" /> : <Sun className="mr-2" />}{" "}
            User Dashboard
          </h1>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            className="text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-600"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <div
          className={`rounded-lg shadow-lg p-6 mb-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Your Unique Link</h2>
          <div
            className={`flex items-center rounded-md overflow-hidden ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="flex-grow bg-transparent p-3 outline-none"
            />
            <Button onClick={copyToClipboard} variant="ghost" className="p-3">
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          className={`rounded-lg shadow-lg p-6 mb-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              Accepting Messages Status
            </span>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {acceptMessages
              ? "You are currently accepting messages"
              : "You are not accepting messages"}
          </p>
        </div>

        <div
          className={`rounded-lg shadow-lg p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Messages</h2>
            <Button
              onClick={() => fetchMessages(true)}
              variant="outline"
              size="sm"
              className={`${
                isDarkMode
                  ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  OnMessageDelete={handleDeleteMessage}
                  // isDarkMode={isDarkMode}
                />
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-12 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              No messages to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
}