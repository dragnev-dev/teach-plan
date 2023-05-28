import {ScrollView, Text} from 'react-native';
import React from 'react';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {getScheduleByDate} from '../store/reducers/scheduleReducer';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import SchoolHour from '../components/SchoolHour';
import {useNavigation} from '../store/hooks';
import {RouteProp} from '@react-navigation/native';

interface Props {
  route: RouteProp<{
    params: {dateString?: string};
  }>;
}
const AgendaScreen: React.FC<Props> = ({route}) => {
  const navigation = useNavigation();
  const date = route.params?.dateString
    ? new Date(route.params?.dateString)
    : new Date();
  const dailySchedule =
    useSelector((state: RootState) =>
      getScheduleByDate(state.schedule, date.toDateString()),
    ) ?? [];

  // const userLocale = navigator.language;
  const options: Intl.DateTimeFormatOptions = {weekday: 'long'};
  // TODO: use userLocale
  const weekDayStr = new Intl.DateTimeFormat('bg-BG', options).format(date);
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

  return (
    <ScrollView>
      <Text>{weekDayStr}</Text>
      <Text>{date.toDateString()}</Text>
      {renderAgendaEntries(dailySchedule)}
    </ScrollView>
  );
};

export type {Props as AgendaScreenProps};
export default AgendaScreen;
