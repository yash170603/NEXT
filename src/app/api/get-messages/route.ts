import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { createErrorResponse } from "@/types/responseUtils";
import mongoose from "mongoose";


export async function GET(request: Request) {
  await dbConnect();
  console.log("lauda lassan");
  const session = await getServerSession(authOptions);
  console.log(`this is the session at route get-messsages`, session);
  if (!session || !session.user) {
    return createErrorResponse("Not Authenticated", 401);
  }
  const current_User = session?.user;

  const userId = new mongoose.Types.ObjectId(current_User?._id);
  console.log(userId);
  try {
    const userMessages = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log(`This is user at line 32,`, userMessages);

    if (!userMessages) {
      console.log("bhakk");
      return createErrorResponse("No User found", 402);
    }
    if (userMessages.length == 0) {
      console.log("bhaininkk");
      //  return createErrorResponse("No messages found right now",200)
      return Response.json(
        {
          message: "No messages found right now",
          success: false,
          messages: [],
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("There was an error in fetching message", error);
    return createErrorResponse("here was an error in fetching message", 500);
  }
}
