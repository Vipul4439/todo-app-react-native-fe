import React, { useEffect, useState } from "react";
import { RootState } from "../redux/store";

import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { getTodos, createTodo, editTodo, removeTodo } from "../redux/goalSlice";
import Icon from "react-native-vector-icons/MaterialIcons";

const Todo = () => {
  const [goal, setGoal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedText, setUpdatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.goals.list);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const addGoalHandler = async () => {
    if (goal.trim()) {
      setLoading(true);
      await dispatch(createTodo({ title: goal, description: "New task", completed: false }));
      setGoal("");
      await dispatch(getTodos());
      setLoading(false);
    }
  };

  const updateGoalHandler = async (id: string) => {
    console.log("updating text", updatedText);
    setLoading(true);
    const updatedObject = {
      title: updatedText,
      description: "",
      completed: false,
    };
    await dispatch(editTodo({ id, updatedTodo: updatedObject }));
    setEditingId(null);
    setUpdatedText("");
    await dispatch(getTodos());
    setLoading(false);
  };

  const deleteHandler = async (id: string) => {
    setLoading(true);
    await dispatch(removeTodo(id));
    await dispatch(getTodos());
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter goal"
          value={goal}
          onChangeText={setGoal}
          onSubmitEditing={addGoalHandler}
          style={styles.input}
          placeholderTextColor="#EDE7F6"
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.button} onPress={addGoalHandler} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Goal</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="white" style={{ marginVertical: 10 }} />}

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            {editingId === item.id ? (
              <TextInput
                style={styles.input}
                value={updatedText}
                onChangeText={setUpdatedText}
                onSubmitEditing={() => updateGoalHandler(item.id)}
                autoFocus
              />
            ) : (
              <Text style={styles.goalText}>{item.title}</Text>
            )}

            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => {
                  setEditingId(item.id);
                  setUpdatedText(item.title);
                }}
                disabled={loading}
              >
                <Icon name="edit" size={24} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteHandler(item.id)} disabled={loading}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#007AFF", padding: 10 },
  inputContainer: { padding: 20 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginBottom: 10 },
  button: {
    backgroundColor: "#FF4081",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  goalItem: {
    backgroundColor: "#FCE4EC",
    padding: 15,
    margin: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  iconContainer: { flexDirection: "row", gap: 10 },
});

export default Todo;
