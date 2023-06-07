import React, {PropsWithChildren, ReactElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import {NavigationProp} from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import {SCREENS} from '../navigation/AppNavigator';

type SectionProps = PropsWithChildren<{
  navigation: NavigationProp<
    ReactNavigation.RootParamList,
    never,
    undefined,
    Readonly<{
      key: string;
      index: number;
      routeNames: never[];
      history?: unknown[] | undefined;
      routes: any;
      type: string;
      stale: false;
    }>,
    {},
    {}
  >;
  date: Date;
  number: number;
  schoolHour: TeacherScheduleEntry | undefined;
  key: number;
}>;

function SchoolHour({
  navigation,
  date,
  number,
  schoolHour,
  key,
}: SectionProps): ReactElement {
  if (!schoolHour) {
    return (
      <View style={styles.item} key={key}>
        <Text style={styles.schoolHourText}>{number}.</Text>
      </View>
    );
  }
  const handleScheduleEntryPress = () => {
    navigation.navigate(SCREENS.DETAILS_SCREEN, {
      date: date.toDateString(),
      hour: number,
      key: {date: date.toDateString(), hour: number},
    });
  };
  if (schoolHour.isNonSchoolHour?.isNonSchooling) {
    return (
      <View style={[styles.item, styles.nonSchooling]}>
        <Text style={styles.classText}>
          <Text style={styles.schoolHourText}>{`${schoolHour.schoolHour}. `}</Text>
          {`${schoolHour.class}${schoolHour.subclass}`}
        </Text>
        <Text>{schoolHour.isNonSchoolHour.reason}</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={() => handleScheduleEntryPress()} key={key}>
      <View style={styles.item}>
        <Text style={styles.classText}>
          <Text
            style={styles.schoolHourText}>{`${schoolHour.schoolHour}. `}</Text>
          {`${schoolHour.class}${schoolHour.subclass}`}
        </Text>
        <HTMLView value={schoolHour.syllabusEntry?.topicName} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  nonSchooling: {
    backgroundColor: '#dcdcdc',
  },
  schoolHourText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  classText: {
    fontSize: 16,
  },
  topicText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default SchoolHour;
