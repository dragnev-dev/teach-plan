import React, {useState} from 'react';
import {View, Text, Switch, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Syllabus} from '../models/syllabus';
import {StackNavigationProp} from '@react-navigation/stack';
import {SCREENS} from '../navigation/AppNavigator';
import {useTranslation} from 'react-i18next';

type StackParamList = {
  Settings: undefined;
  UploadSyllabus: undefined;
  UploadSyllabusResult: {data: Syllabus};
};

const SettingsScreen = () => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const {t} = useTranslation('settings');

  React.useEffect(() => {
    navigation.setOptions({
      title: t('settings-title'),
    });
  });
  type SettingsScreenNavigationProp = StackNavigationProp<
    StackParamList,
    SCREENS.APP_SETTINGS
  >;

  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

  const handleImportData = () => {
    navigation.navigate(SCREENS.UPLOAD_DATA);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.appearanceSection}>
          <Text style={styles.appearanceOption}>Dark mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={handleDarkModeToggle}
            accessibilityLabel="Enable dark mode"
            trackColor={{false: '#757575', true: '#757575'}}
            thumbColor={darkModeEnabled ? 'black' : '#f4f3f4'}
            ios_backgroundColor="#757575"
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('import-data')}</Text>
        <Button
          title={t('import-data')}
          onPress={handleImportData}
          accessibilityLabel={t('import-data')}
        />
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
