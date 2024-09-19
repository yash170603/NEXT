import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { authOptions } from "../auth/[...nextauth]/options";
import {

  createErrorResponse,
} from "@/types/responseUtils";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  console.log(`THis is the session at accept-message`,session)
  if (!session || !session.user) {
    return createErrorResponse("Not Authenticated", 401);
  }
  const current_User = session.user;

  const userId = current_User._id;

  const { acceptMessages } = await request.json();

  try {
    const userBeingUpdated = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!userBeingUpdated) {
      return createErrorResponse(
        "failed to update user status to accept messages",
        401
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        userBeingUpdated,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages ", error);
    return createErrorResponse(
      "failed to update user status to accept messages ",
      500
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return createErrorResponse("Not Authenticated", 401);
  }
  const current_User = session.user;

  const userId = current_User._id;
  try {
    const user_required = await UserModel.findById(userId);
    if (!user_required) {
      return createErrorResponse("User not found", 404);
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: user_required.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "There was an erorr in getting message Acceptance of the user",
      error
    );
    return createErrorResponse(
      "There was an erorr in getting message Acceptance of the user",
      500
    );
  }
}
