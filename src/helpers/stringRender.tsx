
const VerificationEmailServer = ({ username, otp }: { username: string; otp: string; }): string => {
  return `
    <html>
      <head></head>
      <body style="background-color: #f6f6f6; font-family: Arial, sans-serif;">
        <div style="padding: 20px; background-color: #ffffff; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333333; text-align: center;">OTP Verification</h1>
          <p>Hi ${username},</p>
          <p>Please use the following One-Time Password (OTP) to verify your email address:</p>
          <p style="font-size: 24px; font-weight: bold; background-color: #f1f1f1; padding: 10px; text-align: center; letter-spacing: 4px;">
            ${otp}
          </p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br />Mystery-Message</p>
        </div>
      </body>
    </html>
  `;
};

export default VerificationEmailServer;
