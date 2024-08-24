import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/types/responseUtils";
import mongoose from "mongoose";
 

export async function GET(request:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return createErrorResponse("Not Authenticated", 401);
    }
    const current_User = session.user;
  
    const userId = new mongoose.Types.ObjectId(current_User._id);
    try {
         const user= await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
         ])

         if( !user || user.length ===0){
            return createErrorResponse("User not found",401)
         }

         return Response.json({
            success:true,
            messages:user[0].messages
         },{status:200})

    } catch (error) {
      console.log("There was an error in fetching message",error);
      return createErrorResponse("here was an error in fetching message",500)
    }
}