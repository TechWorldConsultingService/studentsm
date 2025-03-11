import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLoginDetails } from "../redux/userSlice";
const API_URL = "http://192.168.100.7:8000/api";

export const loginUser = async (dispatch, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    console.log("response when login:", response.data);

    if (response.data.access) {
      dispatch(setLoginDetails(response.data)); // Now dispatch is passed correctly

      await AsyncStorage.setItem("accessToken", response.data.access);
      await AsyncStorage.setItem("refreshToken", response.data.refresh);
      await AsyncStorage.setItem("userRole", response.data.role);

      console.log("Access token saved:", response.data.access);
      return response.data;
    }
  } catch (error) {
    console.error("Login error", error.response?.data || error.message);
    throw error;
  }
};
