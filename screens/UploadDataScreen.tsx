import React, {useState} from 'react';
import {Alert} from 'react-native';
import {Button, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Syllabus} from '../models/syllabus';

// Define the StackParamList type to represent your app's navigation structure
type StackParamList = {
  Settings: undefined;
  UploadData: undefined;
  DataResult: {data: Syllabus};
};

const UploadDataScreen = () => {
  const [input, setInput] = useState('');
  // Define the type for the navigation object using the StackParamList type
  type SettingsScreenNavigationProp = StackNavigationProp<
    StackParamList,
    'Settings'
  >;
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleParse = () => {
    try {
      const data: Syllabus = JSON.parse(input);
      navigation.navigate('DataResult', {data});
    } catch (err) {
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

export default UploadDataScreen;
