import React, {useState} from 'react';
import {View, Button, Alert, TextInput} from 'react-native';
import {Schedule} from '../models/schedule';
import {Syllabus} from '../models/syllabus';
import {addSchedule} from '../store/actions/scheduleActions';
import {useAppDispatch} from '../store/hooks';
import {addSyllabuses} from '../store/actions/syllabusActions';
import {useNavigation} from '@react-navigation/native';

interface ImportDataModel {
  schedule: Schedule;
  syllabuses: Syllabus[];
  teacherName: string;
}

const UploadDataScreen = () => {
  const [url, setUrl] = useState('');
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const onDataImport = async () => {
    // TODO: if !url display error
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      })
      .then(async response => {
        await handleImport(await response.text());
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error fetching file');
      });
  };

  const handleImport = async (text: string) => {
    let model: ImportDataModel | null;
    try {
      model = JSON.parse(text);
    } catch (err) {
      console.error(err);
      Alert.alert('Invalid JSON');
    }

    model = model!;

    try {
      dispatch(
        addSchedule({
          schedule: model.schedule,
          teacherName: model.teacherName,
          syllabuses: model.syllabuses,
        }),
      );
      dispatch(addSyllabuses(model.syllabuses));
    } catch (e) {
      console.error(e);
      Alert.alert('Error importing the data');
    }
    Alert.alert('Import done');
    navigation.navigate('AgendaStackAgenda');
  };

  return (
    <View>
      <TextInput value={url} onChangeText={setUrl} placeholder="Enter URL" />
      <Button title="Import Data" onPress={onDataImport} />
    </View>
  );
};

export default UploadDataScreen;
