export type Choice = {
  questionId: string;
  label: string;
  value: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  question: string;
  choices: Choice[];
};
