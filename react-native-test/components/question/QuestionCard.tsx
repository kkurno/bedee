import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { useExamContext } from '../../contexts/exam';
import STYLES from '../../styles';

const QuestionCard: React.FC = () => {
  const exam = useExamContext();

  const currentQuestion = exam.questions[exam.currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionNumber}>{exam.currentQuestionIndex + 1}</Text>
      <View style={styles.questionContainer}>
        {currentQuestion.question.split('\n').map((text) => (
          <Text key={text} style={styles.questionText}>
            {text}
          </Text>
        ))}
      </View>
      <View style={styles.choicesContainer}>
        {currentQuestion.choices.map((choice) => (
          <TouchableHighlight
            key={`${choice.label}_${choice.value}`}
            underlayColor={STYLES.color.secondary}
            onPress={() => exam.answer(choice)}>
            <View style={styles.choiceContainer}>
              <Text style={styles.choiceText}>{choice.label}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
};

export default QuestionCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 768,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: STYLES.color.primary,
    display: 'flex',
    gap: 16,
    position: 'relative',
  },
  questionNumber: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: 9999,
    backgroundColor: STYLES.color.primary,
    paddingVertical: 4,
    paddingHorizontal: 20,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    fontFamily: STYLES.fontFamily.krub.medium,
  },
  questionContainer: {
    display: 'flex',
    gap: 4,
  },
  questionText: {
    fontFamily: STYLES.fontFamily.krub.semibold,
    fontSize: 20,
  },
  choicesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  choiceContainer: {
    shadowRadius: 6,
    shadowColor: STYLES.color.gray,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    padding: 8,
    borderRadius: 4,
  },
  choiceText: {
    fontFamily: STYLES.fontFamily.krub.regular,
    fontSize: 16,
  },
});
