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
    const {searchParams} = new URL(req.url);
    const isPublished = searchParams.get('publish');

    if (isPublished === null) {
      return new NextResponse('Publish value is Missing', {status: 400});
    }
    if (!params.quizId) {
      return new NextResponse('Quiz ID is Missing', {status: 400});
    }

    let value = false;
    if (isPublished.toLowerCase() === 'true') {
      value = true;
    } else if (isPublished.toLowerCase() === 'false') {
      value = false;
    }

    if (value) {
      const foundQuiz = await db.quiz.findUnique({
        where: {
          id: params.quizId,
          creatorId: session.user.id,
        },
        include: {
          questions: true
        }
      });

      if (foundQuiz && foundQuiz?.questions?.length <= 4) {
        return new NextResponse(
          'Quiz must include at least 5 questions to be published.',
          {status: 400}
        );
      }
    }

    const quiz = await db.quiz.update({
      where: {
        id: params.quizId,
        creatorId: session.user.id,
      },
      data: {
        isPublished: value
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[PUBLISH QUIZ API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
