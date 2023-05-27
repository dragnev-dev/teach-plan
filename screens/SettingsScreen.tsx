import React, {useState} from 'react';
import {View, Text, Switch, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Syllabus} from '../models/syllabus';
import {StackNavigationProp} from '@react-navigation/stack';

type StackParamList = {
  Settings: undefined;
  UploadSyllabus: undefined;
  UploadSyllabusResult: {data: Syllabus};
};

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  type SettingsScreenNavigationProp = StackNavigationProp<
    StackParamList,
    'Settings'
  >;

  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

  const handleImportData = () => {
    navigation.navigate('Upload Data');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.appearanceSection}>
          <Text style={styles.appearanceOption}>Dark mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={handleDarkModeToggle}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Import data</Text>
        <Button title={'Import data'} onPress={handleImportData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appearanceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appearanceOption: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default SettingsScreen;
