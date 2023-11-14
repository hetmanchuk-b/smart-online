"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {ActionTooltip} from "@/components/action-tooltip";
import {QuestionsAccordion} from "@/components/quiz/questions-accordion";
import {QuizMenu} from "@/components/quiz/quiz-menu";
import Link from "next/link";
import {QuizWithCreatorAndQuestionsWithVariants} from "@/types/main";

interface QuizzesAccordionProps {
  quizzes?: QuizWithCreatorAndQuestionsWithVariants[];
  userId: string;
}

export const QuizzesAccordion = (
  {
    quizzes,
    userId,
  }: QuizzesAccordionProps
) => {
  return (
    <Accordion
      type={'multiple'}
      className="w-full"
    >
      {quizzes?.length === 0 ? (
        <div className="text-lg font-semibold tracking-wide text-stone-400">
          There is no quizzes yet.
          <Link
            href={'/new-quiz'}
            className={cn(buttonVariants({variant: 'link'}))}
          >
            <span className="text-lg">Create</span>
            <Icons.add className="w-5 h-5 ml-2" />
          </Link>
        </div>
      ) : quizzes?.map((quiz) => {
        const isAuthor = userId === quiz.creator.id;
        return (
          <AccordionItem
            value={quiz.id}
            key={quiz.id}
          >
            <AccordionTrigger className="p-2 hover:bg-slate-100">
              <div className="flex items-center gap-x-4">
                {quiz?.title}
                {quiz?.topic && (
                  <ActionTooltip
                    label={'Topic'}
                    side={'bottom'}
                    align={'start'}
                  >
                    <span className="text-sm text-slate-500 font-semibold">({quiz.topic})</span>
                  </ActionTooltip>
                )}
                <div className="text-sm font-semibold">
                  Author: {quiz?.creator?.username}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {quiz?.questions?.length === 0 ? (
                <p className='text-lg font-semibold tracking-wide text-stone-400'>
                  There is no questions yet.
                </p>
              ) : (
                <QuestionsAccordion
                  isAuthor={isAuthor}
                  questions={quiz.questions}
                  quizId={quiz?.id}
                />
              )}
              {isAuthor && (
                <div className="flex justify-end bg-stone-100">
                  <QuizMenu
                    quiz={quiz}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
