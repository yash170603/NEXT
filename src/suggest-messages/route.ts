import { NextResponse } from "next/server";
import OpenAI from "openai";
//import {openai} from '@ai-sdk/openai'
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const openai= new OpenAI();

export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      stream: true, // Enable streaming 
      max_tokens: 400,
    });

    // Handle the stream
    let result = "";

    for await (const chunk of response) {
      // Each chunk contains part of the response
      const content = chunk.choices[0]?.delta?.content || "";
      result += content;
    }

    return NextResponse.json({ result }); // Return the final result after streaming
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          name: error.name,
          message: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("An unexpected error occurred", error);
      throw error;
    }
  }
}
