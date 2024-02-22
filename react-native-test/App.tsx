import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import InnerApp from './components/app/InnerApp';
import { ExamContextProvider } from './contexts/exam';
import { getDict } from './dictation';
import useLoadFont from './hooks/use-load-font';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { isFontLoaded, fontError } = useLoadFont({ onFontLoaded: () => SplashScreen.hideAsync() });

  if (!isFontLoaded) {
    // TODO: proper loading UI
    return <Text>{getDict('label', 'loading')}</Text>;
  }
  if (fontError) {
    // TODO: proper error UI
    return <Text>{getDict('error', 'unknown')}</Text>;
  }

  return (
    <ExamContextProvider>
      <SafeAreaView style={styles.container}>
        <InnerApp />
      </SafeAreaView>
    </ExamContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
