// "use client";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "./ui/button";
// import { X } from "lucide-react";
// import { Message } from "@/model/User";
// import {  useToast } from "./ui/use-toast";
// import axios from "axios";
// import { ApiResponse } from "@/types/ApiResponse";

// type MessageCardProps = {
//   message:  Message;
//   OnMessageDelete: (messageId: string) => void;
// };

// const MessageCard = ({ message, OnMessageDelete }: MessageCardProps) => {
//   const { toast } = useToast();
//   const handleDeleteConfirm = async (id:any) => {
//     const id_ = String(id);
//     const response = await axios.delete<ApiResponse>(
//       `/api/delete-message/${id_}`
//     );
//     toast({ title: response.data.message });
//     OnMessageDelete(id_);
//   };

//   return (
//     <Card className="bg-pink-200">
//       <CardHeader>
//         <CardTitle>{message.content}</CardTitle>
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <Button variant="destructive" className="bg-pink-700">
//               {" "}
//               <X />{" "}
//             </Button>
//           </AlertDialogTrigger>
//           <AlertDialogContent className="bg-gray-500">
//             <AlertDialogHeader >
//               <AlertDialogTitle className="text-gray-950">Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription className="text-gray-900">
//                 This action cannot be undone.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={() => handleDeleteConfirm(message._id)}
//               >
//                 Continue
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
        
//       </CardHeader>
//       <CardContent></CardContent>
//     </Card>
//   );
// };

// export default MessageCard;


"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  OnMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, OnMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
 console.log(message)
  const handleDeleteConfirm = async (id: any) => {
    const id_ = String(id);
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${id_}`);
    console.log(`this is 120 page.tsx`,response)
    toast({
       title: response.data.message,
       variant: "destructive",
       className: "bg-gray-800 text-white",
     });
    OnMessageDelete(id_);
  };

  return (
    <Card className="bg-gray-200 shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105 duration-200">
      <CardHeader className="relative bg-gray-800 p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="text-white" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-300 rounded-lg shadow-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-gray-800 font-semibold">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 mt-2">
                This action is irreversible. Do you still want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 flex justify-end gap-2">
              <AlertDialogCancel className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-semibold py-2 px-4 rounded-md">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteConfirm(message._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardTitle className="text-white font-semibold text-center">
          {message.content}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <CardDescription className="text-gray-700">
          Posted on: {new Date(message.createdAt).toLocaleDateString()}
          <br />
          At: {new Date(message.createdAt).toLocaleTimeString()}
          
        </CardDescription>
      </CardContent>
     
    </Card>
  );
};

export default MessageCard;
