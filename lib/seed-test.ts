type quizType = {
  id: string;
  title: string;
  topic: string;
  questions: QuestionT[]
}

type QuestionT = {
  id: string;
  text: string;
  type: 'FAST' | 'NORMAL';
  variants: AnswerT[]
}

type AnswerT = {
  id: string;
  text: string;
  type: 'RIGHT' | 'WRONG';
}

export const quiz: quizType = {
  id: '',
  title: 'Первый',
  topic: 'История, география',
  questions: [
    { // Question model
      id: '',
      text: 'В каком году началась первая мировая война?',
      type: 'NORMAL',
      variants: [
        { // Answer model
          id: '',
          text: '1914',
          type: 'RIGHT'
        }
      ],
    },
    { // Question model
      id: '',
      text: 'В какой стране находится город Лондон?',
      type: 'FAST',
      variants: [
        { // Answer model
          id: '',
          text: 'Великобритания',
          type: 'RIGHT'
        },
        { // Answer model
          id: '',
          text: 'Франция',
          type: 'WRONG'
        },
      ],
    },
  ],
}
