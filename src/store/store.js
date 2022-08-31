import { configureStore } from "@reduxjs/toolkit";
import { todos } from './slices/todos.slice';

const store = configureStore({
  reducer: {todos},
});

export default store;
