import {getAuthSession} from "@/lib/auth";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {QUIZ_MAX_QUESTION_VARIANTS, QUIZ_MAX_QUESTIONS_IN_QUIZ} from "@/lib/const";

export async function DELETE(
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
    const questionNumber = searchParams.get('qn');
    if (!questionNumber) {
      return new NextResponse('Question Number is Missing', {status: 400});
    }

    if (!params.quizId) {
      return new NextResponse('Quiz ID is Missing', {status: 400});
    }

    const {
      text,
      type,
      reward,
      order,
      imageUrl,
      variants
    } = await req.json();

    if (variants?.length > QUIZ_MAX_QUESTION_VARIANTS || !text || !type || !reward) {
      return new NextResponse('Wrong data has been passed.', {status: 400});
    }

    const quizCheck = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        creatorId: session.user.id,
      },
      include: {
        questions: true
      }
    });

    if (quizCheck?.questions?.length > QUIZ_MAX_QUESTIONS_IN_QUIZ) {
      return new NextResponse(
        `Quiz cannot contain more than ${QUIZ_MAX_QUESTIONS_IN_QUIZ} questions`,
        {status: 400}
      );
    }

    const quiz = await db.quiz.update({
      where: {
        id: params.quizId,
        creatorId: session.user.id,
      },
      data: {
        questions: {
          create: [
            {
              text,
              type,
              reward,
              order,
              imageUrl,
              variants: {
                create: [
                  ...variants
                ]
              }
            }
          ]
        }
      }
    });

    return NextResponse.json(quiz);

  } catch (error) {
    console.log("[QUESTION POST API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
