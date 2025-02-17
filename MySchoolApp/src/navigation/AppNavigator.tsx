// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import LoginScreen from "../screens/LoginScreen";
// import TeacherDashboard from "../screens/TeacherDashboard"; // Add .tsx
// import StudentDashboard from "../screens/StudentDashboard";
// import PrincipalDashboard from "../screens/PrincipalDashboard";
// import { NavigationContainer } from "@react-navigation/native";

// // 1. Define your route parameter list:
// export type RootStackParamList = {
//     Login: undefined; // undefined means no params are passed
//     TeacherDashboard: undefined;
//     StudentDashboard: undefined;
//     PrincipalDashboard: undefined;
//     // Add other screens and their params as needed
// };
// // 2. Create the Stack Navigator with the type:
// // const Stack = createStackNavigator<RootStackParamList>();
// const Stack = createStackNavigator();
// const AppNavigator = () => {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName="Login">
//                 <Stack.Screen name="Login" component={LoginScreen} />
//                 <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
//                 <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
//                 <Stack.Screen name="PrincipalDashboard" component={PrincipalDashboard} />
//             </Stack.Navigator>
//         </NavigationContainer>  
//     );
// };
// export default AppNavigator;

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
};
 
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}

      <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
      <Stack.Screen name="PrincipalDashboard" component={PrincipalDashboard} />
    </Stack.Navigator>
  );
};

export default AppNavigator;