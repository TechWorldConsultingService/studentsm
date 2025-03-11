import React, { useCallback } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedClass } from "../../redux/userSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { Picker } from "@react-native-picker/picker";
import { Card, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, "TeacherDashboard">;

const features = [
  { name: "Attendance", icon: "calendar-check", screen: "SelectClassForAttendanceScreen" },
  { name: "Leave", icon: "file-document", screen: "LeaveRequestsScreen" },
  { name: "Birthdays", icon: "cake-variant", screen: "BirthdaysScreen" },
  { name: "Students", icon: "account-group", screen: "StudentsScreen" },
  { name: "Teachers", icon: "school", screen: "TeachersScreen" },
  { name: "Exams", icon: "clipboard-text", screen: "ExamsScreen" },
  { name: "Classes", icon: "google-classroom", screen: "ClassesScreen" },
  { name: "Subjects", icon: "book-open", screen: "SubjectsScreen" },
  { name: "Bus", icon: "bus", screen: "BusStopsScreen" },
  { name: "Notifications", icon: "bell", screen: "NotificationsScreen" },
  { name: "Messages", icon: "message-text", screen: "MessagesScreen" },
  { name: "Newsfeed", icon: "newspaper", screen: "NewsFeedScreen" },
  { name: "Calendar", icon: "calendar", screen: "CalendarScreen" },
  { name: "Profile", icon: "account", screen: "ProfileScreen" },
  { name: "MyLeaves", icon:"file-document", screen: "MyLeaves"}
];

const TeacherDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  // Get the class list and selected class from Redux store
  const classes = useSelector((state: RootState) => state.user.classes);
  const selectedClass = useSelector((state: RootState) => state.user.selectedClass);

  // Handle class selection (Ensure it uses classId)
  const handleClassChange = (classId: string) => {
    dispatch(setSelectedClass({ classId })); // ✅ Passes correct structure
  };

  // Memoized function to optimize re-renders
  const renderFeature = useCallback(({ item }: { item: (typeof features)[0] }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.screen === "SelectClassForAttendanceScreen") {
          navigation.navigate("SelectClassForAttendanceScreen", { selectedClass });
        } else {
          // navigation.navigate(item.screen as keyof RootStackParamList);
          // const screenName = item.screen as keyof RootStackParamList;
          // navigation.navigate(screenName);
        }
      }}
    >
      <Card style={styles.card}>
        <Avatar.Icon size={50} icon={item.icon} style={styles.icon} />
        <Text style={styles.cardText}>{item.name}</Text>
      </Card>
    </TouchableOpacity>
  ), [selectedClass, navigation]);

  return (
    <View style={styles.container}>
      {/* Dropdown for selecting a class */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Class:</Text>
        <Picker
          selectedValue={selectedClass || ""}
          onValueChange={(itemValue) => handleClassChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Choose a class" value="" />
          {classes.map((classItem) => (
            <Picker.Item key={classItem.id} label={classItem.name} value={classItem.id} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item) => item.name}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  listContainer: { alignItems: "center" },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  picker: { height: 50, width: "100%" },
  card: {
    flex: 1,
    margin: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#ffffff",
    minWidth: "30%",
  },
  icon: { backgroundColor: "#6200ea", marginBottom: 10 },
  cardText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});

export default TeacherDashboard;
