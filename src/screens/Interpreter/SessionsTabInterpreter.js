import React from 'react'
import { Text, View } from 'react-native'


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UpcomingSession from '../Interpreter/UpComingSessionInterpreter'
import HistorySessionTherapist from '../Interpreter/HistorySessionInterpreter'

const Tab = createMaterialTopTabNavigator();

const SessionsTabInterpreter = () => {
    return (
      <Tab.Navigator tabBarOptions={{
        labelStyle: { fontSize: 18, fontFamily:'Roboto-Bold',textTransform: 'none'  },
        activeTintColor: '#387af6',
        inactiveTintColor:'#191919'
      }}>
        <Tab.Screen name="Sessions" component={UpcomingSession}/>
        <Tab.Screen name="History" component={HistorySessionTherapist} />
        </Tab.Navigator>
    )
}

export default SessionsTabInterpreter
