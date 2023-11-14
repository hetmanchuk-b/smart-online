import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";

export async function PATCH(
  req: Request,
  {params}: {params: {quizId: string}}
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    const {searchParams} = new URL(req.url);
    const questionId = searchParams.get('questionId');
    if (!params.quizId) {
      return new NextResponse('Quiz ID is Missing', {status: 400});
    }

    if (!questionId) {
      return new NextResponse('Question ID is Missing', {status: 400});
    }

    const usersQuiz = await db.quiz.findFirst({
      where: {
        id: params.quizId,
        creatorId: session.user.id,
      }
    });

    if (!usersQuiz) {
      return new NextResponse('This quiz belongs to someone else', {status: 400});
    }

    const quiz = await db.quiz.update({
      where: {
        id: params.quizId,
        creatorId: session.user.id,
      },
      data: {
        questions: {
          delete: {
            id: questionId
          }
        }
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[DELETE QUESTION API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
