import {Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Syllabus} from '../models/syllabus';

interface DataResultProps {
  route: RouteProp<{params: {data: Syllabus}}, 'params'>;
}

const DataResultScreen = ({route}: DataResultProps) => {
  const {data} = route.params;

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{marginBottom: 10}}>Class: {data.class}</Text>
      <Text style={{marginBottom: 10}}>Subject: {data.subject}</Text>
      {/*<Text>City: {data.city}</Text>*/}
    </View>
  );
};

export default DataResultScreen;
