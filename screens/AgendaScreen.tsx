import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {getScheduleByDate} from '../store/reducers/scheduleReducer';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import AgendaSchoolHour from '../components/AgendaSchoolHour';
import {useNavigation} from '../store/hooks';
import {RouteProp} from '@react-navigation/native';
import {getUserLocale} from '../utils/getUserLocale';

interface AgendaScreenProps {
  route: RouteProp<{
    params: {dateString?: string};
  }>;
}
const AgendaScreen: React.FC<AgendaScreenProps> = ({route}) => {
  const navigation = useNavigation();
  const date: Date = useMemo(() => {
    return route.params?.dateString
      ? new Date(route.params.dateString)
      : new Date();
  }, [route.params?.dateString]);

  React.useEffect(() => {
    // Update header bar title on component mount
    navigation.setOptions({
      title: `${date.toLocaleString(getUserLocale(), {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}`,
    });
  }, [navigation, date]);

  const schoolDay = useSelector((state: RootState) =>
    getScheduleByDate(state.schedule, date.toDateString()),
  );

  const renderAgendaEntries = (entries: TeacherScheduleEntry[]) => {
    entries.sort((a, b) => a.schoolHour - b.schoolHour);
    const entriesElements = [];
    // TODO: magic numbers. Max number of hours into the state upon schedule import
    for (let i = 1; i <= 7; i++) {
      let entry = entries.find(e => e.schoolHour === i);
      entriesElements.push(
        AgendaSchoolHour({
          navigation,
          date: date,
          number: i,
          schoolHour: entry,
          key: i,
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
