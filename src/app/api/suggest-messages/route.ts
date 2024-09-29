import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const suggestedQuestions = completion.choices[0].message.content;

    return NextResponse.json({ suggestedQuestions }, { status: 200 });
  } catch (error) {
    console.error('Error in suggest-messages API:', error);
    return NextResponse.json({ error: 'Failed to generate suggested messages' }, { status: 500 });
  }
}