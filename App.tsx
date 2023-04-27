import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import {persistor, store} from './store/store';
import {PersistGate} from 'redux-persist/integration/react';
import AppLoadingScreen from './screens/AppLoadingScreen';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<AppLoadingScreen />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

export default App;
