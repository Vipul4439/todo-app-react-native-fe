import axios from "axios";

const API_URL = "http://localhost:8000/todos";

export interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

export const fetchTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addTodo = async (todo: Todo) => {
  const response = await axios.post(API_URL + "/", todo);
  return response.data;
};

export const updateTodo = async (todoId: string, updatedTodo: Todo) => {
  console.log("todoId", todoId, "updatedTodo", updatedTodo);
  const response = await axios.put(`${API_URL}/${todoId}`, updatedTodo);
  return response.data;
};

export const deleteTodo = async (todoId: string) => {
  const response = await axios.delete(`${API_URL}/${todoId}`);
  return response.data;
};
