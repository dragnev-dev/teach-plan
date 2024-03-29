import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getSchoolHourForDate} from '../store/reducers/scheduleReducer';
import {RouteProp} from '@react-navigation/native';
import {useNavigation} from '../store/hooks';
import {AgendaSyllabusDetails} from '../components/AgendaSyllabusDetails';
import {getUserLocale} from '../utils/getUserLocale';

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
      } ${date.toLocaleString(getUserLocale(), {
        month: '2-digit',
        day: '2-digit',
      })}`,
    });
  }, [navigation, route.params.date, syllabusEntry]);

  return (
    <ScrollView
      style={styles.container}
      key={`${route.params.key.date}-${route.params.key.hour}`}>
      <AgendaSyllabusDetails scheduleEntry={syllabusEntry!} />
    </ScrollView>
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
