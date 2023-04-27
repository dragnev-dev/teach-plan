import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {addTodo} from '../store/actions/todoActions';
import {useNavigation} from '@react-navigation/native';

const AddTodoScreen = () => {
  const dispatch = useDispatch();
  const [todoText, setTodoText] = useState('');
  const navigation = useNavigation();

  const handleAddTodo = () => {
    dispatch(
      addTodo({
        id: '',
        title: 'Title',
        completed: false,
        description: todoText,
      }),
    );
    setTodoText('');
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Add Todo</Text>
      <TextInput
        placeholder="Enter todo text"
        value={todoText}
        onChangeText={setTodoText}
        style={{borderWidth: 1, padding: 8, margin: 16, width: '80%'}}
      />
      <Button title="Add Todo" onPress={handleAddTodo} />
    </View>
  );
};

export default AddTodoScreen;
