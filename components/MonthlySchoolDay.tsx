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

interface MonthDayProps {
  navigation?: NavigationProp<any> | null;
  isoStringDate?: string;
  number?: number;
  schoolDay?: SchoolDay;
  key: number;
  isPlaceholder?: boolean;
  isActive?: boolean;
}

const MonthlySchoolDay: React.NamedExoticComponent<MonthDayProps> = memo(
  ({
    navigation,
    isoStringDate,
    number,
    schoolDay,
    key,
    isPlaceholder = false,
    isActive = false,
  }: MonthDayProps): ReactElement => {
    const containerWidth: number = useMemo(() => {
      return (Dimensions.get('window').width - 59) / 7;
    }, []);
    const handleScheduleEntryPress = (): void => {
      navigation!.navigate(SCREENS.AGENDA_SCREEN, {
        dateString: isoStringDate,
      });
    };
    const schoolHoursLength = schoolDay?.entries.filter(
      e => !e.isNonSchoolHour,
    ).length;

    const nonSchoolHourColor = '#e53d2e';
    const nonSchoolHourColorSelected = '#d53b2e';
    const dayActiveColor = '#008af3';
    const dayActiveColorSelected = '#e3e5e7';

    const styles = StyleSheet.create({
      daySkeleton: {
        height: 63,
        padding: 5,
        marginHorizontal: 3,
        marginVertical: 3,
      },
      day: {
        backgroundColor: 'white',
        borderRadius: 10,
      },
      dayText: {
        fontWeight: 'bold',
        color: 'black',
      },
      dayNonSchooling: {
        backgroundColor: nonSchoolHourColor,
        borderRadius: 10,
      },
      schoolHour: {
        height: 5,
        width: '100%',
        backgroundColor: dayActiveColor,
        borderRadius: 3,
        marginBottom: 1,
      },
      dayActive: {
        backgroundColor: schoolDay?.nonSchoolingDay?.isNonSchooling
          ? nonSchoolHourColorSelected
          : dayActiveColorSelected,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 0.75,
      },
    });

    function getWorkDay() {
      function getSchoolHourPills(amount: number) {
        // show no more than 6 pills
        if (amount > 6) {
          amount = 6;
        }
        let numbers = Array.from({length: amount}, (_, i: number) => i + 1);
        return numbers.map(() => <View style={styles.schoolHour} />);
      }

      return (
        <TouchableOpacity
          onPress={() => handleScheduleEntryPress()}
          key={key}
          style={[
            styles.daySkeleton,
            {width: containerWidth},
            isActive ? styles.dayActive : styles.day,
          ]}>
          <View key={key}>
            <Text style={styles.dayText}>{`${number}. `}</Text>
            {getSchoolHourPills(schoolHoursLength!)}
          </View>
        </TouchableOpacity>
      );
    }

    function getPlaceholder() {
      return (
        <View key={key} style={[styles.daySkeleton, {width: containerWidth}]} />
      );
    }

    function getNonSchoolingDay() {
      return (
        <TouchableOpacity
          onPress={() => handleScheduleEntryPress()}
          key={key}
          style={[
            styles.daySkeleton,
            {width: containerWidth},
            isActive ? styles.dayActive : styles.dayNonSchooling,
          ]}>
          <View key={key}>
            <Text style={styles.dayText}>{`${number}. `}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    function getDayWithNoWork() {
      let viewStyles: StyleProp<ViewStyle> = [
        styles.daySkeleton,
        {width: containerWidth},
        styles.day,
      ];
      if (isActive) {
        viewStyles.push(styles.dayActive);
      }
      return (
        <TouchableOpacity
          onPress={() => handleScheduleEntryPress()}
          key={key}
          style={viewStyles}>
          <View key={key}>
            <Text style={styles.dayText}>{`${number}. `}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (isPlaceholder) {
      return getPlaceholder();
    }

    if (schoolDay?.nonSchoolingDay) {
      return getNonSchoolingDay();
    }

    if (!schoolDay || !schoolHoursLength) {
      return getDayWithNoWork();
    }

    return getWorkDay();
  },
);

export default MonthlySchoolDay;
