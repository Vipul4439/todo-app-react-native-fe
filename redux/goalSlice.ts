import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTodos, addTodo, updateTodo, deleteTodo, ITodo } from "./api";

export const getTodos = createAsyncThunk("todos/getTodos", async () => {
  return await fetchTodos();
});

export const createTodo = createAsyncThunk("todos/createTodo", async (todo: ITodo) => {
  return await addTodo(todo);
});

export const editTodo = createAsyncThunk(
  "todos/editTodo",
  async ({ id, updatedTodo }: { id: string; updatedTodo: any }) => {
    return await updateTodo(id, updatedTodo);
  }
);

export const removeTodo = createAsyncThunk("todos/removeTodo", async (id: string) => {
  return await deleteTodo(id);
});

const goalSlice = createSlice({
  name: "goals",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = state.list.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.list = state.list.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default goalSlice.reducer;
