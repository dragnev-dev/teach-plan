import React, {useState} from 'react';
import {Alert} from 'react-native';
import {Button, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Syllabus} from '../models/syllabus';
import SyllabusService from '../services/syllabus.service';
import {container} from 'tsyringe';

// Define the StackParamList type to represent your app's navigation structure
type StackParamList = {
  Settings: undefined;
  UploadData: undefined;
  DataResult: {syllabusId: number};
};

const UploadDataScreen = () => {
  const [input, setInput] = useState('');
  // Define the type for the navigation object using the StackParamList type
  type SettingsScreenNavigationProp = StackNavigationProp<
    StackParamList,
    'Settings'
  >;
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const syllabusService = container.resolve(SyllabusService);

  const handleParse = async () => {
    let data: Syllabus | null;
    try {
      data = JSON.parse(input);
    } catch (err) {
      Alert.alert('Invalid JSON');
    }
    // TODO: and how valid is this approach?
    data = data!;

    // try {
    let syllabusId = await syllabusService.addSyllabus(data);
    // console.log('success! ' + syllabusId);
    navigation.navigate('DataResult', {syllabusId});
    // } catch (err) {
    //   Alert.alert('Error saving to the DB');
    // }
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

// // Define the StackParamList type to represent your app's navigation structure
// type StackParamList = {
//   Settings: undefined;
//   UploadData: undefined;
//   DataResult: {syllabusId: number};
// };
//
// @injectable()
// class UploadDataScreenWrapper {
//   constructor(private syllabusService: SyllabusService) {}
//
//   render() {
//     return <UploadDataScreen syllabusService={this.syllabusService!} />;
//   }
// }
//
// export default UploadDataScreenWrapper;
//
// interface UploadDataScreenProps {
//   syllabusService: SyllabusService;
// }
//
// const UploadDataScreen: React.FC<UploadDataScreenProps> = ({
//   syllabusService,
// }) => {
//   const [input, setInput] = useState('');
//   // Define the type for the navigation object using the StackParamList type
//   type SettingsScreenNavigationProp = StackNavigationProp<
//     StackParamList,
//     'Settings'
//   >;
//   const navigation = useNavigation<SettingsScreenNavigationProp>();
//
//   const handleParse = async () => {
//     let data: Syllabus | null;
//     try {
//       data = JSON.parse(input);
//     } catch (err) {
//       Alert.alert('Invalid JSON');
//     }
//     // TODO: and how valid is this approach?
//     data = data!;
//
//     try {
//       let syllabusId = await syllabusService.addSyllabus(data);
//       navigation.navigate('DataResult', {syllabusId});
//     } catch (err) {
//       Alert.alert('Error saving to the DB');
//     }
//   };
//
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <TextInput
//         style={{borderWidth: 1, padding: 10, marginBottom: 20}}
//         placeholder="Enter some JSON here"
//         value={input}
//         onChangeText={setInput}
//         multiline
//       />
//       <Button title="Parse JSON" onPress={handleParse} />
//     </View>
//   );
// };
//
// export default UploadDataScreen;
