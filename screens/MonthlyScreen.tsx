import {StyleSheet, View} from 'react-native';
import React, {MutableRefObject, useMemo, useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getScheduleByMonth} from '../store/reducers/scheduleReducer';
import {useNavigation} from '../store/hooks';
import MonthDay from '../components/MonthDay';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import {NavigationProp} from '@react-navigation/native';
import {getUserLocale} from '../utils/getUserLocale';

interface Props {}

const MonthlyScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const selectedDate = useMemo(() => new Date(), []);
  const {date, month, year} = useMemo(
    () => ({
      date: selectedDate.getDate(),
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
    }),
    [selectedDate],
  );
  const currentDate = useMemo(() => new Date(), []);
  const {cDate, cMonth, cYear} = useMemo(
    () => ({
      cDate: currentDate.getDate(),
      cMonth: currentDate.getMonth(),
      cYear: currentDate.getFullYear(),
    }),
    [currentDate],
  );
  const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);

  useEffect(() => {
    // Update header bar title on component mount
    navigation.setOptions({
      title: `${date.toLocaleString(getUserLocale(), {
        month: 'long',
        year: 'numeric',
      })}`,
    });
  }, [navigation, date]);

  const daysKey = useRef<number>(1);
  const monthlySchedule: TeacherScheduleEntry[][] =
    useSelector((state: RootState) =>
      getScheduleByMonth(state.schedule, year, month + 1, daysInMonth),
    ) ?? [];
  const daysList = buildDaysList(
    year,
    month,
    daysKey,
    monthlySchedule,
    cDate,
    cMonth,
    cYear,
    navigation,
  );

  return <View style={styles.monthContainer}>{daysList}</View>;
};

function buildDaysList(
  year: number,
  month: number,
  daysKey: MutableRefObject<number>,
  monthlySchedule: TeacherScheduleEntry[][],
  currentDate: number,
  currentMonth: number,
  currentYear: number,
  navigation: NavigationProp<any>,
): JSX.Element[] {
  const daysInMonth = getDaysInMonth(month, year);
  const startDay = getDayOfFirstDayOfMonth(year, month);
  const placeholderDays = getPlaceholderDays(startDay, daysKey);
  const daysList = getMonthDays(
    navigation,
    year,
    month,
    daysInMonth,
    monthlySchedule,
    currentDate,
    currentMonth,
    currentYear,
    daysKey,
  );

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
    {length: startDay - 1},
    (_, i: number) => i + 1,
  );

  return days.map(() => {
    key.current++;
    return <MonthDay key={key.current} isPlaceholder={true} />;
  });
}

function getMonthDays(
  navigation: NavigationProp<any>,
  year: number,
  monthI: number,
  daysInMonth: number,
  monthlySchedule: TeacherScheduleEntry[][],
  currentDay: number,
  currentMonth: number,
  currentYear: number,
  key: MutableRefObject<number>,
): JSX.Element[] {
  const days: number[] = Array.from(
    {length: daysInMonth},
    (_, i: number) => i + 1,
  );
  const daysList: JSX.Element[] = days.map((day: number) => {
    key.current++;
    let dayEntries: TeacherScheduleEntry[] = monthlySchedule[day - 1];
    return (
      <MonthDay
        navigation={navigation}
        isoStringDate={`${year}-${monthI + 1}-${day}`}
        number={day}
        schoolHours={dayEntries}
        key={key.current}
        // TODO: check year as well
        isActive={
          day === currentDay && monthI === currentMonth && year === currentYear
        }
      />
    );
  });
  return daysList;
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
