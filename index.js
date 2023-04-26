/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'reflect-metadata';
import './initialization';

AppRegistry.registerComponent(appName, () => App);
