import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Storee } from './Store';
import { Provider } from 'react-redux';

// Ignore logs containing specific warnings or errors
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
  'h1',
  'ViewPropTypes will be removed from React Native',
  "Bottom Tab Navigator: 'tabBarOptions' is deprecated",
  'hello'
]);


const AppWithProvider = () => (
  <Provider store={Storee}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppWithProvider);
