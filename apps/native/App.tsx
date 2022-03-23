import { NativeBaseProvider, extendTheme, Center } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home } from './components/Home';
import useCachedResources from './hooks/useCachedResources';

const App = () => {

  const config = {
    // useSystemColorMode: true,
    // initialColorMode: "dark",
  };

  const customTheme = extendTheme({ config });
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <NativeBaseProvider theme={customTheme}>
      <SafeAreaProvider>
        <Center flex={1}>
          <Home />
        </Center>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}

export default App;