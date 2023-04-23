import React from 'react';
import {View, Text, Button} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {incrementCounter} from '../store/actions/counterActions';

const HomeScreen = () => {
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

export default HomeScreen;
