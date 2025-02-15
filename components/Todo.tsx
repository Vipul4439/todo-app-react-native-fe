import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../redux/store";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Image } from "react-native";
import Logo from "../assets/logo.png";

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
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { ITodo } from "../redux/api";

const Todo = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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

      setTimeout(async () => {
        await dispatch(createTodo({ title: goal, description: "New task", completed: false }));
        await dispatch(getTodos());
        setGoal("");
        setLoading(false);
      }, 800);
    }
  };

  const updateGoalHandler = async (id: string) => {
    if (!updatedText.trim()) return;

    setLoading(true);
    await dispatch(
      editTodo({ id, updatedTodo: { title: updatedText, description: "", completed: false } })
    );

    setTimeout(async () => {
      await dispatch(getTodos());
      setEditingId(null);
      setUpdatedText("");
      setLoading(false);
    }, 800);
  };

  const deleteHandler = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this goal?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          setLoading(true);
          setTimeout(async () => {
            await dispatch(removeTodo(id));
            await dispatch(getTodos());
            setLoading(false);
          }, 800);
        },
        style: "destructive",
      },
    ]);
  };

  const updateGoalCompleted = async (id: string, todoItem: ITodo) => {
    await dispatch(
      editTodo({
        id,
        updatedTodo: { title: todoItem.title, description: todoItem.description, completed: true },
      })
    );
    await dispatch(getTodos());
    setEditingId(null);
    setUpdatedText("");
    setLoading(false);
    alert(`${todoItem.title} Task Completed`);
  };

  const handleUpdateTodo = (id: string, todoItem: ITodo) => {
    updateGoalCompleted(id, todoItem);
  };

  return (
    <LinearGradient colors={["#F8BBD0", "#007AFF"]} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            height: 70,
          }}
        >
          <Image source={Logo} style={{ width: 110, height: 42 }} />
        </View>

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
            <Text style={styles.buttonText}>Add Goal</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.goalCard}
              onPress={() =>
                navigation.navigate("TaskDetails", { task: item, onUpdate: handleUpdateTodo })
              }
              activeOpacity={0.7}
            >
              {editingId === item.id ? (
                <TextInput
                  style={styles.editInput}
                  value={updatedText}
                  onChangeText={setUpdatedText}
                  onSubmitEditing={() => updateGoalHandler(item.id)}
                  placeholder="Update goal..."
                />
              ) : (
                <Text style={styles.goalText}>{item.title}</Text>
              )}

              <View style={styles.iconContainer}>
                {editingId === item.id ? (
                  <TouchableOpacity onPress={() => updateGoalHandler(item.id)} disabled={loading}>
                    <Icon name="check" size={24} color="green" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setEditingId(item.id);
                      setUpdatedText(item.title);
                    }}
                    disabled={loading}
                  >
                    <Icon name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => deleteHandler(item.id)} disabled={loading}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
  },

  background: {
    flex: 1,
    justifyContent: "center",
  },

  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 10,
  },

  inputContainer: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    marginHorizontal: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },

  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: "row",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    backgroundColor: "#f852cc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    overflow: "hidden",
  },

  goalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 15,
    margin: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },

  goalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  editInput: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    width: 180,
  },

  iconContainer: {
    flexDirection: "row",
    gap: 12,
  },
});

export default Todo;
