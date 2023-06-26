import React, {memo, ReactElement, useMemo} from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {SCREENS} from '../navigation/AppNavigator';
import {SchoolDay} from '../models/schoolDay';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';

interface WeeklyDayProps {
  navigation: NavigationProp<any> | null;
  isoStringDate: string;
  number: number;
  schoolDay: SchoolDay;
  key: number;
  schoolHourAmount: number;
  isActive?: boolean;
}

const DayOfWeek: React.NamedExoticComponent<WeeklyDayProps> = memo(
  ({
    navigation,
    isoStringDate,
    number,
    schoolDay,
    key,
    schoolHourAmount,
    isActive = false,
  }: WeeklyDayProps): ReactElement => {
    const containerWidth: number = useMemo(() => {
      return Dimensions.get('window').width / 7;
    }, []);
    const containerHeight: number = useMemo(() => {
      return Dimensions.get('window').height;
    }, []);

    const handleScheduleEntryPress = (): void => {
      navigation!.navigate(SCREENS.WEEKLY_AGENDA_SCREEN, {
        dateString: isoStringDate,
        detailsScreenName: SCREENS.WEEKLY_DETAILS_SCREEN,
      });
    };

    const nonSchoolHourColor = '#e53d2e';
    const nonSchoolDayActiveColor = '#c9372a';
    const schoolHourColor = '#008af3';
    const currentDayActiveColor = '#e3e5e7';
    const styles = StyleSheet.create({
      daySkeleton: {
        minHeight: containerHeight,
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#e5e5e5',
      },
      day: {
        backgroundColor: 'white',
      },
      dayText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
      },
      dayNonSchooling: {
        backgroundColor: nonSchoolHourColor,
      },
      schoolHourSkeleton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: '100%',
        borderRadius: 3,
        marginBottom: 1.25,
      },
      schoolHourActive: {
        backgroundColor: schoolHourColor,
      },
      schoolHourNonSchooled: {
        backgroundColor: '#dcdcdc',
      },
      dayActive: {
        backgroundColor: schoolDay?.nonSchoolingDay?.isNonSchooling
          ? nonSchoolDayActiveColor
          : currentDayActiveColor,
        borderStyle: 'solid',
        borderColor: 'black',
        borderLeftWidth: 1,
        borderRightWidth: 1,
      },
      schoolHourText: {
        color: 'black',
      },
    });

    function getDayWithoutHours(optionalStyles: StyleProp<ViewStyle>) {
      return (
        <TouchableOpacity
          onPress={() => handleScheduleEntryPress()}
          key={key}
          style={[styles.daySkeleton, {width: containerWidth}, optionalStyles]}>
          <View key={key}>
            <Text style={styles.dayText}>{`${number}. `}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    function getDayWithHours() {
      function getSchoolHourPills(entries: TeacherScheduleEntry[]) {
        let pills = [];

        function getPlaceholderHour(i: number) {
          return (
            <View key={`${key}-${i}`} style={[styles.schoolHourSkeleton]} />
          );
        }

        function getNonSchoolingHour(i: number, entry: TeacherScheduleEntry) {
          return (
            <View
              key={`${key}-${i}`}
              style={[styles.schoolHourSkeleton, styles.schoolHourNonSchooled]}>
              <Text>
                {entry.class}
                {entry.subclass}
              </Text>
            </View>
          );
        }

        function getHour(i: number, entry: TeacherScheduleEntry) {
          return (
            <View
              key={`${key}-${i}`}
              style={[styles.schoolHourSkeleton, styles.schoolHourActive]}>
              <Text style={styles.schoolHourText}>
                {entry.class}
                {entry.subclass}
              </Text>
            </View>
          );
        }

        for (let i = 1; i <= schoolHourAmount; i++) {
          let entry = entries.find(e => e.schoolHour === i);
          if (entry) {
            if (!entry.isNonSchoolHour) {
              // default
              pills.push(getHour(i, entry));
            } else {
              // non-schooled
              pills.push(getNonSchoolingHour(i, entry));
            }
          } else {
            // placeholder
            pills.push(getPlaceholderHour(i));
          }
        }
        return pills;
      }

      return (
        <TouchableOpacity
          key={key}
          onPress={() => handleScheduleEntryPress()}
          style={[
            styles.daySkeleton,
            {width: containerWidth},
            isActive ? styles.dayActive : styles.day,
          ]}>
          <View key={key}>
            <Text style={styles.dayText}>{`${number}. `}</Text>
            {getSchoolHourPills(schoolDay.entries!)}
          </View>
        </TouchableOpacity>
      );
    }

    if (schoolDay?.nonSchoolingDay) {
      return getDayWithoutHours(
        isActive ? styles.dayActive : styles.dayNonSchooling,
      );
    }

    if (!schoolDay || !schoolDay.entries.length) {
      return getDayWithoutHours(isActive ? styles.dayActive : styles.day);
    }

    return getDayWithHours();
  },
);

export default DayOfWeek;
