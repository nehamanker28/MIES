import * as React from 'react';
import { Text, View ,Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import ChatScreen from '../../AuthFlow/ChatScreen'
import DashBoardInterpreter from '../DashboardInterpreter';
import SessionsTabScreen from '../SessionsTabInterpreter';
import MyFamily from '../MyFamilyInterpreter';
import FamilyDetailInterpreter from '../FamilyDetailInterpreter'
import FamilySessionInterpreter from '../FamilySessionInterpreter'
import TherapyDetailInterpreter from '../TherapyDetailInterpreter'
import MyProfile from '../MyProfileInterpreter';
import MyBilling from '../MyBillingInterpreter';
import EditProfileScreen from '../EditProfileInterpreter';
import EditSession from '../EditSessionInterpreter';
import CaseNotesQueriesInterpreter from '../CaseNotesQueriesInterpreter';
import NotificationInterpreterScreen from '../NotificationInterpreterScreen';
import SessionDetailInterpreter from '../SessionDetailInterpreter';
import CancelSessionInterpreter from '../CancelSessionInterpreter';
import VideoCall from '../VideoCallInterpreter'
import CaseNoteInterpreter from '../CaseNoteInterpreter'
import TranslateCaseNote from '../TranslateCaseNote'
import AllCaseNoteQueriesTabInterpreter from '../AllCaseNotesQueriesTabInterpreter'
import QueriesListInterpreter from '../QueriesListInterpreter'

const Stack = createStackNavigator();

function dashBoard() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
       headerShown: true,
    }}>
      <Stack.Screen name="Dashboard" options={{headerShown: false}} component={DashBoardInterpreter} />
      <Stack.Screen name="SessionsTabScreen" options={{ title: 'Sessions', headerTitleAlign: 'center'}} component={SessionsTabScreen} />
      <Stack.Screen name="CaseNotesQueriesInterpreter" options={{ title: 'Soap Notes', headerTitleAlign: 'center' }}  component={CaseNotesQueriesInterpreter} />
      <Stack.Screen name = "SessionDetailInterpreter" options={{ title: 'Session Detail ', headerTitleAlign: 'center' }} component = {SessionDetailInterpreter}/>
      <Stack.Screen name="EditSession" options={{ title: 'Edit Sessions', headerTitleAlign: 'center' }} component={EditSession} />
      <Stack.Screen name="CancelSessionInterpreter" options={{ title: 'Sessions Cancel Request', headerTitleAlign: 'center'}} component={CancelSessionInterpreter} />
      <Stack.Screen name = "NotificationInterpreterScreen" options={{ title: 'Notifications ', headerTitleAlign: 'center' }} component = {NotificationInterpreterScreen} />
      <Stack.Screen name="CaseNoteInterpreter" options={{ title: 'SOAP Notes', headerTitleAlign: 'center' }} component={CaseNoteInterpreter} />
      <Stack.Screen name="TranslateCaseNote" options={{ title: 'Translate SOAP Notes', headerTitleAlign: 'center' }} component={TranslateCaseNote} />
      <Stack.Screen name="QueriesListInterpreter" options={{ title: 'Queries', headerTitleAlign: 'center' }} component={QueriesListInterpreter} />
      <Stack.Screen name='VideoCall' options={{ title: 'Video', headerShown:false }} component={VideoCall}></Stack.Screen>
   </Stack.Navigator>
  );
  }
  
  function sessionsTabScreen() {
    return (
      <Stack.Navigator
        initialRouteName="SessionsTabScreen"
        >
        <Stack.Screen name="SessionsTabScreen" options={{ title: 'Sessions', headerTitleAlign: 'center' }} component={SessionsTabScreen} />
        <Stack.Screen name="EditSession" options={{ title: 'Edit Sessions', headerTitleAlign: 'center' }} component={EditSession} />
        <Stack.Screen name = "SessionDetailInterpreter" options={{ title: 'Session Detail ', headerTitleAlign: 'center' }} component = {SessionDetailInterpreter}/>
        <Stack.Screen name="CancelSessionInterpreter" options={{ title: 'Sessions Cancel Request', headerTitleAlign: 'center' }} component={CancelSessionInterpreter} />
        <Stack.Screen name='VideoCall' options={{ title: 'Video', headerShown:false }} component={VideoCall}></Stack.Screen>
     </Stack.Navigator>
    );
  }
  function caseNote() {
    return (
      <Stack.Navigator
        initialRouteName="CaseNoteTap"
        screenOptions={{
         headerShown: true,
      }}>
       <Stack.Screen name="CaseNoteTap" options={{ title: 'All SOAP Notes & Queries', headerTitleAlign: 'center' }} component={AllCaseNoteQueriesTabInterpreter} />
        <Stack.Screen name="CaseNoteInterpreter" options={{ title: 'SOAP Notes', headerTitleAlign: 'center' }} component={CaseNoteInterpreter} />
        <Stack.Screen name="TranslateCaseNote" options={{ title: 'Translate SOAP Notes', headerTitleAlign: 'center' }} component={TranslateCaseNote} />
        <Stack.Screen name="CaseNotesQueriesInterpreter" options={{ title: 'Queries', headerTitleAlign: 'center' }} component={CaseNotesQueriesInterpreter} />
     {/* <Stack.Screen name="EditProfile" component={EditProfile} /> */}
      
     </Stack.Navigator>
      
    );
  }
  function myTeam() {
    return (
      <Stack.Navigator
        initialRouteName="Team"
        screenOptions={{
         headerShown: true,
      }}>
        <Stack.Screen name="Team" options={{ title: 'Family', headerTitleAlign: 'center' }} component={MyFamily} />
        <Stack.Screen name="FamilyDetailInterpreter" options={{title : 'Family Details', headerTitleAlign: 'center'}} component={FamilyDetailInterpreter} />
        <Stack.Screen name="FamilySession"  options={{title : 'Family Sessions', headerTitleAlign: 'center'}} component={FamilySessionInterpreter} />
        <Stack.Screen name="TherapyDetail" options={{ title: 'Therapy Details', headerTitleAlign: 'center' }} component={TherapyDetailInterpreter} />
        <Stack.Screen name="ChatScreen" options={{ title: 'Chat', headerTitleAlign: 'center' }} component={ChatScreen} />
        <Stack.Screen name="EditSession" options={{ title: 'Edit Sessions', headerTitleAlign: 'center' }} component={EditSession} />
        <Stack.Screen name = "SessionDetailInterpreter" options={{ title: 'Session Detail ', headerTitleAlign: 'center' }} component = {SessionDetailInterpreter}/>
        <Stack.Screen name="CancelSessionInterpreter" options={{ title: 'Sessions Cancel Request', headerTitleAlign: 'center' }} component={CancelSessionInterpreter} />
     </Stack.Navigator>
    );
  }
  function Billing() {
    return (
      <Stack.Navigator
        initialRouteName="Billing"
        screenOptions={{
         headerShown: true,
      }}>
      <Stack.Screen name="Billing" options={{ title: 'Billing Info' ,headerTitleAlign: 'center',}} component={MyBilling} />
     </Stack.Navigator>
    );
  }
  function myProfile() {
    return (
      <Stack.Navigator
        initialRouteName="MyProfile"
        screenOptions={{
         headerShown: true,
      }}>
      <Stack.Screen name="MyProfile"  options={{ title: 'Profile' ,headerTitleAlign: 'center'}} component={MyProfile}/>
      <Stack.Screen name="EditProfile" options={{ title: 'Edit profile' ,headerTitleAlign: 'center'}} component={EditProfileScreen} /> 
      <Stack.Screen name = "NotificationInterpreterScreen" options={{ title: 'Notifications', headerTitleAlign: 'center' }} component = {NotificationInterpreterScreen} />
     </Stack.Navigator>
    );
  }
  const Tab = createBottomTabNavigator();

  const InterpreterBottomTab = () => (
    <Tab.Navigator initialRouteName = 'dashboard'
   
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
         var icon;;

        if (route.name === 'dashboard') {
          icon = focused
          ? require('../../../../assets/images/home_selected.png')
          : require('../../../../assets/images/home.png')
        } else if (route.name === 'Session') {
          icon = focused
          ? require('../../../../assets/images/session_selected.png')
          : require('../../../../assets/images/session.png')
        }
        else if (route.name === 'caseNote') {
          icon = focused
          ? require('../../../../assets/images/selected_caseNote.png')
          : require('../../../../assets/images/caseNote.png')
        }
        else if (route.name === 'Team') {
          icon = focused
          ? require('../../../../assets/images/MyTeam-Selected.png')
          : require('../../../../assets/images/MyTeam.png')
        }
        else if (route.name === 'Billing') {
          icon = focused
            ? require('../../../../assets/images/billing-selected.png')
          : require('../../../../assets/images/billing.png')
        }
        else if (route.name === 'Profile') {
          icon = focused
          ? require('../../../../assets/images/setting-selected.png')
          : require('../../../../assets/images/settings.png')
        }

        // You can return any component that you like here!
        return <Image source={icon} style={{ width: 50, height: 25, resizeMode: 'contain' }} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      showLabel : false
    }}
  >
      <Tab.Screen
        name="dashboard"
        component={dashBoard}
        options={({ route }) => ({
          //tabBarColor: '#009387',
          tabBarVisible: getTabBarVisibility(route)
        })}
      />
      <Tab.Screen
        name="Session"
        component={sessionsTabScreen}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route)
      })}
      />
      <Tab.Screen
        name="caseNote"
        component={caseNote}
        options={{
        
          tabBarColor: '#1f65ff',

        }}
      />
      <Tab.Screen
        name="Team"
        component={myTeam}
        options={{
          
          tabBarColor: '#1f65ff',
         
        }}
      />
       <Tab.Screen
        name="Billing"
        component={Billing}
        options={{
          tabBarColor: '#1f65ff',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={myProfile}
        options={{
          
          tabBarColor: '#1f65ff',
         
        }}
      />
      
    </Tab.Navigator>
  );

  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';

    if (routeName === 'VideoCall') {
      return false;
    }

    return true;
}

export default InterpreterBottomTab;
