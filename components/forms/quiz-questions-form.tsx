"use client"

import {useState, useEffect} from "react";
import {QuizWithQuestionsWithAnswers} from "@/types/main";
import {Icons} from '@/components/icons';
import {QuestionForm} from "@/components/forms/question-form";
import {QUIZ_MAX_QUESTIONS_IN_QUIZ} from "@/lib/const";

interface QuizQuestionsFormProps {
  quiz: QuizWithQuestionsWithAnswers
}

export const QuizQuestionsForm = ({quiz}: QuizQuestionsFormProps) => {
  const [questionsNumber, setQuestionsNumber] = useState<number>(1);
  const [allQuestionsNumber, setAllQuestionsNumber] = useState<number>(quiz.questions.length);
  const [savedQuestions, setSavedQuestions] = useState<number>(0);

  const onAddQuestion = () => {
    if (allQuestionsNumber >= QUIZ_MAX_QUESTIONS_IN_QUIZ) {
      return;
    }
    setQuestionsNumber((prev) => prev + 1);
  }

  useEffect(() => {
    if (quiz.questions.length >= 0) {
      setAllQuestionsNumber(quiz.questions.length + questionsNumber - savedQuestions)
    }
  }, [quiz, questionsNumber, savedQuestions]);


  return (
    <div
      className="space-y-4"
    >
      {allQuestionsNumber <= QUIZ_MAX_QUESTIONS_IN_QUIZ && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border border-stone-200 shadow p-2 rounded-md">
          {Array.from({length: questionsNumber}).map((_, i) => (
            <QuestionForm
              quizId={quiz?.id}
              key={i}
              questionNumber={i + 1}
              setSavedQuestions={setSavedQuestions}
            />
          ))}
          {allQuestionsNumber < QUIZ_MAX_QUESTIONS_IN_QUIZ && (
            <button
              onClick={onAddQuestion}
              className="w-full bg-stone-200/70 hover:bg-stone-200 text-stone-700 transition rounded-md h-full flex items-center justify-center flex-col p-4 min-h-[237px] gap-y-4"
            >
              <div className="flex items-center gap-x-2 text-lg font-semibold">
                Add question
                <Icons.addCircle className="w-6 h-6 ml-2" />
              </div>
              <div className="text-sm text-stone-500">
                {QUIZ_MAX_QUESTIONS_IN_QUIZ - allQuestionsNumber}
                {QUIZ_MAX_QUESTIONS_IN_QUIZ - allQuestionsNumber > 1 ? ' questions ' : ' question '}
                left
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
