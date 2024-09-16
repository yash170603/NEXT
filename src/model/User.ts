import mongoose, { Schema, Document, Model } from "mongoose";
import { Message, MessageSchema ,MessageModel} from './Message'


export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: InstanceType<typeof MessageModel>[]; // array of message Documents
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification code expiry is required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },

  messages: {
    type: [MessageModel],
  },
});

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel




// // Define an interface for the User document
// interface IUser extends Document {
//     name: string;
//     email: string;
//     age: number;
//   }
  
//   // Define the User schema
//   const userSchema: Schema<IUser> = new Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     age: { type: Number, required: true },
//   });
  
//   // Create the User model
//   const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);




//   const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   age: Number,
// });
// const User = mongoose.model('User', userSchema);
