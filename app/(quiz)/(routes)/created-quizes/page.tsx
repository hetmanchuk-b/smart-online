import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {QuizesAccordion} from "@/components/quiz/quizes-accordion";

const CreatedQuizesPage = async () => {
  const session = await getAuthSession();
  if (!session?.user) return redirect('/sign-in');

  const quizes = await db.quiz.findMany({
    where: {
      creatorId: session.user.id
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
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-wide text-stone-800">
          Your Quizes ({quizes?.length})
        </h1>

        <QuizesAccordion quizes={quizes} />
      </div>
    </div>
  )
}

export default CreatedQuizesPage;
