/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useState, useEffect,useMemo, useReducer, SafeAreaView } from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';

import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/screens/AuthFlow/LoginScreen'
import IntroScreen from "./src/screens/AuthFlow/IntroScreen";
import SignUp from './src/screens/AuthFlow/SignUp';
import FamilyBottomTabView from './src/screens/Family/navigationBottom/FamilyBottomTab';
import TherapistBottomTab from './src/screens/Therapist/navigationBottom/TherapistBottomTab'
import InterpreterBottomTabView from './src/screens/Interpreter/navigationBottom/InterpreterBottomTab';
import SplashScreen from './src/screens/AuthFlow/SplashScreen';
import ResetPassword from './src/screens/AuthFlow/ResetPassword';
import ForgotPassword from './src/screens/AuthFlow/ForgotPassowrd';
import { AuthContext } from './src/components/context';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from '../MEIS/src/Common/String'
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();


const App = () => {

  const [data, setData] = useState({
    isLoading: true,
    userUniqueId: null,
    role:''
  })

  const authContext = useMemo(() => ({
    signIn: async (uniqueId, role) => {
      console.log('role----------->>>',role)
      try {
        await AsyncStorage.setItem(AsyncStorageKey.userUniqueId, uniqueId)
        await AsyncStorage.setItem(AsyncStorageKey.role, role)
       } catch (e) {
        // saving error
       }
     setData({
       ...data,
       isLoading: false,
       userUniqueId: uniqueId,
       role:role
      })
      global.isDisclaimerVisible = true ;
    },

   signOut: async() => {

    try {
      await AsyncStorage.removeItem(AsyncStorageKey.userUniqueId)
      await AsyncStorage.removeItem(AsyncStorageKey.role)
      await AsyncStorage.removeItem(AsyncStorageKey.userID)
      await AsyncStorage.removeItem(AsyncStorageKey.sessionId)
      await AsyncStorage.removeItem(AsyncStorageKey.accessToken)
      await AsyncStorage.removeItem(AsyncStorageKey.userName)
      await AsyncStorage.removeItem(AsyncStorageKey.email)
      await AsyncStorage.removeItem(AsyncStorageKey.password)
      await AsyncStorage.removeItem(AsyncStorageKey.data)
      await AsyncStorage.removeItem(AsyncStorageKey.image)
      await AsyncStorage.removeItem(AsyncStorageKey.phone)
      await AsyncStorage.removeItem(AsyncStorageKey.tenantId)
      await AsyncStorage.removeItem(AsyncStorageKey.signature)
    }catch (e) {
      console.log('remove item error-->>',e)
    }
  
    setData({
      ...data,
       isLoading: false,
      userUniqueId: null
     })
      global.isDisclaimerVisible = true ;
    },
 }),[]);

  const getTabBar = () => {
    //console.log('get tab role----->>>',data.userUniqueId)
    if (data.role == 'ROLE_THERAPIST') {
      return (
        <TherapistBottomTab />
      )
    } else if (data.role == 'ROLE_INTERPRETER') {
      return (
        <InterpreterBottomTabView />
      )
    }else {
      return (
        <FamilyBottomTabView />
      )
    }
  }

  useEffect(() => {
    setTimeout(async () => {
      try {
        const uniqueId = await AsyncStorage.getItem(AsyncStorageKey.userUniqueId)
        const role = await AsyncStorage.getItem(AsyncStorageKey.role)
        setData({
          ...data,
          isLoading: false,
          userUniqueId: uniqueId,
          role:role
        })
       } catch (e) {
        // saving error
       }
    }, 100);
  }, []);

  return (
    
    <AuthContext.Provider value={authContext}>
      
      <NavigationContainer>
      {data.userUniqueId != null ? 
          getTabBar() : 
          (
          <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="SplashScreen" component={SplashScreen} />
          <Stack.Screen options={{headerShown: false}} name="IntroScreen" component={IntroScreen} />
          <Stack.Screen name="Login" options={{headerTitleAlign:'center' }} component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name = "ForgotPassword" options={{ title: 'Forgot Password', headerTitleAlign:'center' }}component = {ForgotPassword} />
          </Stack.Navigator>
          ) }
        </NavigationContainer>
       
      </AuthContext.Provider>
  );
};

export default App;
