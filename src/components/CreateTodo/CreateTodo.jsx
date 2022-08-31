import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodoList, addTask } from "../../store/slices/todos.slice";
import { Input } from "antd";

import styles from "./CreateTodo.module.scss";

const CreateTodo = ({ setTodos }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  // const todos = useSelector((state) => state.todos.todoList) || [];

  const addTodo = (title) => {
    // console.log("title", title);
    const params = {
      id: new Date(),
      title,
      isComplite: false
    };
    dispatch(addTask(params));
    dispatch(getTodoList());
    setTitle("");
  };

  return (
    <div className={styles.item}>
      Add a task:{" "}
      <Input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        size="large"
        onKeyPress={(e) => e.key === "Enter" && addTodo(title)}
      />
    </div>
  );
};

export default CreateTodo;
