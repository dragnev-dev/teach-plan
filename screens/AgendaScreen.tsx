import {ScrollView} from 'react-native';
import React, {useMemo} from 'react';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {getScheduleByDate} from '../store/reducers/scheduleReducer';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import SchoolHour from '../components/SchoolHour';
import {useNavigation} from '../store/hooks';
import {RouteProp} from '@react-navigation/native';
import {getUserLocale} from '../utils/getUserLocale';

interface Props {
  route: RouteProp<{
    params: {dateString?: string};
  }>;
}
const AgendaScreen: React.FC<Props> = ({route}) => {
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

  const dailySchedule =
    useSelector((state: RootState) =>
      getScheduleByDate(state.schedule, date.toDateString()),
    ) ?? [];

  const renderAgendaEntries = (entries: TeacherScheduleEntry[]) => {
    entries.sort((a, b) => a.schoolHour - b.schoolHour);
    const entriesElements = [];
    // TODO: magic numbers. Take care of the logic here
    for (let i = 1; i <= 7; i++) {
      let entry = entries.find(e => e.schoolHour === i);
      entriesElements.push(
        SchoolHour({
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

  return <ScrollView>{renderAgendaEntries(dailySchedule)}</ScrollView>;
};

export type {Props as AgendaScreenProps};
export default AgendaScreen;
