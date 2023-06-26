import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import HTMLView from 'react-native-htmlview';
import {useTranslation} from 'react-i18next';

interface SchoolHourSyllabusDetailsProps {
  scheduleEntry: TeacherScheduleEntry;
}

export function AgendaSyllabusDetails(props: SchoolHourSyllabusDetailsProps) {
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
  const {t} = useTranslation('details');

  return (
    <View>
      <HTMLView value={`<h1>${topicName}</h1>`} stylesheet={htmlStyles} />
      <Text style={styles.title}>{t('lesson-unit')}</Text>
      <HTMLView value={`<p>${lessonUnit}</p>`} stylesheet={htmlStyles} />
      <Text style={styles.title}>{t('expected-results')}</Text>
      <HTMLView value={`<p>${expectedResults}</p>`} stylesheet={htmlStyles} />
      <Text style={styles.title}>{t('methods-and-work-forms')}</Text>
      <HTMLView value={`<p>${methodsAndWorkForms}</p>`} stylesheet={htmlStyles} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginVertical: 8,
  },
});

const htmlStyles = StyleSheet.create({
  h1: {
    fontSize: 28,
    paddingTop: 0,
    marginBottom: 0,
  },
  p: {
    fontSize: 18,
  },
});
