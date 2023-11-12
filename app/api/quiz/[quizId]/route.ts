import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";

export async function PATCH(
  req: Request,
  {params}: {params: {quizId: string}}
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    if (!params.quizId) {
      return new NextResponse('Quiz ID is Missing', {status: 400});
    }

    const {title, topic} = await req.json();

    if (!title) {
      return new NextResponse('Quiz title is Missing', {status: 400});
    }

    const quizCheck = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        creatorId: session.user.id
      }
    });

    if (!quizCheck) {
      return new NextResponse('Only creator can edit a quiz.', {status: 400});
    }

    const quiz = await db.quiz.update({
      where: {
        id: params.quizId,
        creatorId: session.user.id,
      },
      data: {
        title,
        topic,
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ ID PATCH API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}

export async function DELETE(
  req: Request,
  {params}: {params: {quizId: string}}
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    if (!params.quizId) {
      return new NextResponse('Quiz ID is Missing', {status: 400});
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        creatorId: session.user.id
      }
    });

    if (!quiz) {
      return new NextResponse('Only creator can delete a quiz.', {status: 400});
    }

    await db.quiz.delete({
      where: {
        id: params.quizId,
        creatorId: session.user.id
      }
    });

    return new NextResponse('OK');
  } catch (error) {
    console.log("[QUIZ DELETE API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
