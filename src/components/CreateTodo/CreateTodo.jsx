import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTodoList, addTask } from "../../store/slices/todos.slice";
import { Input } from "antd";

import styles from "./CreateTodo.module.scss";

const CreateTodo = ({ setTodos }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const addTodo = (title) => {
    const params = {
      id: new Date(),
      title,
      isComplite: false
    };
    dispatch(addTask(params));
    setTitle("");
  };

  useEffect(() => {
    dispatch(getTodoList());
  }, [dispatch]);

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
