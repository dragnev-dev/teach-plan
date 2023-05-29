import React, {memo, useMemo} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TeacherScheduleEntry} from '../models/teacherScheduleEntry';
import {NavigationProp} from '@react-navigation/native';
import {SCREENS} from '../navigation/AppNavigator';

interface MonthDayProps {
  navigation?: NavigationProp<any> | null;
  isoStringDate?: string;
  number?: number;
  schoolHours?: TeacherScheduleEntry[];
  key: number;
  isPlaceholder?: boolean;
  isActive?: boolean;
}

const MonthDay: React.NamedExoticComponent<MonthDayProps> = memo(
  ({
    navigation,
    isoStringDate,
    number,
    schoolHours,
    key,
    isPlaceholder = false,
    isActive = false,
  }: MonthDayProps): JSX.Element => {
    const containerWidth: number = useMemo(() => {
      return (Dimensions.get('window').width - 59) / 7;
    }, []);
    const handleScheduleEntryPress = (): void => {
      navigation!.navigate(SCREENS.AGENDA_SCREEN, {
        dateString: isoStringDate,
      });
    };

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
        color: isActive ? 'lightblue' : 'gray',
      },
    });
    if (isPlaceholder) {
      return <View key={key} style={[styles.day, {width: containerWidth}]} />;
    }
    if (!schoolHours) {
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
          <Text
            style={[styles.dayText, {color: isActive ? 'blue' : 'inherit'}]}>
            {`${number}. `}
            {/* day text */}
            {/* some placeholder if there are any entries */}
          </Text>
          <Text>{schoolHours.length}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

export default MonthDay;
