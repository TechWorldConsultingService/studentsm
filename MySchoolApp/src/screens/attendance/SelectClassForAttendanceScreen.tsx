import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Picker } from "@react-native-picker/picker";

// Define the navigation type
type NavigationProp = StackNavigationProp<RootStackParamList, "AttendanceScreen">;

// Dummy classes data (Replace with API or Redux data)
const classes = [
  { id: "1", class_name: "Class 1", class_code: "C1" },
  { id: "2", class_name: "Class 2", class_code: "C2" },
];

const SelectClassForAttendanceScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedClass, setSelectedClass] = useState("");

  const handleProceed = () => {
    if (selectedClass) {
      navigation.navigate("AttendanceScreen", { selectedClass });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Class</Text>
      <Text style={styles.subtitle}>Choose a class to proceed with attendance.</Text>

      <Picker
        selectedValue={selectedClass}
        onValueChange={(itemValue) => setSelectedClass(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Class --" value="" />
        {classes.map((item) => (
          <Picker.Item key={item.id} label={`${item.class_name} (${item.class_code})`} value={item.id} />
        ))}
      </Picker>

      <TouchableOpacity
        onPress={handleProceed}
        disabled={!selectedClass}
        style={[styles.button, !selectedClass && styles.disabledButton]}
      >
        <Text style={styles.buttonText}>Proceed to Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#6200ea", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
  picker: { width: "80%", backgroundColor: "#fff", borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: "#6200ea", padding: 10, borderRadius: 8, width: "60%", alignItems: "center" },
  disabledButton: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default SelectClassForAttendanceScreen;
