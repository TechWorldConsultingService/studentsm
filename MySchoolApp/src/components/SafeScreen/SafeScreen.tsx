import { Text, View, Image } from 'react-native';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeScreen = ({
  children,
  backgroundColor,
  screenName,
  iconColor,
  textColor,
}: PropsWithChildren<{
  backgroundColor?: string;
  iconColor?: boolean;
  screenName?: string;
  textColor?: string;
}>): JSX.Element => {

  const route = useRoute();
  const screenNames = route.name;
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="black" />
      <View
        style={{
          height: '6%',
          width: '100%',
          backgroundColor: 'black',
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 16 }}>{screenNames === 'Home' ? 'DASHBOARD' : screenNames.toLocaleUpperCase()}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: 'red'
        }}>
      </View>
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;
