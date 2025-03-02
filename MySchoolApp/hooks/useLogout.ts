import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define your navigation stack type
type RootStackParamList = {
  Login: undefined; // Define Login screen route
};

// Explicitly type the navigation
const useLogout = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken"); // Remove stored token
      await AsyncStorage.removeItem("refreshToken"); // Remove refresh token if stored

      // Reset navigation and redirect to Login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return logout;
};

export default useLogout;
