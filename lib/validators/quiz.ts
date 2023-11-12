import {z} from "zod";

export const QuizValidator = z.object({
  title: z.string()
    .min(2, {
      message: 'Title is required.'
    })
    .max(60, {
      message: 'Quiz title must not exceed 60 characters.'
    }),
  topic: z.string().optional(),
});

export const QuestionValidator = z.object({
  text: z.string()
    .min(2, {
      message: "Question is required."
    })
    .max(255, {
      message: "Question must not exceed 255 characters."
    }),
  type: z.enum(['FAST', 'NORMAL']),
  reward: z.number().int().positive().finite(),
  order: z.number().int().optional(),
  imageUrl: z.string().nullable(),
  variants: z.array(z.object({
    text: z.string()
      .min(1, {message: 'Variant text is required.'})
      .max(80, {message: 'Variant text must not exceed 80 characters.'}),
    type: z.enum(['RIGHT', 'WRONG'])
  }))
});

export const AnswerValidator = z.object({
  text: z.string()
    .min(1, {message: 'Variant text is required.'})
    .max(80, {message: 'Variant text must not exceed 80 characters.'}),
  type: z.enum(['RIGHT', 'WRONG'])
})
