import React from "react";
import { View, Button } from "react-native";
import useLogout from "../../hooks/useLogout"; // Import logout function


const ProfileScreen = () => {
  const logout = useLogout();

  return (
    <View>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;