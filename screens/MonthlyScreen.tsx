import {View, StyleSheet} from 'react-native';
import React, {
  MutableRefObject,
  useMemo,
  useRef,
  useEffect,
  useState,
  ReactElement,
} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getScheduleByMonth} from '../store/reducers/scheduleReducer';
import {useNavigation} from '../store/hooks';
import MonthlySchoolDay from '../components/MonthlySchoolDay';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {getUserLocale} from '../utils/getUserLocale';
import {SchoolDay} from '../models/schoolDay';

interface Props {
  route: RouteProp<{
    params: {dateString?: string};
  }>;
}

const MonthlyScreen: React.FC<Props> = ({route}) => {
  const navigation = useNavigation();
  const selectedDate: Date = useMemo(() => {
    return route.params?.dateString
      ? new Date(route.params.dateString)
      : new Date();
  }, [route.params?.dateString]);

  const {date, month, year} = useMemo(
    () => ({
      date: selectedDate.getDate(),
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
    }),
    [selectedDate],
  );
  const [currentDate, setDate] = useState(useMemo(() => new Date(), []));
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
      title: `${selectedDate.toLocaleString(getUserLocale(), {
        month: 'long',
        year: 'numeric',
      })}`,
    });
  }, [navigation, selectedDate]);

  const daysKey = useRef<number>(1);
  const monthlySchedule: SchoolDay[] = useSelector((state: RootState) =>
    getScheduleByMonth(state.schedule, year, month + 1, daysInMonth),
  );
  const daysList = buildDaysList(
    year,
    month,
    daysInMonth,
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
  daysInMonth: number,
  daysKey: MutableRefObject<number>,
  monthlySchedule: SchoolDay[],
  currentDate: number,
  currentMonth: number,
  currentYear: number,
  navigation: NavigationProp<any>,
): ReactElement[] {
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
): ReactElement[] {
  const days: number[] = Array.from(
    {length: startDay - 1},
    (_, i: number) => i + 1,
  );

  return days.map(() => {
    key.current++;
    return <MonthlySchoolDay key={key.current} isPlaceholder={true} />;
  });
}

function getMonthDays(
  navigation: NavigationProp<any>,
  year: number,
  monthI: number,
  daysInMonth: number,
  monthlySchedule: SchoolDay[],
  currentDay: number,
  currentMonth: number,
  currentYear: number,
  key: MutableRefObject<number>,
): ReactElement[] {
  const days: number[] = Array.from(
    {length: daysInMonth},
    (_, i: number) => i + 1,
  );
  const daysList: ReactElement[] = days.map((day: number) => {
    key.current++;
    let schoolDay: SchoolDay = monthlySchedule[day - 1];
    return (
      <MonthlySchoolDay
        navigation={navigation}
        isoStringDate={`${year}-${monthI + 1}-${day}`}
        number={day}
        schoolDay={schoolDay}
        key={key.current}
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
