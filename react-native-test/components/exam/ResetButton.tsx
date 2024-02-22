import { Button } from 'react-native';

import { useExamContext } from '../../contexts/exam';
import { getDict } from '../../dictation';
import STYLES from '../../styles';

const ResetButton = () => {
  const exam = useExamContext();

  return <Button color={STYLES.color.primary} title={getDict('button', 'reset')!} onPress={exam.reset} />;
};

export default ResetButton;
