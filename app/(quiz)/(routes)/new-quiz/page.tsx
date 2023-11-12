import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {QuizForm} from "@/components/forms/quiz-form";

const NewQuizPage = async () => {
  const session = await getAuthSession();
  if (!session?.user) return redirect('/');

  return (
    <div className="h-full p-3 container">
      <div className="flex flex-col p-2">
        <h1 className="text-2xl font-semibold leading-2 text-center">Create quiz</h1>
        <p className="text-md text-stone-500 font-medium leading-2 text-center">
          On this page you can create a set of questions.
          At first you can give the set a title and determine the topics.
        </p>
        <QuizForm initialData={null} />
      </div>
    </div>
  )
}

export default NewQuizPage;
