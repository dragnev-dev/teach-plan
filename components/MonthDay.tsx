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
  navigation?: NavigationProp<
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
  > | null;
  isoStringDate?: string;
  number?: number;
  schoolHours?: TeacherScheduleEntry[];
  key: number;
  isPlaceholder?: boolean;
}

const MonthDay: React.NamedExoticComponent<MonthDayProps> = memo(
  ({
    navigation,
    isoStringDate,
    number,
    schoolHours,
    key,
    isPlaceholder = false,
  }: MonthDayProps): JSX.Element => {
    const containerWidth: number = useMemo(() => {
      return (Dimensions.get('window').width - 59) / 7;
    }, []);
    const handleScheduleEntryPress = (): void => {
      navigation!.navigate(SCREENS.AGENDA_SCREEN, {
        dateString: isoStringDate,
      });
    };
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
          <Text style={styles.dayText}>
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

const styles = StyleSheet.create({
  day: {
    // width: '14.2%', // no margin
    height: 63,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 5,
    marginHorizontal: 3,
    marginVertical: 3,
  },
  dayActive: {
    // borderStyle: 'solid',
    // borderColor: 'lightgray',
    // borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  dayText: {
    fontWeight: 'bold',
  },
});

export default MonthDay;
