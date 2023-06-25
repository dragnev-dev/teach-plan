import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {
  getMaximumSchoolHoursPerDay,
  getScheduleByDate,
} from '../store/reducers/scheduleReducer';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import AgendaSchoolHour from '../components/AgendaSchoolHour';
import {useNavigation} from '../store/hooks';
import {RouteProp} from '@react-navigation/native';
import {getUserLocale} from '../utils/getUserLocale';
import {
  NextChevronButton,
  PreviousChevronButton,
} from '../components/NavigationChevron';

interface AgendaScreenProps {
  route: RouteProp<{
    params: {
      dateString?: string;
      detailsScreenName?: string;
    };
  }>;
}
const AgendaScreen: React.FC<AgendaScreenProps> = ({route}) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(() => new Date());

  React.useEffect(() => {
    if (route.params?.dateString) {
      setDate(new Date(route.params.dateString));
    }
  }, [route.params?.dateString]);
  React.useEffect(() => {
    // if no detailsScreenName provided show (implicit) back button
    if (route.params?.detailsScreenName) {
      navigation.setOptions({
        title: `${date.toLocaleString(getUserLocale(), {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}`,
        headerTitleAlign: 'center',
      });
    } else {
      // else show 1 day back and forth navigation
      navigation.setOptions({
        title: `${date.toLocaleString(getUserLocale(), {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}`,
        headerTitleAlign: 'center',
        headerLeft: () => <PreviousChevronButton onPress={goToPrevWeek} />,
        headerRight: () => <NextChevronButton onPress={goToNextWeek} />,
      });
    }
    function goToPrevWeek() {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
    }

    function goToNextWeek() {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);
    }
  }, [navigation, date, route.params?.detailsScreenName]);

  const schoolDay = useSelector((state: RootState) =>
    getScheduleByDate(state.schedule, date.toDateString()),
  );
  const schoolHourAmount = useSelector((state: RootState) =>
    getMaximumSchoolHoursPerDay(state.schedule),
  );

  const renderAgendaEntries = (entries: TeacherScheduleEntry[]) => {
    entries.sort((a, b) => a.schoolHour - b.schoolHour);
    const entriesElements = [];
    for (let i = 1; i <= schoolHourAmount; i++) {
      let entry = entries.find(e => e.schoolHour === i);
      entriesElements.push(
        AgendaSchoolHour({
          navigation,
          date: date,
          number: i,
          schoolHour: entry,
          key: i,
          detailsScreenName: route.params?.detailsScreenName,
        }),
      );
    }
    return entriesElements;
  };
  if (schoolDay?.nonSchoolingDay) {
    return (
      <View style={styles.nonSchoolingDay}>
        <Text style={styles.title}>Неучебен ден</Text>
        <Text style={styles.text}>{schoolDay.nonSchoolingDay.reason}</Text>
      </View>
    );
  }
  return (
    <ScrollView>{renderAgendaEntries(schoolDay?.entries ?? [])}</ScrollView>
  );
};

const styles = StyleSheet.create({
  nonSchoolingDay: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#dcdcdc',
    padding: 19,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    textAlign: 'center',
    width: '100%',
    fontSize: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default AgendaScreen;
