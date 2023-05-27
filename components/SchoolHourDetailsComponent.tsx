import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import HTMLView from 'react-native-htmlview';

interface ScheduleItemProps {
  scheduleEntry: TeacherScheduleEntry;
}

export function SchoolHourDetails(props: ScheduleItemProps) {
  const {
    class: classNumber,
    subclass,
    schoolHour,
    syllabusEntry,
  } = props.scheduleEntry;
  const {
    topicName,
    lessonUnit,
    expectedResults,
    methodsAndWorkForms,
    number,
    week,
  } = syllabusEntry;

  console.debug(syllabusEntry);

  return (
    <View>
      <HTMLView value={`<p>${topicName}</p>`} stylesheet={topicStyles} />
      <HTMLView value={lessonUnit} stylesheet={topicStyles} />
      <HTMLView value={expectedResults} />
      <HTMLView value={methodsAndWorkForms} />
    </View>
  );
}

const topicStyles = StyleSheet.create({
  p: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
});
