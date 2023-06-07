import React, {memo, ReactElement, useMemo} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

    const styles = StyleSheet.create({
      day: {
        height: 63,
        padding: 5,
        marginHorizontal: 3,
        marginVertical: 3,
      },
      dayActive: {
        backgroundColor: 'white',
        borderRadius: 10,
      },
      dayText: {
        fontWeight: 'bold',
        color: isActive ? '#1e96f0' : 'gray',
      },
      dayNonSchooling: {
        backgroundColor: 'red',
        borderRadius: 10,
      },
    });
    if (isPlaceholder) {
      return <View key={key} style={[styles.day, {width: containerWidth}]} />;
    }
    if (schoolDay?.nonSchoolingDay) {
      return (
        <TouchableOpacity
          onPress={() => handleScheduleEntryPress()}
          key={key}
          style={[styles.day, {width: containerWidth}, styles.dayNonSchooling]}>
          <View key={key}>
            <Text style={styles.dayText}>{`${number}. `}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (!schoolDay || !schoolHoursLength) {
      return (
        <TouchableOpacity
          onPress={() => handleScheduleEntryPress()}
          key={key}
          style={[styles.day, {width: containerWidth}, styles.dayActive]}>
          <View key={key}>
            <Text style={styles.dayText}>{`${number}. `}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => handleScheduleEntryPress()}
        key={key}
        style={[styles.day, {width: containerWidth}, styles.dayActive]}>
        {/* style={styles.item} */}
        <View key={key}>
          <Text style={styles.dayText}>
            {`${number}. `}
            {/* day text */}
            {/* some placeholder if there are any entries */}
          </Text>
          <Text>{schoolHoursLength}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

export default MonthlySchoolDay;
