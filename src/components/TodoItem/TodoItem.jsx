import React from "react";
import { BsCheck } from 'react-icons/bs';
import { BsTrash } from 'react-icons/bs';

import styles from './TodoItem.module.scss';

const TodoItem = ({todo, changeTodo, removeTodo}) => {
    return (
      <div className={styles.item}>
        <div className={styles.checkButton} onClick={() => changeTodo(todo.id)}>
          {todo.isComplite && <BsCheck size={18} />}
        </div>
        <div className={todo.isComplite ? styles.titleComplited : styles.title}>
          {todo.title}
        </div>
        <div
          className={styles.deleteButton}
          onClick={() => removeTodo(todo.id)}
        >
          <BsTrash size={18} />
        </div>
      </div>
    );
};

export default TodoItem;