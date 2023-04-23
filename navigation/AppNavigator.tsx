import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import DetailScreen from '../screens/DetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AgendaScreen from '../screens/AgendaScreen';
import MonthlyScreen from '../screens/MonthlyScreen';
import WeeklyScreen from '../screens/WeeklyScreen';

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
      <Stack.Screen name="WeklyStackWeekly" component={WeeklyScreen} />
      <Stack.Screen name="WeklyStackAgenda" component={AgendaScreen} />
      <Stack.Screen name="WeklyStackDetail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

const MonthlyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MonthlyStackMonthly" component={MonthlyScreen} />
      <Stack.Screen name="MonthlyStackWeekly" component={WeeklyScreen} />
      <Stack.Screen name="MonthlyStackAgenda" component={AgendaScreen} />
      <Stack.Screen name="MonthlyStackDetail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="AgendaStack" component={AgendaStack} />
        <Tab.Screen name="WeeklyStack" component={WeeklyStack} />
        <Tab.Screen name="MontlyStack" component={MonthlyStack} />
        <Tab.Screen name="SettingsStack" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
