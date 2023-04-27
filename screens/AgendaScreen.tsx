import {Button, Text, View} from 'react-native';
import React from 'react';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {incrementCounter} from '../store/actions/counterActions';

const AgendaScreen = () => {
  const counter = useAppSelector(state => state.counter.counter);
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    dispatch(incrementCounter());
  };

  return (
    <View>
      <Text>{counter}</Text>
      <Button title="Increment" onPress={handleIncrement} />
    </View>
  );
};

export default AgendaScreen;
