import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const {title, topic} = await req.json();

    if (!title) {
      return new NextResponse('Quiz title missing', {status: 401});
    }

    const quiz = await db.quiz.create({
      data: {
        title,
        topic,
        creatorId: session.user.id
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ POST API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
