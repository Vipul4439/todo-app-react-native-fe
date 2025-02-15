import React from "react";

import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import store from "./redux/store";
import Todo from "./components/Todo";
import TaskDetails from "./components/TaskDetails";
import { ITodo } from "./redux/api";
const Stack = createStackNavigator();

export type RootStackParamList = {
  Todo: undefined;
  TaskDetails: { task: ITodo; onUpdate: (id: string, todoItem: ITodo) => void };
};
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator id={undefined}>
          <Stack.Screen name="Todo" component={Todo} />
          <Stack.Screen name="TaskDetails" component={TaskDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
