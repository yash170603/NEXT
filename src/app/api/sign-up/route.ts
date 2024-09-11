import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import axios from "axios";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
 
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const verifiedUserExistswithUsername = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (verifiedUserExistswithUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }
    const UserExistswithEmail = await UserModel.findOne({
      email: email,
    });
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    if (UserExistswithEmail) {
      if (UserExistswithEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        UserExistswithEmail.password = hashedPassword;
        UserExistswithEmail.verifyCode = OTP;
        UserExistswithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await UserExistswithEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username: username,
        email: email,
        password: hashedPassword,
        verifyCode: OTP,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

      
    const sendMail= await sendVerificationEmail(email,username,OTP);
    console.log(`This is the sendMail object logged -`)
      console.log(sendMail);
      if( !sendMail){
        return Response.json({
          message:'There was an error during  sending  verification email',
          success:false
        },{
          status:500
        })
      }
    return Response.json(
      {
        success: true, 
        message: "User registered successfully. Please verify your email !",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("There was an error  in registration", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
