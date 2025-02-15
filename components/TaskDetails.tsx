import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { RootStackParamList } from "../App";
import { LinearGradient } from "expo-linear-gradient";

type TaskDetailsRouteProp = RouteProp<RootStackParamList, "TaskDetails">;

type Props = {
  route: TaskDetailsRouteProp;
};

const TaskDetails: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { task, onUpdate } = route.params;
  const [loading, setLoading] = useState(false);

  console.log("task", task);

  const handleToggleComplete = () => {
    setLoading(true);
    onUpdate(task.id, task);
    setLoading(false);
    navigation.goBack();
  };

  return (
    <LinearGradient colors={["#FCE4EC", "#F8BBD0"]} style={styles.container}>
      <View style={styles.card}>
        <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Task:</Text>
          <Text style={styles.taskText}>{task.title}</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.status, task.completed ? styles.completed : styles.pending]}>
            {task.completed ? "Completed ✅" : "Pending ⏳"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handleToggleComplete}
          disabled={loading}
        >
          <View style={[styles.checkbox, task.completed && styles.checked]}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              task.completed && <Text>✔</Text>
            )}
          </View>
          <Text>Mark as {task.completed ? "Pending" : "Completed"}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#D81B60",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
  taskText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    width: width * 0.6,
  },
  completed: {
    backgroundColor: "#C8E6C9",
    color: "#388E3C",
  },
  pending: {
    backgroundColor: "#FFCDD2",
    color: "#D32F2F",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
});

export default TaskDetails;
