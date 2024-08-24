import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/validation/signUpSchema";
 

const usernameQuerySchema= z.object({
    username:usernameValidation
})

export async function GET(request:Request) {


      await dbConnect()

      try{

              //extract params from url, // safe parse it with above scehma, . store result,
              // if doesnt gets success then return all eror regarding the usernam

              const {searchParams}=  new URL(request.url)
              console.log(searchParams)
              const validatingObject= {
                username:searchParams.get('username')
              }

              const result = usernameQuerySchema.safeParse(validatingObject);

              console.log(result)
              if( ! result.success){
                const usernameErrors= result.error.format().username?._errors||[]
                 return Response.json({
                      success:false,
                      message:usernameErrors?.length>0?usernameErrors.join(','):'Invalid query parameters'
                 },{status:400})

              }

              const {username}=result.data
             const verifiedUserwithUsername =  await UserModel.findOne({username,isVerified:true})
             console.log(verifiedUserwithUsername)
             if(verifiedUserwithUsername && verifiedUserwithUsername.isVerified==true){ //  checks for an existing username same with thsi one and verified too
                return Response.json({
                    success:false,
                    message:"A user with this username already exists"
                },{status:400})
             }
             else{
                return Response.json({
                    success:true,
                    message:"Username is unique"
                },{status:200})
             }
             

      }
      catch(error){
        console.error("There was in error in usernameSchema validation " ,error);
        return Response.json({
            success:false,
            message:"Error checking user name"
        },{
            status:500
        })
      }
}