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
import Ionicons from 'react-native-vector-icons/Ionicons';

export const SCREENS = {
  AGENDA_SCREEN: 'AgendaScreen',
  DETAILS_SCREEN: 'DetailsScreen',
  WEEKLY_SCREEN: 'WeeklyScreen',
  WEEKLY_AGENDA_SCREEN: 'WeeklyAgendaScreen',
  WEEKLY_DETAILS_SCREEN: 'WeeklyDetailsScreen',
  MONTHLY_SCREEN: 'MonthlyScreen',
  MONTHLY_AGENDA_SCREEN: 'MonthlyAgendaScreen',
  MONTHLY_DETAILS_SCREEN: 'MonthlyDetailsScreen',
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
      <Stack.Screen name={SCREENS.WEEKLY_AGENDA_SCREEN} component={AgendaScreen} />
      <Stack.Screen name={SCREENS.WEEKLY_DETAILS_SCREEN} component={DetailsScreen} />
    </Stack.Navigator>
  );
};

const MonthlyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREENS.MONTHLY_SCREEN} component={MonthlyScreen} />
      <Stack.Screen name={SCREENS.MONTHLY_AGENDA_SCREEN} component={AgendaScreen} />
      <Stack.Screen name={SCREENS.MONTHLY_DETAILS_SCREEN} component={DetailsScreen} />
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
  const getTabBarIcon = (route: any) => ({
    tabBarIcon: ({
      focused,
      color,
      size,
    }: {
      focused: boolean;
      color: string;
      size: number;
    }) => {
      let iconName = '';
      switch (route.name) {
        case 'Agenda':
          iconName = 'ios-list';
          break;
        case 'Weekly View':
          iconName = 'ios-albums';
          break;
        case 'Monthly':
          iconName = 'ios-calendar';
          break;
        case 'Settings':
          iconName = 'ios-settings';
          break;
        default:
          iconName = 'ios-calendar';
          break;
      }
      if (!focused) {
        iconName = `${iconName}-outline`;
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  });

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({route}) => getTabBarIcon(route)}>
        <Tab.Screen name="Agenda" component={AgendaStack} />
        <Tab.Screen
          name="Weekly View"
          options={{tabBarLabel: 'Weekly'}}
          component={WeeklyStack}
        />
        <Tab.Screen name="Monthly" component={MonthlyStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
