import * as React from 'react';
import { Text, View ,Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import DashBoardFamily from '../DashboardFamily';
import SessionsTabScreen from '../SessionsTabFamily';
import MyResources from '../MyResourcesFamily';
import MyResourcesDetails from '../ResourceDetailFamily';
import MyProfile from '../MyProfileFamily';
import MyTeam from '../MyTeamFamily';
import MyTeamDetailsFamily from '../MyTeamDetailsFamily';
import EditProfileScreen from '../EditProfileFamily'
import NotificationFamilyScreen from '../NotificationFamilyScreen'
import HistorySessionFamily from '../HistorySessionFamily';
import CaseNotesQueriesFamily from '../CaseNotesQueriesFamily';
import EditSession from '../EditSessionFamily'
import SessionDetailFamily from '../SessionDetailFamily'
import FamilyFaq from '../FamilyFaq'
import CancelSessionFamily from '../CancelSessionFamily'
import VideoCallFamily from '../VideoCallFamily'
import ChatScreen from '../../AuthFlow/ChatScreen'
import SubscriptionPlan from '../SubscriptionPlan'
import Privacy from '../../PrivacyandSecurity'
import SessionResourceList from '../SessionResourceList'
import CaseNoteFamily from '../CaseNoteFamily'
import AllFormsResources from '../AllFormsResources'
import uploadFormFamily from '../uploadFormFamily'
import formsDetails from '../formsDetails'
import UploadForm from '../../Therapist/uploadForm'

const Stack = createStackNavigator();

function dashBoard() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
       headerShown: true,
    }}>
    <Stack.Screen name="Dashboard" options={{headerShown: false}} component={DashBoardFamily} />
    <Stack.Screen name="SessionsTabScreen" options={{ title: 'Sessions', headerTitleAlign: 'center' }} component={SessionsTabScreen} />
    <Stack.Screen name="HistorySessionFamily" options={{ title: 'History', headerTitleAlign: 'center' }} component={HistorySessionFamily} />
    <Stack.Screen name="CaseNotesQueriesFamily" options={{ title: 'SOAP Notes & Queries', headerTitleAlign: 'center' }} component={CaseNotesQueriesFamily} />
    <Stack.Screen name = "SessionDetailFamily" options={{ title: 'Session Detail ', headerTitleAlign: 'center' }} component = {SessionDetailFamily}/>
    <Stack.Screen name="EditSession" options={{ title: 'Edit Session', headerTitleAlign: 'center'}} component={EditSession} />
    <Stack.Screen name="CancelSessionFamily" options={{ title: 'Sessions Cancel Request', headerTitleAlign: 'center'}} component={CancelSessionFamily} />
    <Stack.Screen name = "NotificationFamilyScreen" options={{ title: 'Notifications ',headerTitleAlign: 'center' }} component = {NotificationFamilyScreen}/>
    <Stack.Screen name="MyTeam" options={{ title: 'My Team', headerTitleAlign: 'center' }} component={MyTeam} />
    <Stack.Screen name="MyTeamDetailsFamily" options={{ title: 'Detail', headerTitleAlign: 'center' }} component={MyTeamDetailsFamily} />
    <Stack.Screen name="ChatScreen" options={{ title: 'Chat', headerTitleAlign: 'center' }} component={ChatScreen} />
    <Stack.Screen name="CaseNote" options={{ title: 'Queries', headerTitleAlign: 'center' }} component={CaseNoteFamily} />
    <Stack.Screen name="VideoCall" options={{ title: 'Video Session', headerShown:false }} component={VideoCallFamily} />
   {/* <Stack.Screen name="EditProfile" component={EditProfile} /> */}
   </Stack.Navigator>
  );
  }
  
  function sessionsTabScreen() {
    return (
      <Stack.Navigator
        initialRouteName="SessionsTabScreen"
        >
        <Stack.Screen name="SessionsTabScreen" options={{ title: 'Sessions', headerTitleAlign: 'center' }}  component={SessionsTabScreen} />
        <Stack.Screen name="EditSession" options={{ title: 'Edit Session', headerTitleAlign: 'center'}} component={EditSession} />
        <Stack.Screen name="CancelSessionFamily" options={{ title: 'Sessions Cancel Request', headerTitleAlign: 'center'}} component={CancelSessionFamily} />
        <Stack.Screen name="SessionDetailFamily" options={{ title: 'Session Detail',headerTitleAlign: 'center' }} component={SessionDetailFamily} />
        <Stack.Screen name="VideoCall" options={{ title: 'Video Session', headerShown:false }} component={VideoCallFamily} />
     </Stack.Navigator>
    );
  }
  function myResources() {
    return (
      <Stack.Navigator
        initialRouteName="Case Note"
        screenOptions={{
         headerShown: true,
      }}>
        <Stack.Screen name="CaseNote" options={{ title: 'SOAP Notes', headerTitleAlign: 'center' }} component={CaseNoteFamily} />
        <Stack.Screen name="CaseNotesQueriesFamily" options={{ title: 'SOAP Notes', headerTitleAlign: 'center' }} component={CaseNotesQueriesFamily} />

     </Stack.Navigator>
    );
  }
  function myTeam() {
    return (
      <Stack.Navigator
        initialRouteName="MyTeam"
        screenOptions={{
         headerShown: true,
      }}>
      <Stack.Screen name="MyTeam" options={{ title: 'My Team', headerTitleAlign: 'center' }} component={MyTeam} />
      <Stack.Screen name="MyTeamDetailsFamily" options={{ title: 'Detail', headerTitleAlign: 'center' }} component={MyTeamDetailsFamily} />
      <Stack.Screen name="ChatScreen" options={{ title: 'Chat', headerTitleAlign: 'center' }} component={ChatScreen} />
     {/* <Stack.Screen name="EditProfile" component={EditProfile} /> */}
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
      <Stack.Screen name="MyProfile" options={{ title: 'Profile', headerTitleAlign: 'center' }} component={MyProfile} />
      <Stack.Screen name="EditProfile" options={{ title: 'Edit Profile', headerTitleAlign: 'center' }} component={EditProfileScreen} /> 
      <Stack.Screen name = "NotificationFamilyScreen" options={{ title: 'Notifications', headerTitleAlign: 'center' }} component = {NotificationFamilyScreen}/>
      <Stack.Screen name = "FamilyFaq" options={{ title: 'FAQ', headerTitleAlign: 'center' }} component = {FamilyFaq}/>
      <Stack.Screen name = "SubscriptionPlan" options={{ title: 'SubscriptionPlan', headerTitleAlign: 'center' }} component = {SubscriptionPlan}/>
      <Stack.Screen name = "Privacy" options={{ title: 'Privacy & Secuirty', headerTitleAlign: 'center' }} component = {Privacy}/>
      <Stack.Screen name = "SessionResourceList" options={{ title: 'Resources', headerTitleAlign: 'center' }} component = {SessionResourceList}/>
      <Stack.Screen name="MyResources" options={{ title: 'My Resources', headerTitleAlign: 'center' }} component={MyResources} />
      <Stack.Screen name="AllFormsResources" options={{ title: 'My Resources', headerTitleAlign: 'center' }} component={AllFormsResources} />
      <Stack.Screen name="MyResourcesDetails" options={{ title: 'My Resources', headerTitleAlign: 'center' }} component={MyResourcesDetails} />
      <Stack.Screen name="uploadFormFamily" options={{ title: 'My Resources', headerTitleAlign: 'center' }} component={uploadFormFamily} />
      <Stack.Screen name="formsDetails" options={{ title: 'Forms', headerTitleAlign: 'center' }} component={formsDetails} />
      <Stack.Screen name='uploadForm' options={{ title: 'upload Form', headerTitleAlign: 'center' }} component={UploadForm}></Stack.Screen>
     </Stack.Navigator>
    );
  }
  const Tab = createBottomTabNavigator();

  const FamilyBottomTab = () => (
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
        else if (route.name === 'resource') {
          icon = focused
          ? require('../../../../assets/images/selected_caseNote.png')
          : require('../../../../assets/images/caseNote.png')
        }
        else if (route.name === 'Team') {
          icon = focused
          ? require('../../../../assets/images/MyTeam-Selected.png')
          : require('../../../../assets/images/MyTeam.png')
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
        name="resource"
        component={myResources}
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

export default FamilyBottomTab;
