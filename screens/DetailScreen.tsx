import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Syllabus} from '../models/syllabus';

interface DetailsScreenProps {
  syllabusId: number;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({syllabusId}) => {
  // const syllabusService = container.resolve(SyllabusService);
  const [isLoading, setIsLoading] = useState(true);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);

  useEffect(() => {
    async function fetchData() {
      // const data = await syllabusService.getSyllabus(syllabusId);
      // setSyllabus(data);
      setIsLoading(false);
    }

    fetchData();
  }, [syllabusId]); //, syllabusService]);

  // if (isLoading) {
  //   return <ActivityIndicator />;
  // }

  return (
    <View>
      This is DetailsScreen
      {/*<Text>{syllabus!.class}</Text>*/}
    </View>
  );
};

export default DetailsScreen;
