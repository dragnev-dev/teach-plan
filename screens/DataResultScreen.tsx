import React, {Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import SyllabusService from '../services/syllabus.service';
import {container} from 'tsyringe';

interface DataResultProps {
  route: RouteProp<{params: {syllabusId: number}}, 'params'>;
}

const DataResultScreen = async ({route}: DataResultProps) => {
  const {syllabusId} = route.params;

  const syllabusService = container.resolve(SyllabusService);
  let syllabus = await syllabusService.getSyllabus(syllabusId);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{marginBottom: 10}}>Class: {syllabus.class}</Text>
      <Text style={{marginBottom: 10}}>Subject: {syllabus.subject}</Text>
      <Text style={{marginBottom: 10}}>
        Entries: {syllabus.syllabusEntries.length}
      </Text>
      {/*<Text>City: {data.city}</Text>*/}
    </View>
  );
};

export default DataResultScreen;
