import React, {ReactElement, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useNavigation} from '../store/hooks';
import {useSelector} from 'react-redux';
import {
  getMaximumSchoolHoursPerDay,
  getScheduleForWeek,
} from '../store/reducers/scheduleReducer';
import {RootState} from '../store/store';
import DayOfWeek from '../components/DayOfWeek';
import {
  NextChevronButton,
  PreviousChevronButton,
} from '../components/NavigationChevron';

interface Props {
  route: RouteProp<{
    params: {dateString?: string};
  }>;
}

const WeeklyScreen: React.FC<Props> = ({route: {params}}) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(params?.dateString ?? Date.now()),
  );
  const {
    date: cDate,
    month: cMonth,
    year: cYear,
  } = useMemo(
    () => ({
      date: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    }),
    [],
  );

  useEffect(() => {
    // Update header bar title on component mount
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerLeft: () => <PreviousChevronButton onPress={goToPrevWeek} />,
      headerRight: () => <NextChevronButton onPress={goToNextWeek} />,
    });
    function goToPrevWeek() {
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // milliseconds in a week
      const newDateMs = selectedDate.getTime() - oneWeekInMs;
      setSelectedDate(new Date(newDateMs));
    }

    function goToNextWeek() {
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // milliseconds in a week
      const newDateMs = selectedDate.getTime() + oneWeekInMs;
      setSelectedDate(new Date(newDateMs));
    }
  }, [navigation, selectedDate]);

  const days = useMemo(() => getDaysOfWeek(selectedDate), [selectedDate]);

  function buildDaysList(
    daysToBuild: {
      date: number;
      month: number;
      year: number;
      string: string;
    }[],
  ): ReactElement[] {
    function isSameDay(date1: Date, date2: Date): boolean {
      return date1.getTime() === date2.getTime();
    }

    return daysToBuild.map(({date, month, year, string}, index) => {
      const schoolDay = weeklySchedule[index];
      return (
        <DayOfWeek
          navigation={navigation}
          isoStringDate={string}
          number={date}
          schoolDay={schoolDay}
          key={index}
          schoolHourAmount={schoolHourAmount}
          isActive={isSameDay(
            new Date(year, month, date),
            new Date(cYear, cMonth, cDate),
          )}
        />
      );
    });
  }

  const weeklySchedule =
    useSelector((state: RootState) =>
      getScheduleForWeek(
        state.schedule,
        days.map(day => day.string),
      ),
    ) ?? [];
  const schoolHourAmount = useSelector((state: RootState) =>
    getMaximumSchoolHoursPerDay(state.schedule),
  );

  const daysList = buildDaysList(days);

  return (
    <View>
      <View style={styles.container}>{daysList}</View>
    </View>
  );
};

function getDaysOfWeek(
  date: Date,
): {date: number; month: number; year: number; string: string}[] {
  const monday = new Date(date);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const result = Array.from({length: 7}, (_, i) => {
    const day = new Date(monday);
    day.setDate(day.getDate() + i);
    return {
      date: day.getDate(),
      month: day.getMonth(),
      year: day.getFullYear(),
      string: day.toISOString().slice(0, 10),
    };
  });
  return result;
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
