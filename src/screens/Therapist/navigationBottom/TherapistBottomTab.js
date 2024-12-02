import * as React from 'react';
import { Text, View ,Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import DashBoardTherapist from '../DashboardTherapist';
import SessionsTabScreen from '../../Therapist/SessionsTabTherapist';
import MyFamily from '../MyFamilyTherapist';
import MyProfile from '../MyProfileTherapist';
import MyBilling from '../BillingInfoTherapist';
import EditProfile from '../EditProfileTherapist'
import SessionEdit from '../EditSessionTherapist'
import AddSession from '../AddSessionTherapist'
import AddFamily from '../AddFamilyTherapist'
import AddTherapy from '../AddTherapyTherapist'
import AddInterpreter from '../AddInterpreter'
import DeleteSession from '../DeleteSessionTherapist'
import CaseNotesQueriesTherapist from '../CaseNotesQueriesTherapist'
import FamilySession from '../FamilySessionsTherapist'
import SessionDetail from '../SessionDetailTherapist'
import NotificationTherapistScreen from '../NotificationTherapistScreen';
import TherapyDetail from '../TherapyDetailTherapist'
import VideoCall from '../VideoCallTherapist'
import CancelSessionTherapist from '../CancelSessionTherapist'
import ChatScreen from '../../AuthFlow/ChatScreen'
import FamilyDetailTherapist from '../FamilyDetailTherapist'
import AllCaseNoteQueriesTabTherapist from '../AllCaseNoteQueriesTabTherapist'
import SubmitCaseNote from '../SubmitCaseNote'
import SelectLocation from '../SelectTherapyLocation'
import QueriesList from '../QueriesListTherapist'
import AllFamilylistforms from '../AllFamilylistforms'
import uploadForm from '../uploadForm'
import formsByFamilymemberID from '../formsByFamilymemberID'
import ShareCaseNote from '../ShareCaseNote'
import ViewSharedCaseNote from '../ViewSharedCaseNote'
import Privacy from '../../PrivacyandSecurity'


const Stack = createStackNavigator();

function dashBoard() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
       headerShown: true,
    }}>
      <Stack.Screen name="Dashboard" options={{headerShown: false}} component={DashBoardTherapist} />
      <Stack.Screen name="SessionsTabScreen" options={{ title: 'Sessions'}} component={SessionsTabScreen} />
      <Stack.Screen name="Edit Session" options={{ title: 'Edit Session' ,headerTitleAlign: 'center', }}  component={SessionEdit} />
      <Stack.Screen name="CaseNotesQueriesTherapist" options={{ title: 'SOAP Notes & Queries' ,headerTitleAlign: 'center',}} component={CaseNotesQueriesTherapist} />
      <Stack.Screen name='Session Details' options={{ title: 'Session Details',headerTitleAlign: 'center',}}  component={SessionDetail}></Stack.Screen>
      <Stack.Screen name="CancelSessionTherapist" options={{ title: 'Cancel Session',headerTitleAlign: 'center',}} component={CancelSessionTherapist} />
      <Stack.Screen name = "NotificationTherapistScreen" options={{ title: 'Notifications',headerTitleAlign: 'center', }} component = {NotificationTherapistScreen}/>
      <Stack.Screen name="QueriesList" options={{ title: 'Queries' ,headerTitleAlign: 'center',}} component={QueriesList} />
      <Stack.Screen name='VideoCall' options={{ title: 'Video', headerShown: false }} component={VideoCall}></Stack.Screen>
   </Stack.Navigator>
  );
  }
  
  function sessionsTabScreen() {
    return (
      <Stack.Navigator
        initialRouteName="SessionsTabScreen"
        >
      <Stack.Screen name="SessionsTabScreen" options={{ title: 'Sessions',headerTitleAlign: 'center',}}  component={SessionsTabScreen} />
        <Stack.Screen name="Edit Session" options={{ title: 'Edit Session ' , headerTitleAlign: 'center',}} component={SessionEdit} />
        <Stack.Screen name="Add Session" options={{ title: 'Add Session' ,headerTitleAlign: 'center',}} component={AddSession} />
        <Stack.Screen name='Add Family' options={{ title: 'Add Family',headerTitleAlign: 'center', }} component={AddFamily} />
        <Stack.Screen name='Add_Therapy' options={{ title: 'Add Therapy',headerTitleAlign: 'center', }} component={AddTherapy} />
        <Stack.Screen name='Add_Interpreter' options={{ title: '',headerTitleAlign: 'center' }} component={AddInterpreter} />
        <Stack.Screen name='DeleteSession' options={{ title: 'Delete Session' ,headerTitleAlign: 'center',}}  component={DeleteSession} />
        <Stack.Screen name='Session Details' options={{ title: 'Session Details',headerTitleAlign: 'center', }} component={SessionDetail}></Stack.Screen>
        <Stack.Screen name="CancelSessionTherapist" options={{ title: 'Cancel Session',headerTitleAlign: 'center',}} component={CancelSessionTherapist} />
        <Stack.Screen name='VideoCall' options={{ title: 'Video', headerShown: false }} component={VideoCall}></Stack.Screen>
        <Stack.Screen name='SelectLocation' options={{ title: 'Select Location of Treatment',headerTitleAlign: 'center'}} component={SelectLocation}></Stack.Screen>
        <Stack.Screen name="CaseNotesQueriesTherapist" options={{ title: 'SOAP Notes' ,headerTitleAlign: 'center',}} component={CaseNotesQueriesTherapist} />
        <Stack.Screen name="ViewSharedCaseNote" options={{ title: 'View SOAP Notes',headerTitleAlign: 'center', }} component={ViewSharedCaseNote} />
     </Stack.Navigator>
    );
  }
  function Team() {
    return (
      <Stack.Navigator
        initialRouteName="AllFamilylistforms"
        screenOptions={{
         headerShown: true,
      }}>
        <Stack.Screen name="AllFamilylistforms" options={{ title: 'Family' ,headerTitleAlign: 'center',}} component={AllFamilylistforms} />
        <Stack.Screen name="Team" options={{ title: 'Family' ,headerTitleAlign: 'center',}} component={MyFamily} />
        <Stack.Screen name="FamilyDetailTherapist" options={{ title: 'Family Details',headerTitleAlign: 'center', }} component={FamilyDetailTherapist} />
        <Stack.Screen name="FamilySession" options={{ title: 'Family Sessions' ,headerTitleAlign: 'center',}} component={FamilySession} />
        <Stack.Screen name="ChatScreen" options={{ title: 'Chat',headerTitleAlign: 'center', }} component={ChatScreen} />
        <Stack.Screen name="Add Session" options={{ title: 'Add Session' ,headerTitleAlign: 'center',}} component={AddSession} />
        <Stack.Screen name='Add Family' options={{ title: 'Add Family' ,headerTitleAlign: 'center',}} component={AddFamily} />
        <Stack.Screen name='Add_Therapy' options={{ title: 'Add Therapy' ,headerTitleAlign: 'center',}} component={AddTherapy} />
        <Stack.Screen name='DeleteSession' options={{ title: 'Delete Session' ,headerTitleAlign: 'center',}}  component={DeleteSession} />
        <Stack.Screen name='Session Details' options={{ title: 'Session Details' ,headerTitleAlign: 'center',}} component={SessionDetail}></Stack.Screen>
        <Stack.Screen name='uploadForm' options={{ title: 'upload Form' ,headerTitleAlign: 'center',}} component={uploadForm}></Stack.Screen>
        <Stack.Screen name='formsByFamilymemberID' options={{ title: 'Forms' ,headerTitleAlign: 'center',}} component={formsByFamilymemberID}></Stack.Screen>
        <Stack.Screen name='SelectLocation' options={{ title: 'Select Location of Treatment'}} component={SelectLocation}></Stack.Screen>
        <Stack.Screen name="Edit Session" options={{ title: 'Edit Session' ,headerTitleAlign: 'center', }}  component={SessionEdit} />
        <Stack.Screen name="CancelSessionTherapist" options={{ title: 'Cancel Session',headerTitleAlign: 'center',}} component={CancelSessionTherapist} />
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
        <Stack.Screen name="CaseNoteTap" options={{ title: 'All SOAP Notes & Queries',headerTitleAlign: 'center', }} component={AllCaseNoteQueriesTabTherapist} />
        <Stack.Screen name="CaseNote" options={{ title: 'SOAP Notes' ,headerTitleAlign: 'center',}} component={SubmitCaseNote} />
        <Stack.Screen name="CaseNotesQueriesTherapist" options={{ title: 'SOAP Notes' ,headerTitleAlign: 'center',}} component={CaseNotesQueriesTherapist} />
        <Stack.Screen name="ShareCaseNote" options={{ title: 'SOAP Notes',headerTitleAlign: 'center', }} component={ShareCaseNote} />
        <Stack.Screen name="ViewSharedCaseNote" options={{ title: 'View SOAP Notes',headerTitleAlign: 'center', }} component={ViewSharedCaseNote} />
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
      <Stack.Screen name="TherapyDetail" options={{ title: 'Therapy Details' ,headerTitleAlign: 'center',}} component={TherapyDetail} />
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
      <Stack.Screen name="MyProfile" options={{ title: 'Profile' ,headerTitleAlign: 'center',}} component={MyProfile} />
      <Stack.Screen name="EditProfile" options={{ title: 'Edit Profile' ,headerTitleAlign: 'center',}}  component={EditProfile} /> 
      <Stack.Screen name = "NotificationTherapistScreen" options={{ title: 'Notifications' ,headerTitleAlign: 'center'}} component = {NotificationTherapistScreen}/>
      <Stack.Screen name = "Privacy" options={{ title: 'Privacy & Secuirty', headerTitleAlign: 'center' }} component = {Privacy}/>
     </Stack.Navigator>
    );
  }
  const Tab = createBottomTabNavigator();

  const TherapistBottomTab = () => (
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
        else if (route.name === 'team') {
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
        name="team"
        component={Team}
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

export default TherapistBottomTab;
