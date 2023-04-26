import {useEffect, useState} from 'react';
import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import {store} from './store/store';
import AppLoadingScreen from './screens/AppLoadingScreen';
import {initialize} from './initialization';

function App(): JSX.Element {
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    initialize()
      .then(() => {
        setAppInitialized(true);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  if (!appInitialized) {
    return <AppLoadingScreen />;
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;
