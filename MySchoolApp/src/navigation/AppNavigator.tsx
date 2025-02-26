
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import TeacherDashboard from "../screens/TeacherDashboard";
import StudentDashboard from "../screens/StudentDashboard";
import PrincipalDashboard from "../screens/PrincipalDashboard";

export type RootStackParamList = {
  Login: undefined;
  TeacherDashboard: undefined;
  StudentDashboard: undefined;
  PrincipalDashboard: undefined;
  AttendanceScreen: undefined;
  LeaveRequestsScreen: undefined;
  BirthdaysScreen: undefined;
  StudentsScreen: undefined;
  TeachersScreen: undefined;
  ExamsScreen: undefined;
  ClassesScreen: undefined;
  SubjectsScreen: undefined;
  BusStopsScreen: undefined;
  NotificationsScreen: undefined;
  MessagesScreen: undefined;
  NewsFeedScreen: undefined;
  CalendarScreen: undefined;
  ProfileScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
      <Stack.Screen name="PrincipalDashboard" component={PrincipalDashboard} />
    </Stack.Navigator>
  );
};
export default AppNavigator;