import { createContext, useContext } from 'react';

import { Step } from '../constants/step';
import useExam from '../hooks/use-exam';

const ExamContext = createContext<ReturnType<typeof useExam>>({
  step: Step.Examination,
  questions: [],
  selectedChoices: [],
  currentQuestionIndex: 0,
  answer: () => {},
  reset: () => {},
});

export const ExamContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const exam = useExam();

  return <ExamContext.Provider value={exam}>{props.children}</ExamContext.Provider>;
};

export const useExamContext = () => useContext(ExamContext);
