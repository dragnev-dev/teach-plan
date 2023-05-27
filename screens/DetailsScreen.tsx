import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getSchoolHourForDate} from '../store/reducers/scheduleReducer';
import {RouteProp} from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import {useNavigation} from '../store/hooks';
import { SchoolHourDetails } from '../components/SchoolHourDetailsComponent';

interface DetailsScreenProps {
  route: RouteProp<{
    params: {date: string; hour: number; key: {date: string; hour: number}};
  }>;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({route}) => {
  const navigation = useNavigation();
  const syllabusEntry = useSelector((state: RootState) =>
    getSchoolHourForDate(state.schedule, route.params.date, route.params.hour),
  );
  React.useEffect(() => {
    const date = new Date(route.params.date);
    // Update header bar title on component mount
    navigation.setOptions({
      title: `${syllabusEntry?.class}${
        syllabusEntry?.subclass
      } ${date.toLocaleString('bg-BG', {
        month: '2-digit',
        day: '2-digit',
      })}`,
    });
  }, [navigation, route.params.date, syllabusEntry]);
  if (!syllabusEntry) {
    // TODO: worth the edge case?
    return <View />;
  }

  return (
    <View
      style={styles.container}
      key={`${route.params.key.date}-${route.params.key.hour}`}>
      <SchoolHourDetails scheduleEntry={syllabusEntry!}></SchoolHourDetails>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default DetailsScreen;
