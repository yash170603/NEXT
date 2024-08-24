import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
 
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
):Promise<ApiResponse> {
     
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: '  Verification mail for Suggestion App',
            react: VerificationEmail ({name:username,otp:verifyCode})
          });
          
        return {success:true, message:"  Verification email send successfully"}
    }
    catch(error){
        console.log(`There was an error at sending email`,error)
        //throw new Error(`There was an error at sending email ${error}`)
        return {
            success:false,
            message:"Failed to send email"
        }
    }
}
