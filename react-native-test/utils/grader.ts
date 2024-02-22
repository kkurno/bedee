import { Grade } from '../constants/grader';
import { Choice } from '../constants/question';
import { getDict } from '../dictation';
import STYLES from '../styles';

export const getGrade = (selectedChoices: Choice[]): Grade => {
  const correct = selectedChoices.filter((choice) => choice.isCorrect).length;
  const total = Math.max(selectedChoices.length, 1);

  const percentage = (correct / total) * 100;

  if (percentage >= 90) {
    return { text: 'A', descriptionText: getDict('grade', 'a')!, colorCode: STYLES.color.rose };
  }
  // TODO: add more grades
  return { text: 'F', descriptionText: getDict('grade', 'f')!, colorCode: STYLES.color.gray };
};
