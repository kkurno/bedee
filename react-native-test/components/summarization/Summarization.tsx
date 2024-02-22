import { StyleSheet, Text, View } from 'react-native';

import { Step } from '../../constants/step';
import { useExamContext } from '../../contexts/exam';
import { getDict } from '../../dictation';
import STYLES from '../../styles';
import { summarize } from '../../utils/grader';

const Summarization: React.FC = () => {
  const exam = useExamContext();

  if (exam.step !== Step.Summarization) {
    return null;
  }

  const summary = summarize(exam.selectedChoices);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{getDict('label', 'score')}</Text>
        <Text style={styles.scoreText}>:</Text>
        <Text style={{ ...styles.scoreText, color: STYLES.color.secondary }}>{summary.correct}</Text>
        <Text style={styles.scoreText}>/</Text>
        <Text style={{ ...styles.scoreText, color: STYLES.color.primary }}>{summary.total}</Text>
        <Text style={{ ...styles.scoreText, color: STYLES.color.secondary }}>({summary.percentage.toFixed(2)} %)</Text>
      </View>
      <Text style={{ ...styles.grade, color: summary.grade.colorCode }}>{summary.grade.text}</Text>
      <Text style={{ ...styles.gradeText, color: summary.grade.colorCode }}>[{summary.grade.descriptionText}]</Text>
    </View>
  );
};

export default Summarization;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: STYLES.fontFamily.krub.medium,
  },
  grade: {
    fontSize: 48,
    fontFamily: STYLES.fontFamily.krub.semibold,
  },
  gradeText: {
    fontSize: 24,
    fontFamily: STYLES.fontFamily.krub.medium,
  },
});
