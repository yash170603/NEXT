import { use } from "react";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/validation/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json(); // this is from the frontend
    const decodedUsername = decodeURIComponent(username);

    const userExists = await UserModel.findOne({ username: decodedUsername });
    if (!userExists) {
      return Response.json(
        {
          success: false,
          message: "There is no such user",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeEqual = userExists.verifyCode === code;
    const isCodenotExpired = new Date(userExists.verifyCodeExpiry) > new Date();
    if (isCodeEqual && isCodenotExpired) {
      userExists.isVerified = true;
      await userExists.save();
      return Response.json(
        {
          success: true,
          message: "Account is now verified",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeEqual || !isCodenotExpired) {
      if (!isCodeEqual) {
        return Response.json(
          {
            success: false,
            message: "The verification code is wrong",
          },
          {
            status: 400,
          }
        );
      } else
        return Response.json(
          {
            success: false,
            message: "Verification code has expired",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("There was in error in verifying user ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
