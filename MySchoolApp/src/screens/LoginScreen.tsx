import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { loginUser } from "../api/api";
import { NavigationProp, useNavigation } from '@react-navigation/native'; // Import useNavigation
// import type { StackNavigationProp } from '@react-navigation/stack';
// import type { RootTabParamList } from "../../navigation/AppNavigator";
import type { StackNavigationProp } from '@react-navigation/stack';
// import type { RootTabParamList } from "../navigation/AppNavigator";
import type { RootStackParamList } from "../navigation/AppNavigator";

// Define LoginScreenNavigationProp:
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login','StudentDashboard'>;

type Props = {
  navigation: LoginScreenNavigationProp;  // Fix: explicitly define navigation prop
};

// const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const LoginScreen: React.FC<Props> = () => {
    // const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    console.log(navigation.getState().routes);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const navigateToDashboard = (role: string) => { // Define navigateToDashboard *outside* handleLogin
      console.log(role);
      
      // switch (role) {
      //     case "teacher":
      //         navigation.navigate("TeacherDashboard");
      //         break;
      //     case "student":
      //         navigation.navigate("StudentDashboard");
      //         break;
      //     case "principal":
      //         navigation.navigate("PrincipalDashboard");
      //         break;
      //     default:
      //         console.error("Unknown role:", role);
      //         Alert.alert("Error", "Unknown user role.");
      // }
      // navigation.navigate("StudentDashboard");
      navigation.navigate("StudentDashboard")
    };

  const handleLogin = async () => {
    setError("");
    try {
      const userData = await loginUser(username, password);
      console.log("User Data:", userData);
      // navigation.navigate("StudentDashboard")


      if (userData && userData.role) {
        navigateToDashboard(userData.role);
      } else {
          console.error("User data or role is missing:", userData);
          Alert.alert("Error", "Invalid user data received.");
      }


      // const navigateToDashboard = (role: string) => {
      //   if (role === "teacher") {
      //     navigation.navigate("TeacherDashboard");
      //   } else if (role === "student") {
      //     navigation.navigate("StudentDashboard");
      //   } else if (role === "principal") {
      //     navigation.navigate("PrincipalDashboard");
      //   } else {
      //     console.error("Unknown role:", role);
      //   }
      // };


      // ... your success handling (navigation)
    } catch (err: unknown) {
      console.error("Login Error:", err);
  
      let errorMessage = "An error occurred during login.";
  
      if (err instanceof Error) {
        errorMessage = err.message; // Generic error message
      } else if (typeof err === 'string') {
          errorMessage = err;
      } else if (typeof err === 'object' && err !== null) { // Check if it's an object (likely JSON)
        try {
          const errorObject = JSON.parse(JSON.stringify(err)); // Safely parse the error
  
          if (errorObject && errorObject.username && Array.isArray(errorObject.username)) {
            errorMessage = errorObject.username.join('\n'); // Display username errors
          } else if (errorObject && errorObject.password && Array.isArray(errorObject.password)) {
              errorMessage = errorObject.password.join('\n'); // Display password errors
          } else if (errorObject && errorObject.detail) {
              errorMessage = errorObject.detail;
          } else {
              errorMessage = JSON.stringify(errorObject); // Fallback if no specific message
          }
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          errorMessage = "An error occurred during login."; // Fallback
        }
      }
  
      setError(errorMessage);
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
  error: { color: "red", marginBottom: 10 },
});

export default LoginScreen;
