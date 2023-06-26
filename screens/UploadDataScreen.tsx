import React, {useState} from 'react';
import {View, TextInput, Button, Alert, ActivityIndicator} from 'react-native';
import {Schedule} from '../models/schedule';
import {Syllabus} from '../models/syllabus';
import {useAppDispatch, useNavigation} from '../store/hooks';
import {addSchedule} from '../store/actions/scheduleActions';
import {addSyllabuses} from '../store/actions/syllabusActions';
import {useTranslation} from 'react-i18next';

interface ImportDataModel {
  schedule: Schedule;
  syllabuses: Syllabus[];
  teacherName: string;
}

const UploadDataScreen = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation('settings');

  React.useEffect(() => {
    navigation.setOptions({
      title: t('upload-data-title'),
    });
  });

  const handleDataImport = async () => {
    if (!url) {
      Alert.alert(t('enter-url-prompt'));
      return;
    }
    setIsLoading(true); // disable button and show activity indicator
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      await handleImport(text);
    } catch (error) {
      console.error(error);
      Alert.alert(t('error-fetching-file'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (text: string) => {
    let model: ImportDataModel | null;
    try {
      model = JSON.parse(text);
    } catch (err) {
      console.error(err);
      Alert.alert(t('error-invalid-json'));
    }

    if (!model) {
      return;
    } // exit if invalid JSON

    try {
      dispatch(
        addSchedule({
          schedule: model.schedule,
          teacherName: model.teacherName,
          syllabuses: model.syllabuses,
        }),
      );
      dispatch(addSyllabuses(model.syllabuses));
      Alert.alert(t('import-successful'));
    } catch (e) {
      console.error(e);
      Alert.alert(t('error-importing-data'));
    }
    navigation.navigate('Agenda');
  };

  return (
    <View>
      <TextInput value={url} onChangeText={setUrl} placeholder={t('enter-url')} />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button
          title={t('import-data')}
          onPress={handleDataImport}
          disabled={!url}
        />
      )}
    </View>
  );
};

export default UploadDataScreen;
