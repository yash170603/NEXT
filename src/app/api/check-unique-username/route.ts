import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/validation/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
   const conn =await dbConnect();


  try {
    //extract params from url, // safe parse it with above scehma, . store result,
    // if doesnt gets success then return all eror regarding the usernam

    const { searchParams } = new URL(request.url);
     
    const validatingObject = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(validatingObject);

    console.log(`This is the safeparse in chek username ` ,result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log("there is error in parsing, this is line 29")
      console.log(`This is usernameErrors :-`,usernameErrors)
      console.log("this the returend response from line 32")
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    console.log(`THis is the safely parsed username`,username)
    const verifiedUserwithUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    console.log(`This is the verifiedUserwithUsername being logged at line 50 `,verifiedUserwithUsername);
    console.log(`Now few conditions are bieng cheked from line 53`)
    if (
      verifiedUserwithUsername && verifiedUserwithUsername.isVerified == true) {
      //  checks for an existing username same with thsi one and verified too
      console.log(`This is the response on line 56, when there is a user who already exists with verified username`)
      return Response.json(
        {
          success: false,
          message: "A user with this username already exists",
        },
        { status: 400 }
      );
    } else {
      console.log(`This is the response on line 66, when there maybe or not a user with this name, but not a verified username`)
      return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("There was in error in usernameSchema validation, line 71 ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking user name",
      },
      {
        status: 500,
      }
    );
  }
}
