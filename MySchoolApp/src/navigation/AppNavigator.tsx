
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import TeacherDashboard from "../screens/teacher/TeacherDashboard";
import StudentDashboard from "../screens/student/StudentDashboard";
import PrincipalDashboard from "../screens/principal/PrincipalDashboard";
import TeacherBottomNav from "../screens/teacher/TeacherBottomNav"; // Use Bottom Nav
import PrincipalBottomNav from "../screens/principal/PrincipalBottomNav"; // Use Bottom Nav
import SelectClassForAttendanceScreen from "../screens/attendance/SelectClassForAttendanceScreen";

export type RootStackParamList = {
  Login: undefined;
  TeacherDashboard: undefined;
  StudentDashboard: undefined;
  PrincipalDashboard: undefined;
  AttendanceScreen: { selectedClass: string };
  SelectClassForAttendanceScreen: { selectedClass: string };
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
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
      <Stack.Screen name="PrincipalDashboard" component={PrincipalBottomNav} /> 
      <Stack.Screen name="TeacherDashboard" component={TeacherBottomNav} />
      <Stack.Screen name="SelectClassForAttendanceScreen" component={SelectClassForAttendanceScreen} />
    </Stack.Navigator>
  );
};
export default AppNavigator;