import React, {useEffect} from 'react';
import {Text, View, Button, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {useNavigation} from '@react-navigation/native';
import {Todo} from '../models/todo';

const TodoListScreen = () => {
  const todos = useSelector<RootState, Todo[]>(state => state.todos.todos);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({title: 'Todo List'});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={({item}) => (
          <Text style={styles.todoItem}>{item.description}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Add Todo" onPress={() => navigation.navigate('AddTodo')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  todoItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TodoListScreen;
