import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import DetailScreen from '../screens/DetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AgendaScreen from '../screens/AgendaScreen';
import MonthlyScreen from '../screens/MonthlyScreen';
import WeeklyScreen from '../screens/WeeklyScreen';
import UploadDataScreen from '../screens/UploadDataScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AgendaStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AgendaStackAgenda" component={AgendaScreen} />
      <Stack.Screen name="AgendaStackDetail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

const WeeklyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WeeklyStackWeekly" component={WeeklyScreen} />
      <Stack.Screen name="WeeklyStackAgenda" component={AgendaStack} />
    </Stack.Navigator>
  );
};

const MonthlyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MonthlyStackMonthly" component={MonthlyScreen} />
      <Stack.Screen name="MonthlyStackWeekly" component={WeeklyStack} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="App Settings" component={SettingsScreen} />
      <Stack.Screen name="Upload Data" component={UploadDataScreen} />
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
