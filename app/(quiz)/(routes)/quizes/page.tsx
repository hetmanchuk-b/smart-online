import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import Link from 'next/link';

const QuizesPage = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/sign-in');
  }

  const quizes = await db.quiz.findMany({
    where: {
      isPublished: true
    }
  });

  return (
    <div className="h-full p-2 container">
      <div>
        <h1 className="text-2xl font-semibold tracking-wide text-stone-800 mb-4">
          Quizes List ({quizes?.length})
        </h1>

        {quizes?.length === 0 ? (
          <div className="text-lg font-semibold tracking-wide text-stone-400">
            There is no quizes yet.
            <Link
              href={'/new-quiz'}
              className={cn(buttonVariants({variant: 'link'}))}
            >
              <span className="text-lg">Create</span>
              <Icons.add className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : quizes.map((quiz) => (
          <div key={quiz.id}>
            {quiz?.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizesPage;
