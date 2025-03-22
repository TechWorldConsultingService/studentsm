import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Image, StyleSheet } from 'react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import TeacherDashboard from '@/src/screens/teacher/TeacherDashboard';
import AppNavigator from '@/src/navigation/AppNavigator';
import { Provider } from "react-redux";
import { store } from "../../src/redux/store";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {  // ✅ Accepting navigation prop
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
