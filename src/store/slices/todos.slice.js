import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "../../axios";

const apiPrefix = "/api/todos";

const setParams = (rawParams) => {
  let params = {};

  for (const key in rawParams) {
    if (rawParams[key] !== undefined) {
      params = { ...params, [key]: rawParams[key] };
    }
  }

  const config = {
    ...params,
  };

  return config;
};

export const getTodoList = createAsyncThunk("todos/getTodoList", async (_) => {
  const response = await axios.get(`${apiPrefix}`);
  return response.data.data;
});

export const deleteTask = createAsyncThunk("todos/deleteTask", async (id) => {
  const response = await axios.delete(`${apiPrefix}/${id}`);
  return response.data.data;
});

export const addTask = createAsyncThunk("todos/addTask", async (params) => {
  const response = await axios.post(`${apiPrefix}`, setParams(params));
  return response.data.data;
});

export const compliteTask = createAsyncThunk(
  "todos/compliteTask",
  async (params) => {
    const response = await axios.put(
      `${apiPrefix}/${params.id}`,
      setParams(params)
    );
    return response.data.data;
  }
);

const initialState = {
  todoList: [],
  loading: false,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getTodos
    builder.addCase(getTodoList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTodoList.fulfilled, (state, action) => {
      state.todoList = action.payload;
      state.loading = false;
    });
    builder.addCase(getTodoList.rejected, (state) => {
      state.loading = false;
      message.error("Failed to get todo list.");
    });

    //delete task
    builder.addCase(deleteTask.fulfilled, () => {
      message.success("Task deleted.");
    });
    builder.addCase(deleteTask.rejected, () => {
      message.error("Failed to delete task.");
    });

    //add task
    builder.addCase(addTask.fulfilled, () => {
      message.success("Task added.");
    });
    builder.addCase(addTask.rejected, () => {
      message.error("Failed to add task.");
    });

    //complite task
    builder.addCase(compliteTask.fulfilled, () => {
      message.success("Task changed.");
    });
    builder.addCase(compliteTask.rejected, () => {
      message.error("Failed to complite task.");
    });
  },
});

export const todos = todosSlice.reducer;
