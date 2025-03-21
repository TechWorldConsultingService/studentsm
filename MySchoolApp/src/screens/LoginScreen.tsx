
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, Title, useTheme, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../api/api";
import { useDispatch } from "react-redux";



const LoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const dispatch = useDispatch();
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
      const userData = await loginUser(dispatch, username, password);

      console.log("User Data:", userData);
      if (userData && userData.role) {
        navigateToDashboard(userData.role);
      } else {
        console.error("User data or role is missing:", userData);
        Alert.alert("Error", "Invalid user data received.");
      }
    } catch (err: unknown) {
      console.error("Login Error:", err);
      setError("Login failed. Please try againn.");
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
    backgroundColor: "#F1C338",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "#ffaa33",
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
