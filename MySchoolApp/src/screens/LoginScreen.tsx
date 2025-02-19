// import React, { useState } from "react";
// import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
// import { loginUser } from "../api/api";
// import { useNavigation } from '@react-navigation/native';
// import type { StackNavigationProp } from '@react-navigation/stack';
// import type { RootStackParamList } from "../navigation/AppNavigator";

// // No need to define navigation prop explicitly
// const LoginScreen: React.FC = () => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigateToDashboard = (role: string) => { 
//     console.log("Navigating to role:", role);
//     if (role === "student") {
//       navigation.navigate("StudentDashboard");
//     } else if (role === "teacher") {
//       navigation.navigate("TeacherDashboard");
//     } else if (role === "principal") {
//       navigation.navigate("PrincipalDashboard");
//     } else {
//       console.error("Unknown role:", role);
//       Alert.alert("Error", "Invalid role detected.");
//     }
//   };

//   const handleLogin = async () => {
//     setError("");
//     try {
//       const userData = await loginUser(username, password);
//       console.log("User Data:", userData);

//       if (userData && userData.role) {
//         navigateToDashboard(userData.role);
//       } else {
//         console.error("User data or role is missing:", userData);
//         Alert.alert("Error", "Invalid user data received.");
//       }
//     } catch (err: unknown) {
//       console.error("Login Error:", err);
//       setError("Login failed. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
//       <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
//   error: { color: "red", marginBottom: 10 },
// });

// export default LoginScreen;


import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, Title, useTheme, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../api/api";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigateToDashboard = (role: string) => {
    console.log("Navigating to role:", role);
    if (role === "student") {
      navigation.navigate("StudentDashboard");
    } else if (role === "teacher") {
      navigation.navigate("TeacherDashboard");
    } else if (role === "principal") {
      navigation.navigate("PrincipalDashboard");
    } else {
      console.error("Unknown role:", role);
      Alert.alert("Error", "Invalid role detected.");
    }
  };
  
  const handleLogin = async () => {
    setError("");
    try {
      const userData = await loginUser(username, password);
      console.log("User Data:", userData);
      if (userData && userData.role) {
        navigateToDashboard(userData.role);
      } else {
        console.error("User data or role is missing:", userData);
        Alert.alert("Error", "Invalid user data received.");
      }
    } catch (err: unknown) {
      console.error("Login Error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome to School Portal</Title>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default LoginScreen;
