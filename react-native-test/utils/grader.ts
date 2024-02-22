import { Grade } from '../constants/grader';
import { Choice } from '../constants/question';
import { getDict } from '../dictation';
import STYLES from '../styles';

export const summarize = (selectedChoices: Choice[]): { correct: number; total: number; percentage: number; grade: Grade } => {
  const correct = selectedChoices.filter((choice) => choice.isCorrect).length;
  const total = Math.max(selectedChoices.length, 1);
  const percentage = (correct / total) * 100;
  let grade: Grade = {
    text: 'F',
    descriptionText: getDict('gradeDescription', 'f')!,
    colorCode: STYLES.color.darkGray,
  };

  if (percentage >= 90) {
    grade = {
      text: 'A',
      descriptionText: getDict('gradeDescription', 'a')!,
      colorCode: STYLES.color.rose,
    };
  } else if (percentage >= 85 && percentage <= 89) {
    grade = {
      text: 'B+',
      descriptionText: getDict('gradeDescription', 'bPlus')!,
      colorCode: STYLES.color.amber,
    };
  } else if (percentage >= 80 && percentage <= 84) {
    grade = {
      text: 'B',
      descriptionText: getDict('gradeDescription', 'b')!,
      colorCode: STYLES.color.yellow,
    };
  } else if (percentage >= 75 && percentage <= 79) {
    grade = {
      text: 'C+',
      descriptionText: getDict('gradeDescription', 'cPlus')!,
      colorCode: STYLES.color.blue,
    };
  } else if (percentage >= 70 && percentage <= 74) {
    grade = {
      text: 'C+',
      descriptionText: getDict('gradeDescription', 'c')!,
      colorCode: STYLES.color.sky,
    };
  } else if (percentage >= 65 && percentage <= 69) {
    grade = {
      text: 'D+',
      descriptionText: getDict('gradeDescription', 'dPlus')!,
      colorCode: STYLES.color.violet,
    };
  } else if (percentage >= 60 && percentage <= 64) {
    grade = {
      text: 'D',
      descriptionText: getDict('gradeDescription', 'd')!,
      colorCode: STYLES.color.brown,
    };
  }

  return { correct, total, percentage, grade };
};
