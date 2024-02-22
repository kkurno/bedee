import { StyleSheet, Text, View } from 'react-native';

import { Step } from '../../constants/step';
import { useExamContext } from '../../contexts/exam';

const Summarization: React.FC = () => {
  const exam = useExamContext();

  if (exam.step !== Step.Summarization) {
    return null;
  }

  return (
    <View>
      <Text>Summarization</Text>
    </View>
  );
};

export default Summarization;

const styles = StyleSheet.create({});
