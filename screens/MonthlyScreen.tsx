import {StyleSheet, View} from 'react-native';
import React, {MutableRefObject, useRef} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getScheduleByMonth} from '../store/reducers/scheduleReducer';
import {useNavigation} from '../store/hooks';
import MonthDay from '../components/MonthDay';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import {NavigationProp} from '@react-navigation/native';

function MonthlyScreen(): JSX.Element {
  const navigation = useNavigation();
  const d: Date = new Date('2023-04-01');
  const monthI: number = d.getMonth();
  const year: number = d.getFullYear();
  const daysInMonth: number = getDaysInMonth(monthI, year);
  const daysKey: React.MutableRefObject<number> = useRef<number>(1);
  const monthlySchedule: TeacherScheduleEntry[][] =
    useSelector((state: RootState) =>
      getScheduleByMonth(state.schedule, year, monthI + 1, daysInMonth),
    ) ?? [];
  const daysList: JSX.Element[] = buildDaysList(
    year,
    monthI,
    daysKey,
    monthlySchedule,
    navigation,
  );
  return <View style={styles.monthContainer}>{daysList}</View>;
}

function buildDaysList(
  year: number,
  monthI: number,
  daysKey: React.MutableRefObject<number>,
  monthlySchedule: TeacherScheduleEntry[][],
  navigation: NavigationProp<
    ReactNavigation.RootParamList,
    never,
    undefined,
    Readonly<{
      key: string;
      index: number;
      routeNames: never[];
      history?: unknown[] | undefined;
      routes: any;
      type: string;
      stale: false;
    }>,
    {},
    {}
  >,
): JSX.Element[] {
  const daysInMonth: number = getDaysInMonth(monthI, year);
  const startDay: number = getDayOfFirstDayOfMonth(year, monthI);
  const placeholderDays: JSX.Element[] = getPlaceholderDays(startDay, daysKey);
  const days: number[] = Array.from(
    {length: daysInMonth},
    (_, i: number) => i + 1,
  );
  const daysList: JSX.Element[] = days.map((day: number) => {
    let dayEntries: TeacherScheduleEntry[] = monthlySchedule[day];
    return (
      <MonthDay
        navigation={navigation}
        isoStringDate={`${year}-${monthI + 1}-${day}`}
        number={day}
        schoolHours={dayEntries}
        key={day}
      />
    );
  });

  return [...placeholderDays, ...daysList];
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getDayOfFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getPlaceholderDays(
  startDay: number,
  key: MutableRefObject<number>,
): JSX.Element[] {
  const days: number[] = Array.from(
    {length: startDay},
    (_, i: number) => i + 1,
  );

  return days.map(() => {
    return <MonthDay key={key.current} isPlaceholder={true} />;
  });
}

const styles = StyleSheet.create({
  monthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    margin: 6,
  },
});

export default MonthlyScreen;
