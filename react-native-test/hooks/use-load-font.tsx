import { useFonts } from 'expo-font';
import { useCallback } from 'react';

const useLoadFont = (params?: { onFontLoaded?: () => any | void | Promise<any | void> }) => {
  const [isFontLoaded, fontError] = useFonts({
    'Krub-Regular': require('../assets/fonts/Krub/Krub-Regular.ttf'),
    'Krub-Medium': require('../assets/fonts/Krub/Krub-Medium.ttf'),
    'Krub-SemiBold': require('../assets/fonts/Krub/Krub-SemiBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (isFontLoaded || fontError) {
      await params?.onFontLoaded?.();
    }
  }, [isFontLoaded, fontError]);

  return {
    onLayoutRootView,
    isFontLoaded,
    fontError,
  };
};

export default useLoadFont;
