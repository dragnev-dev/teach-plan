import React, {
  MutableRefObject,
  ReactElement,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import MonthDay from '../components/MonthDay';
import {useNavigation} from '../store/hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getScheduleForWeek} from '../store/reducers/scheduleReducer';
import {SchoolDay} from '../models/schoolDay';

const WeeklyScreen = () => {
  const navigation = useNavigation();
  const [d, setDate] = useState(useMemo(() => new Date(), []));
  const [week, setWeek] = useState(getISOWeekNumber(d));
  const {cDate, cMonth, cYear} = useMemo(() => {
    const currentDate = new Date();
    return {
      cDate: currentDate.getDate(),
      cMonth: currentDate.getMonth(),
      cYear: currentDate.getFullYear(),
    };
  }, []);

  const days = useMemo(() => getDaysOfWeek(d), [d]);

  const daysKey = useRef<number>(1);
  const weeklySchedule: SchoolDay[] =
    useSelector((state: RootState) =>
      getScheduleForWeek(
        state.schedule,
        days.map(dm => dm.string),
      ),
    ) ?? [];
  const daysList = buildDaysList(
    days,
    daysKey,
    weeklySchedule,
    cDate,
    cMonth,
    cYear,
    navigation,
  );

  return (
    <View>
      <View style={styles.container}>
        {/*<Text>Week {week}</Text>*/}
        {daysList}
      </View>
    </View>
  );
};

function buildDaysList(
  days: {date: number; month: number; year: number; string: string}[],
  key: MutableRefObject<number>,
  weeklySchedule: SchoolDay[],
  currentDate: number,
  currentMonth: number,
  currentYear: number,
  navigation: NavigationProp<any>,
): ReactElement[] {
  let count = 0;
  const daysList: ReactElement[] = days.map(
    (day: {date: number; month: number; year: number; string: string}) => {
      key.current++;
      let schoolDay: SchoolDay = weeklySchedule[count];
      count++;
      return (
        <MonthDay
          navigation={navigation}
          isoStringDate={day.string}
          number={day.date}
          schoolDay={schoolDay}
          key={key.current}
          isActive={
            day.date === currentDate &&
            day.month === currentMonth &&
            day.year === currentYear
          }
        />
      );
    },
  );

  return daysList;
}
function getDaysOfWeek(
  date: Date,
): {date: number; month: number; year: number; string: string}[] {
  // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const result: {date: number; month: number; year: number; string: string}[] =
    [];

  // Find the date of the Monday in the same week as the input date
  const monday = new Date(date);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  // Add each day of the week to the result array
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(day.getDate() + i);
    result.push({
      date: day.getDate(),
      month: day.getMonth(),
      year: day.getFullYear(),
      string: day.toISOString().slice(0, 10),
    });
  }

  return result;
}

function getISOWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear: number =
    (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
  },
});

export default WeeklyScreen;
