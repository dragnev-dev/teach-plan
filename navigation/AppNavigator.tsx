import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import DetailsScreen from '../screens/DetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AgendaScreen from '../screens/AgendaScreen';
import MonthlyScreen from '../screens/MonthlyScreen';
import WeeklyScreen from '../screens/WeeklyScreen';
import UploadDataScreen from '../screens/UploadDataScreen';

export const SCREENS = {
  AGENDA_SCREEN: 'AgendaScreen',
  DETAILS_SCREEN: 'DetailsScreen',
  WEEKLY_SCREEN: 'WeeklyScreen',
  MONTHLY_SCREEN: 'MonthlyScreen',
  APP_SETTINGS: 'AppSettings',
  UPLOAD_DATA: 'UploadData',
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AgendaStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREENS.AGENDA_SCREEN} component={AgendaScreen} />
      <Stack.Screen name={SCREENS.DETAILS_SCREEN} component={DetailsScreen} />
    </Stack.Navigator>
  );
};

const WeeklyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREENS.WEEKLY_SCREEN} component={WeeklyScreen} />
      <Stack.Screen name="WeeklyStackAgenda" component={AgendaStack} />
    </Stack.Navigator>
  );
};

const MonthlyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREENS.MONTHLY_SCREEN} component={MonthlyScreen} />
      <Stack.Screen name="MonthlyStackWeekly" component={WeeklyStack} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREENS.APP_SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={SCREENS.UPLOAD_DATA} component={UploadDataScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Agenda" component={AgendaStack} />
        <Tab.Screen name="Weekly" component={WeeklyStack} />
        <Tab.Screen name="Monthly" component={MonthlyStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
