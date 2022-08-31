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
    params: {
      ...params,
    },
  };

  return config;
};

export const getTodoList = createAsyncThunk("todos/getTodoList", async (_) => {
  const response = await axios.get(`${apiPrefix}`);
  return response.data.data;
});

export const deleteTask = createAsyncThunk("todos/deleteTask", async (id) => 
  axios.delete(`${apiPrefix}/${id}`)
);

export const addTask = createAsyncThunk("todos/addTask", async params => {
  console.log("response params", params);
  const response = await axios.post(`${apiPrefix}`, setParams(params));
  console.log("response POST", response);
  return response.data.data;
});


export const compliteTask = createAsyncThunk("todos/compliteTask", async (params) => {
  console.log("response params", params);
  const response = await axios.put(`${apiPrefix}`);
  console.log("response put", response);
  return response.data.data;
});

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
      message.error("Failed to get todo list");
    });

    //delete task
    builder.addCase(deleteTask.rejected, (state) => {
      message.error("Failed to delete task");
    });

    //add task
    builder.addCase(addTask.rejected, (state) => {
      message.error("Failed to add task");
    });

    //complite task
    builder.addCase(compliteTask.rejected, (state) => {
      message.error("Failed to complite task");
    });
  },
});

export const todos = todosSlice.reducer;