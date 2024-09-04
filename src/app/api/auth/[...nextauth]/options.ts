 
import bcrypt from "bcryptjs";
import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { JWT } from "next-auth/jwt";

interface CustomJWT extends JWT {
  _id?: string;
  isVerified?: boolean;
  isAcceptingMessages?: boolean;
  username?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier  },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }:{token:JWT,user:User}) {
      const customToken = token as CustomJWT;
      console.log(`This is the user line 60`,user)
      if (user) {
        customToken._id = user._id?.toString();
        customToken.isVerified = user.isVerified;
        customToken.isAcceptingMessages = user.isAcceptingMessages;
        customToken.username = user.username;
      }
      console.log(`this is the custom token after filling it up   line 67`, customToken)
      return customToken;
    },
    async session({session,token}:{session:Session,token:JWT}){

      const customToken = token as CustomJWT;
      console.log(` this is line 73 session`,session)
      console.log( ` this is line 74 token, recieved int the call back`,token)
      console.log(`this is the custom token at line 75`,customToken)
      session.user._id = customToken._id;
      session.user.isVerified = customToken.isVerified;
      session.user.isAcceptingMessages = customToken.isAcceptingMessages;
      session.user.username = customToken.username;
        
      console.log(` this is the session at line 81`,session)
      return session;
    }
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
