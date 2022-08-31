import React, { useEffect } from "react";
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import TodoItem from "./components/TodoItem/TodoItem";
import CreateTodo from './components/CreateTodo/CreateTodo';
import {
  getTodoList,
  deleteTask,
  compliteTask
} from "./store/slices/todos.slice";

function App() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todoList) || [];

  useEffect(() => {
    dispatch(getTodoList());
  }, [dispatch]);

  const changeTodo = (id) => {
    // const copy = [...todos];
    // const current = copy.find(t => t.id === id);
    // console.log("current", current.isComplite);
    // current.isComplite = !current.isComplite;
    // setTodos(copy);
    dispatch(compliteTask(id)).then(() => {
      dispatch(getTodoList());
    });
  }

  const removeTodo = (id) => {
    // const copy = [...todos];
    // const current = copy.find(t => t.id === id);
    // current.isComplited = !current.isComplited;
    // const dataEdit = ([...todos].filter(t => t.id !== id));
    // console.log("dataEdit", dataEdit);
    console.log("id", id);
    dispatch(deleteTask(id)).then(() => {
      dispatch(getTodoList());
    });
  }

  return (
    <div className="App">
      <h1>TO-DO LIST</h1>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          changeTodo={changeTodo}
          removeTodo={removeTodo}
        />
      ))}
      <CreateTodo />
    </div>
  );
}

export default App;
