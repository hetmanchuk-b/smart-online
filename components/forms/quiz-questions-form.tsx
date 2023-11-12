"use client"

import {useState} from "react";
import {QuestionType, AnswerType} from "@prisma/client";
import {QuizWithQuestionsWithAnswers} from "@/types/main";
import {Button} from "@/components/ui/button";
import {Icons} from '@/components/icons';
import {QuestionForm} from "@/components/forms/question-form";
import {QUIZ_MAX_QUESTIONS_IN_QUIZ} from "@/lib/const";

interface QuizQuestionsFormProps {
  quiz: QuizWithQuestionsWithAnswers
}

export const QuizQuestionsForm = ({quiz}: QuizQuestionsFormProps) => {
  const [questionsNumber, setQuestionsNumber] = useState<number>(1);

  const onAddQuestion = () => {
    if (questionsNumber >= QUIZ_MAX_QUESTIONS_IN_QUIZ) {
      return;
    }
    setQuestionsNumber((prev) => prev + 1);
  }

  return (
    <div
      className="border border-stone-200 shadow p-2 rounded-md space-y-4"
    >
      {questionsNumber < QUIZ_MAX_QUESTIONS_IN_QUIZ && (
        <Button
          onClick={onAddQuestion}
          className="w-full"
          size={'sm'}
        >
          Add question
          <Icons.addCircle className="w-5 h-5 ml-2" />
        </Button>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({length: questionsNumber}).map((_, i) => (
          <QuestionForm
            quizId={quiz?.id}
            key={i}
            questionNumber={i + 1}
          />
        ))}
      </div>
    </div>
  )
}
