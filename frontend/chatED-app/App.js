import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, StyleSheet } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; 
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import Toast from 'react-native-toast-message';
import logo from './assets/chatED-logo.png';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Register"
          screenOptions={{
            headerShown: true, 
            headerRight: () => (
              <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
              </View>
            ),
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} /> 
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    marginRight: 30,
  },
  logo: {
    width: 110, 
    height: 110,
    resizeMode: 'contain',
  },
});

export default App;
