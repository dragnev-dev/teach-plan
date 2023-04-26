import {ActivityIndicator, Button, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {incrementCounter} from '../store/actions/counterActions';
import {container} from 'tsyringe';
import SyllabusService from '../services/syllabus.service';
import {Syllabus} from '../models/syllabus';

const AgendaScreen = () => {
  const syllabusService = container.resolve(SyllabusService);
  const [isLoading, setIsLoading] = useState(true);
  const [syllabuses, setSyllabuses] = useState<Syllabus[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await syllabusService.getAllSyllabuses();
      setSyllabuses(data);
      setIsLoading(false);
    }

    fetchData();
  }, [syllabusService]);

  const counter = useAppSelector(state => state.counter.counter);
  const dispatch = useAppDispatch();
  const dataIsNull = syllabuses ? syllabuses.length : 0;
  if (isLoading) {
    return <ActivityIndicator />;
  }

  const handleIncrement = () => {
    dispatch(incrementCounter());
  };

  return (
    <View>
      <Text>{counter}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Text>Data: {dataIsNull}</Text>
    </View>
  );
};

export default AgendaScreen;
