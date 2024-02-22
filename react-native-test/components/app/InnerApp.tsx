import { StyleSheet, Text, View } from 'react-native';

import { Step } from '../../constants/step';
import { useExamContext } from '../../contexts/exam';
import { getDict } from '../../dictation';
import STYLES from '../../styles';
import ResetButton from '../exam/ResetButton';
import QuestionCard from '../question/QuestionCard';
import Summarization from '../summarization/Summarization';

const InnerApp: React.FC = () => {
  const exam = useExamContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.appFirstName}>{getDict('app', 'firstName')}</Text>
        <Text style={styles.appLastName}>{getDict('app', 'lastName')}</Text>
      </Text>
      <View style={styles.body}>
        {exam.step === Step.Examination && <QuestionCard />}
        {exam.step === Step.Summarization && <Summarization />}
      </View>
      <View style={styles.footer}>
        <ResetButton />
      </View>
    </View>
  );
};

export default InnerApp;

const styles = StyleSheet.create({
  container: {
    fontFamily: STYLES.fontFamily.krub.regular,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
  },
  title: {
    width: '100%',
    fontFamily: STYLES.fontFamily.krub.semibold,
    textAlign: 'center',
    fontSize: 28,
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    flexShrink: 0,
  },
  appFirstName: {
    color: STYLES.color.primary,
  },
  appLastName: {
    color: STYLES.color.secondary,
  },
  body: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    maxWidth: 300,
    width: '100%',
    marginHorizontal: 'auto',
  },
});
