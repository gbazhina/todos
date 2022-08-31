import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getTodoList, addTask } from "../../store/slices/todos.slice";
import { Button, Input } from "antd";

import styles from "./CreateTodo.module.scss";

const CreateTodo = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const addTodo = (title) => {
    const params = {
      id: new Date(),
      title,
      isComplite: false,
    };
    dispatch(addTask(params)).then(() => {
      dispatch(getTodoList());
    });
    setTitle("");
  };

  return (
    <div className={styles.item}>
      <Input
        type="text"
        placeholder="Add a task"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        onKeyPress={(e) => e.key === "Enter" && addTodo(title)}
      />
      <Button
        type="primary"
        onClick={() => {
          addTodo(title);
        }}
      >
        Apply
      </Button>
    </div>
  );
};

export default CreateTodo;
