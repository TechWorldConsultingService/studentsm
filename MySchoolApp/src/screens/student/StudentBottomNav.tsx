import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StudentDashboard from "./StudentDashboard"; // Home Screen
import NotificationsScreen from "../NotificationsScreen"; // Separate Screen
import CalendarScreen from "../CalendarScreen"; // Separate Screen
import ProfileScreen from "../ProfileScreen"; // Separate Screen

const Tab = createBottomTabNavigator();

// Define allowed icon names explicitly
type IconNames = keyof typeof MaterialCommunityIcons.glyphMap;

const TeacherBottomNav = () => {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            // Define icon names based on the route
            let iconName: IconNames = "home"; // Default icon

            if (route.name === "Home") iconName = "home";
            else if (route.name === "Notifications") iconName = "bell";
            else if (route.name === "Calendar") iconName = "calendar";
            else if (route.name === "Profile") iconName = "account";
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#6200ea",
          tabBarInactiveTintColor: "gray",
          headerShown:false
        })}
        
      >
        <Tab.Screen name="Home" component={StudentDashboard} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    
  );
};

export default TeacherBottomNav;
