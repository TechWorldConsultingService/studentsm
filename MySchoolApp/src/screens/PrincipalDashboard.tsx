import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

// Define navigation type
type NavigationProp = StackNavigationProp<RootStackParamList, "PrincipalDashboard">;

const features = [
  { name: "Attendance", icon: "calendar-check", screen: "AttendanceScreen" },
  { name: "Leave Requests", icon: "file-document", screen: "LeaveRequestsScreen" },
  { name: "Birthdays", icon: "cake-variant", screen: "BirthdaysScreen" },
  { name: "Students", icon: "account-group", screen: "StudentsScreen" },
  { name: "Teachers", icon: "school", screen: "TeachersScreen" },
  { name: "Exams", icon: "clipboard-text", screen: "ExamsScreen" },
  { name: "Classes", icon: "google-classroom", screen: "ClassesScreen" },
  { name: "Subjects", icon: "book-open", screen: "SubjectsScreen" },
  { name: "Bus Stops", icon: "bus", screen: "BusStopsScreen" },
  { name: "Notifications", icon: "bell", screen: "NotificationsScreen" },
  { name: "Messages", icon: "message-text", screen: "MessagesScreen" },
  { name: "Newsfeed", icon: "newspaper", screen: "NewsFeedScreen" },
  { name: "Calendar", icon: "calendar", screen: "CalendarScreen" },
  { name: "Profile", icon: "account", screen: "ProfileScreen" },
];

const PrincipalDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const renderFeature = ({ item }: { item: (typeof features)[0] }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}>
      <Card style={styles.card}>
        <Avatar.Icon size={50} icon={item.icon} style={styles.icon} />
        <Text style={styles.cardText}>{item.name}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item) => item.name}
        numColumns={2} // Grid layout with 2 columns
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  listContainer: { alignItems: "center" },
  card: {
    flex: 1,
    margin: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    backgroundColor: "#ffffff",
  },
  icon: { backgroundColor: "#6200ea", marginBottom: 10 },
  cardText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});

export default PrincipalDashboard;
