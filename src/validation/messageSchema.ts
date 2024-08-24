import { Content } from "next/font/google"
import z from "zod"

export const messageValidationSchema=z.object({
    content:z.string().min(10,{message:"The content must be atleast of length 10 characters"}).max(300,{message:"Contents lengths must be less than 300 characters"}),
})