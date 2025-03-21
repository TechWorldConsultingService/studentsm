import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Avatar } from "react-native-paper";

type NavigationProp = StackNavigationProp<RootStackParamList, "StudentDashboard">;

const features = [
  { name: "MyLeaves", icon: "file-document", screen: "MyLeaves" },
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
];

const StudentDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const renderFeature = ({ item }: { item: (typeof features)[0] }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate({ name: item.screen } as any)}
    >
      <Avatar.Icon size={50} icon={item.icon} style={styles.icon} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  listContainer: { alignItems: "center" },
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

export default StudentDashboard;
