import { useReducer, Reducer } from 'react';

import CONFIG from '../config';
import { Choice, Question } from '../constants/question';
import { Step } from '../constants/step';
import { generateQuestions } from '../utils/question';

export type ExamState = {
  step: Step;
  questions: Question[];
  selectedChoices: Choice[];
};

type ExamAction =
  | {
      type: 'reset';
      newGeneratedQuestions: Question[];
    }
  | {
      type: 'answer';
      selectedChoice: Choice;
    };

const examReducer: Reducer<ExamState, ExamAction> = (state, action) => {
  const currentQuestionIndex = state.selectedChoices.length;
  switch (action.type) {
    case 'reset': {
      return {
        step: Step.Examination,
        questions: action.newGeneratedQuestions,
        selectedChoices: [],
      };
    }
    case 'answer': {
      const isAnswerForTheLastQuestion = currentQuestionIndex === state.questions.length - 1;
      return {
        step: isAnswerForTheLastQuestion ? Step.Summarization : state.step,
        questions: state.questions,
        selectedChoices: [...state.selectedChoices, action.selectedChoice],
      };
    }
  }
};

const useExam = (options?: { total?: number; totalChoicesPerQuestion: number }) => {
  const {
    total = CONFIG.defaultTotalQuestions,
    totalChoicesPerQuestion = CONFIG.defaultTotalChoicesPerQuestion,
  } = options ?? {};

  const _getQuestions = () => generateQuestions({ total, totalChoicesPerQuestion });

  const [examState, dispatch] = useReducer(examReducer, {
    step: Step.Examination,
    questions: _getQuestions(),
    selectedChoices: [],
  });

  const currentQuestionIndex = examState.selectedChoices.length;

  const reset = () => {
    dispatch({ type: 'reset', newGeneratedQuestions: _getQuestions() });
  };

  const answer = (choice: Choice) => {
    dispatch({ type: 'answer', selectedChoice: choice });
  };

  return {
    step: examState.step,
    questions: examState.questions,
    selectedChoices: examState.selectedChoices,
    currentQuestionIndex,
    answer,
    reset,
  };
};

export default useExam;
