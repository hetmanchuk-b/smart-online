import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {QuizesAccordion} from "@/components/quiz/quizes-accordion";

const QuizesPage = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/sign-in');
  }

  const quizes = await db.quiz.findMany({
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
          Quizes List ({quizes?.length})
        </h1>

        <QuizesAccordion
          quizes={quizes}
        />
      </div>
    </div>
  )
}

export default QuizesPage;
