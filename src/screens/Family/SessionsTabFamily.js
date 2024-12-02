import React from 'react'
import { Text, View } from 'react-native'


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UpcomingSessionFamily from '../Family/UpComingFamily'
import HistorySessionFamily from '../Family/HistorySessionFamily'

const Tab = createMaterialTopTabNavigator();

const SessionsTabFamily = () => {
    return (
      <Tab.Navigator tabBarOptions={{
        labelStyle: { fontSize: 18, fontFamily:'Roboto-Bold', textTransform: 'none'  },
        activeTintColor: '#387af6',
        inactiveTintColor:'#191919',
      }}>
        <Tab.Screen name="Sessions" component={UpcomingSessionFamily}/>
        <Tab.Screen name="History" component={HistorySessionFamily} />
        </Tab.Navigator>
    )
}

export default SessionsTabFamily
