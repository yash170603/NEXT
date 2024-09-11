import { createErrorResponse, createSuccessResponse } from './../types/responseUtils';
// src/helpers/emailService.ts
import nodemailer from 'nodemailer';
 
import VerificationEmailServer from './stringRender';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your Gmail email address
    pass: process.env.EMAIL_APP_KEY, // Your Gmail password or App password
  },
});

export const sendVerificationEmail = async (to: string, username: string, otp: string) => {
  const htmlContent = VerificationEmailServer({username, otp});

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: 'Verify Your Email',
    html: htmlContent,
  };

  try {
   const res =  await transporter.sendMail(mailOptions);
   if( res.accepted.length===0){
    return Response.json({message:"There was an error in sending email",success:false},{status:500})
   }
    console.log(res)
    console.log('Email sent successfully');
    return createSuccessResponse('Email was sent succcessfully',200)
  } catch (error) {
    console.error('Error sending email:', error);
    return createErrorResponse("There was in internal server error in sending verification mail",500)
  }
};
