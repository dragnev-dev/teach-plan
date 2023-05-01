import React, {Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  selectSyllabusById,
  SyllabusState,
} from '../store/reducers/syllabusReducer';
import {Syllabus} from '../models/syllabus';

interface UploadSyllabusResultProps {
  route: RouteProp<{params: {syllabusId: number}}, 'params'>;
}

const UploadSyllabusResultScreen = async ({route}: UploadSyllabusResultProps) => {
  // let syllabus: undefined | Syllabus;
  // try {
  //   syllabus = useSelector((state: SyllabusState) =>
  //     selectSyllabusById(state, route.params.syllabusId),
  //   );
  // } catch (e) {
  //   return <div>Syllabus not found</div>;
  // }
  //
  // if (!syllabus) {
  //   return <div>Syllabus not found</div>;
  // }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Success!</Text>
      {/*<Text style={{marginBottom: 10}}>Class: {syllabus.class}</Text>*/}
      {/*<Text style={{marginBottom: 10}}>Subject: {syllabus.subject}</Text>*/}
      {/*<Text style={{marginBottom: 10}}>*/}
      {/*  Entries: {syllabus.syllabusEntries.length}*/}
      {/*</Text>*/}
    </View>
  );
};

export default UploadSyllabusResultScreen;
