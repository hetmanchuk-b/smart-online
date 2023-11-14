"use client"

import {AnswerType, Question, Answer} from '@prisma/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {QuizAccordionMenu} from "@/components/quiz/quiz-accordion-menu";
import {cn} from "@/lib/utils";
import {ActionTooltip} from "@/components/action-tooltip";
import Image from "next/image";


interface QuestionsAccordionProps {
  questions: (Question & {
    variants: Answer[];
  })[];
  quizId: string;
  isAuthor: boolean;
}

export const QuestionsAccordion = (
  {
    questions,
    quizId,
    isAuthor,
  }: QuestionsAccordionProps
) => {
  return (
    <Accordion type={'multiple'} className="w-full">
      {questions?.map((question) => (
        <AccordionItem
          value={question.id}
          key={question.id}
        >
          <AccordionTrigger className="p-2 hover:bg-slate-100">
            <div className="flex items-center gap-x-2">
              <span className="font-bold">{question.text}</span>
              <ActionTooltip
                label={'Question score'}
                side={'bottom'}
                align={'center'}
              >
                <span className="text-sm">({question?.reward})</span>
              </ActionTooltip>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-y-1">
              {question?.imageUrl && question?.imageUrl?.length > 0 && (
                <Image
                  src={question.imageUrl}
                  width={300}
                  height={300}
                  alt={question.text}
                  className="mx-auto my-2"
                />
              )}
              {question?.variants?.map((variant) => (
                <div
                  key={variant.id}
                  className={cn(
                    'bg-rose-100 px-4 py-0.5 rounded-md',
                    variant?.type === AnswerType.RIGHT && 'bg-green-100'
                  )}
                >
                  {variant?.type === AnswerType.RIGHT ? (
                    <ActionTooltip label={'Correct answer'} side={'bottom'} align={'start'}>
                      <p className="font-semibold">{variant.text}</p>
                    </ActionTooltip>
                  ) : (
                    <p className="font-semibold">{variant.text}</p>
                  )}
                </div>
              ))}
            </div>
            {isAuthor && (
              <div className="flex justify-end">
                <QuizAccordionMenu
                  quizId={quizId}
                  questionId={question.id}
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}

    </Accordion>
  )
}
