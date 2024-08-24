
import { z } from "zod";

export const usernameValidation=z.string()
.min(2,"must be atleast of length 2")
.max(20,"Must be upto 20 characters")
.regex( /^[a-zA-Z0-9_-]{3,16}$/,"username must be valid")


export const signUpSchema= z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be atleast of length 6"}), 

})

