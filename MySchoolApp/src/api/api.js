import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.100.9:8000/api";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    
    if (response.data.access) {
      await AsyncStorage.setItem("accessToken", response.data.access);
      await AsyncStorage.setItem("refreshToken", response.data.refresh);
      await AsyncStorage.setItem("userRole", response.data.role);
      return response.data;
    }
  } catch (error) {
    console.error("Login error", error.response?.data || error.message);
    throw error;
  }
};
