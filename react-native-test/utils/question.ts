import CONFIG from '../config';
import { Choice, Question } from '../constants/question';

type RandomChoice = {
  parameter: { a: number; b: number; operator: Operator; value: number };
  choice: Omit<Choice, 'questionId'>;
};

enum Operator {
  Plus = '+',
  Minus = '-',
  Multiply = '*',
}

const calculate = (a: number, b: number, operator: Operator) => {
  switch (operator) {
    case Operator.Plus:
      return a + b;
    case Operator.Minus:
      return a - b;
    case Operator.Multiply:
      return a * b;
  }
};

const generateNumber = (min: number, max: number) => {
  const celledMin = Math.ceil(min);
  const flooredMax = Math.floor(max);
  return Math.round(Math.random() * (flooredMax - celledMin) + celledMin);
};

const generateOperator = () => {
  return [Operator.Plus, Operator.Minus, Operator.Multiply][
    generateNumber(0, Object.values(Operator).length - 1)
  ];
};

const generateChoice = (
  options: {
    existingChoices?: RandomChoice[];
    isCorrect: boolean;
  },
  retryTimes = 0,
): RandomChoice => {
  const a = generateNumber(CONFIG.randomNumber.minValue, CONFIG.randomNumber.maxValue);
  const b = generateNumber(CONFIG.randomNumber.minValue, CONFIG.randomNumber.maxValue);
  const operator = generateOperator();
  const value = calculate(a, b, operator);
  const valueString = value.toString();

  const isDuplicated = options?.existingChoices?.some(
    (choice) => choice.choice.value === valueString,
  );
  const isExhausted = retryTimes > CONFIG.maximumChoiceGeneratingRetryTimes;

  if (!isExhausted && isDuplicated) {
    return generateChoice(
      {
        existingChoices: options.existingChoices,
        isCorrect: options.isCorrect,
      },
      retryTimes + 1,
    );
  }

  return {
    parameter: { a, b, operator, value },
    choice: {
      label: valueString,
      value: valueString,
      isCorrect: Boolean(options?.isCorrect ?? isDuplicated),
    },
  };
};

const generateChoices = (options: {
  total: number;
}): { correctChoice: RandomChoice; allChoices: RandomChoice[] } => {
  if (options.total < 1) {
    throw new Error('total choices must be greater than 0');
  }
  const correctChoice: RandomChoice = generateChoice({ isCorrect: true });
  const correctChoiceIndex = generateNumber(0, options.total - 1);
  const allChoices = [...new Array(options.total)].reduce<RandomChoice[]>((acc, _, idx) => {
    const isCorrectChoiceIndex = idx === correctChoiceIndex;
    return [
      ...acc,
      ...(isCorrectChoiceIndex
        ? // generated correct choice
          [correctChoice]
        : // generated incorrect choice
          [
            generateChoice({
              existingChoices: [...acc, correctChoice],
              isCorrect: false,
            }),
          ]),
    ];
  }, []);
  return { correctChoice, allChoices };
};

export const generateQuestions = (options: { total: number; totalChoicesPerQuestion: number }) => {
  return [...new Array(options.total)].map<Question>((_, idx) => {
    const questionId = idx.toString();
    const generatedChoice = generateChoices({
      total: options.totalChoicesPerQuestion,
    });
    return {
      id: questionId,
      question: `Which one is the answer of:\n${generatedChoice.correctChoice.parameter.a} ${generatedChoice.correctChoice.parameter.operator} ${generatedChoice.correctChoice.parameter.b} = ?`,
      choices: generatedChoice.allChoices.map((choice) => ({
        ...choice.choice,
        questionId,
      })),
    };
  });
};
