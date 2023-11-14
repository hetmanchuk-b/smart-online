import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {Separator} from "@/components/ui/separator";
import {QuizQuestionsForm} from "@/components/forms/quiz-questions-form";
import {QuestionsAccordion} from "@/components/quiz/questions-accordion";
import {QuizMenu} from "@/components/quiz/quiz-menu";

interface QuizIdPageProps {
  params: {
    quizId: string;
  }
}

const QuizIdPage = async ({params}: QuizIdPageProps) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/sign-in');
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: params.quizId,
      creatorId: session?.user?.id,
    },
    include: {
      questions: {
        include: {
          variants: true
        },
        orderBy: {
          order: 'asc'
        }
      },
    }
  });

  if (!quiz) {
    return redirect('/new-quiz');
  }

  return (
    <div className="h-full p-3 container">
      <div className="flex flex-col p-2">
        <div className="flex items-start justify-between gap-x-2">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold leading-2">
              Compete
              <span className="font-bold ml-2">{quiz?.title}</span>
            </h1>
            {quiz?.topic && (
              <p className="text-slate-800 font-semibold text-md">
                Quiz topic:
                <span className="font-bold ml-2">{quiz.topic}</span>
              </p>
            )}
          </div>
          <div className="flex justify-end p-1 bg-slate-100 rounded-md">
            <QuizMenu
              quiz={quiz}
            />
          </div>
        </div>

        <p className="text-slate-500 font-medium leading-none mt-2">
          Create questions one by one. Add the correct answer to them, which will be visible to the game moderator. <br/>
          By adding multiple answers, you create a question with options for players.
        </p>
        <p className="text-sm text-slate-500 font-medium leading-2">
          You can change the reward for difficult questions. By default its 1. <br/>
          Quiz must have more than 5 questions and less than 26.
        </p>
        <Separator className="w-full h-[2px] bg-slate-200 my-2" />
        {quiz?.questions?.length > 0 && (
          <>
            <p className="text-slate-700 font-bold leading-none mt-2">
              This quiz already includes questions:
            </p>
            <Separator className="w-2/3 bg-slate-200 my-2" />
            <QuestionsAccordion
              isAuthor={true}
              questions={quiz?.questions}
              quizId={quiz?.id}
            />
          </>
        )}
      </div>
      <QuizQuestionsForm quiz={quiz} />
    </div>
  )
}

export default QuizIdPage;
