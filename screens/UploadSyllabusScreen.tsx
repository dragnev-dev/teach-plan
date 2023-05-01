import React, {useState} from 'react';
import {Alert} from 'react-native';
import {Button, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Syllabus} from '../models/syllabus';
import {useAppDispatch} from '../store/hooks';
import {addSyllabus} from '../store/actions/syllabusActions';

// Define the StackParamList type to represent your app's navigation structure
type StackParamList = {
  Settings: undefined;
  UploadSyllabus: undefined;
  UploadSyllabusResult: {syllabusId: number};
};

const UploadSyllabusScreen = () => {
  const [input, setInput] = useState('');
  // Define the type for the navigation object using the StackParamList type
  type SettingsScreenNavigationProp = StackNavigationProp<
    StackParamList,
    'Settings'
  >;
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const handleParse = async () => {
    let data: Syllabus | null;
    try {
      data = JSON.parse(input);
    } catch (err) {
      Alert.alert('Invalid JSON');
    }
    let syllabusId = data!.id;

    // @ts-ignore
    if (data) {
      dispatch(addSyllabus(data));
      navigation.navigate('UploadSyllabusResult', {syllabusId});
    } else {
      // TODO: maybe a different message?
      Alert.alert('Invalid JSON');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        style={{borderWidth: 1, padding: 10, marginBottom: 20}}
        placeholder="Enter some JSON here"
        value={input}
        onChangeText={setInput}
        multiline
      />
      <Button title="Parse JSON" onPress={handleParse} />
    </View>
  );
};

export default UploadSyllabusScreen;
