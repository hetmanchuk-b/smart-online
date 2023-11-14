import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {QuizzesAccordion} from "@/components/quiz/quizzes-accordion";
import {QuizWithCreatorAndQuestionsWithVariants} from "@/types/main";

const QuizzesPage = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/sign-in');
  }

  const quizzes = await db.quiz.findMany({
    where: {
      isPublished: true
    },
    include: {
      questions: {
        include: {
          variants: true
        }
      },
      creator: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return (
    <div className="h-full p-2 container">
      <div>
        <h1 className="text-2xl font-semibold tracking-wide text-stone-800 mb-4">
          Quizzes List ({quizzes?.length})
        </h1>

        <QuizzesAccordion
          userId={session.user.id}
          quizzes={quizzes as QuizWithCreatorAndQuestionsWithVariants[]}
        />
      </div>
    </div>
  )
}

export default QuizzesPage;
