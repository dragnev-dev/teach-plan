import {ScrollView, Text} from 'react-native';
import React from 'react';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {getScheduleByDate} from '../store/reducers/scheduleReducer';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import SchoolHourComponent from '../components/SchoolHourComponent';
import {useNavigation} from '../store/hooks';

const AgendaScreen = () => {
  const navigation = useNavigation();
  const date = new Date('2023-05-30');
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
        SchoolHourComponent({
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

export default AgendaScreen;
