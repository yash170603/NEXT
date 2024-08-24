import z from "zod";

export const VerificationCodeScehma = z.object({
  code: z
    .string()
    .min(6, { message: "The verification code must of 6 digits" }),
});
