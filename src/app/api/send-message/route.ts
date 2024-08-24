import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { MessageModel,MessageSchema} from "@/model/Message";
import { createErrorResponse, createSuccessResponse } from "@/types/responseUtils";
import { Message} from "postcss";

export async function POST(request:Request) {
    await dbConnect();
    
    const{username,content}= await request.json();
    try{
        const user = await UserModel.findOne({username})
        if(!user){
            return createErrorResponse("No user found",404)
        }

        if( user.isAcceptingMessage){
            return createErrorResponse("User is not accepting messages",403)
        }

        const newMessage=  new MessageModel({content, createdAt:new Date()});
         user.messages.push(newMessage )
         await user.save();
           
            return createSuccessResponse("Message sent successfully",200)
        
         }
    catch(error){
       console.log("There was an error in sending message",error);
       return createErrorResponse("here was an error in sending message",500)
    }
}