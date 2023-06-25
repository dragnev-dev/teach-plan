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
import DayOfMonth from '../components/DayOfMonth';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {getUserLocale} from '../utils/getUserLocale';
import {SchoolDay} from '../models/schoolDay';
import {
  NextChevronButton,
  PreviousChevronButton,
} from '../components/NavigationChevron';

interface Props {
  route: RouteProp<{
    params: {dateString?: string};
  }>;
}

const MonthlyScreen: React.FC<Props> = ({route}) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(() =>
    route.params?.dateString ? new Date(route.params.dateString) : new Date(),
  );

  const [currentDate] = useState(() => new Date());

  useEffect(() => {
    // Update header bar title on component mount
    navigation.setOptions({
      title: getFormattedMonthTitle(selectedDate),
      headerTitleAlign: 'center',
      headerLeft: () => <PreviousChevronButton onPress={goToPrevMonth} />,
      headerRight: () => <NextChevronButton onPress={goToNextMonth} />,
    });
  }, [navigation, selectedDate]);

  const monthlySchedule = useSelector((state: RootState) =>
    getScheduleByMonth(
      state.schedule,
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      getDaysInMonth(selectedDate),
    ),
  );

  function goToPrevMonth() {
    setSelectedDate(
      prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setSelectedDate(
      prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  }

  return (
    <View style={styles.monthContainer}>
      {useMonthDaysList(selectedDate, currentDate, monthlySchedule, navigation)}
    </View>
  );
};

function getFormattedMonthTitle(date: Date): string {
  return date.toLocaleString(getUserLocale(), {
    month: 'long',
    year: 'numeric',
  });
}

function useMonthDaysList(
  selectedDate: Date,
  currentDate: Date,
  monthlySchedule: SchoolDay[],
  navigation: NavigationProp<any>,
): ReactElement[] {
  const key = useRef<number>(1);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(selectedDate);
  const startDay = getDayOfFirstDayOfMonth(year, month);

  const placeholderDays = useMemo(
    () => getPlaceholderDays(startDay, key),
    [startDay],
  );
  const daysList = useMemo(
    () =>
      getMonthDays(
        year,
        month,
        daysInMonth,
        monthlySchedule,
        currentDate,
        key,
        navigation,
      ),
    [year, month, daysInMonth, monthlySchedule, currentDate, navigation],
  );

  return [...placeholderDays, ...daysList];
}

function getDaysInMonth(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
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
    return <DayOfMonth key={key.current} isPlaceholder={true} />;
  });
}

function getMonthDays(
  year: number,
  month: number,
  daysInMonth: number,
  monthlySchedule: SchoolDay[],
  currentDate: Date,
  key: MutableRefObject<number>,
  navigation: NavigationProp<any>,
): ReactElement[] {
  const days: number[] = Array.from(
    {length: daysInMonth},
    (_, i: number) => i + 1,
  );
  return days.map((day: number) => {
    key.current++;
    const schoolDay: SchoolDay = monthlySchedule[day - 1];
    const isActive =
      day === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear();
    return (
      <DayOfMonth
        navigation={navigation}
        isoStringDate={`${year}-${month + 1}-${day}`}
        number={day}
        schoolDay={schoolDay}
        key={key.current}
        isActive={isActive}
      />
    );
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
