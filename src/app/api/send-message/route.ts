
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User'; // This still refers to the interface

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    console.log('this is the user at line 50 sendmessage api ', user)

    if (!user) {
      console.log(`fucked up here babes line 15`)
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessage) {
      console.log(`fucked up here ,,,,, line 24`)
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    // Create a new message object according to the MessageSchema
    const newMessage = {
     
      content,
      createdAt: new Date()
    };

    // Push the new message to the user's messages array
    user.messages.push( newMessage as Message); // This works because of the defined schema

    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
