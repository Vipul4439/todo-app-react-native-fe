import { RouteProp } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../App";

type TaskDetailsRouteProp = RouteProp<RootStackParamList, "TaskDetails">;

type Props = {
  route: TaskDetailsRouteProp;
};

const TaskDetails: React.FC<Props> = ({ route }) => {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.taskText}>Task: {task.text}</Text>
      <Text>Status: {task.status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default TaskDetails;
