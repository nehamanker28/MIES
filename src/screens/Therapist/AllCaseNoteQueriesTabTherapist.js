import React from 'react'
import { Text, View } from 'react-native'


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import DraftedCaseNoteList from './DraftedCaseNoteList'
import QueriesListTherapist from './QueriesListTherapist'
import sharedCaseNoteList from './SharedCaseNoteList'

const Tab = createMaterialTopTabNavigator();

const AllCaseNoteQueriesTabTherapist = () => {
    return (
      // <View>
      // <Text>CaseNote</Text>
      // </View>
      <Tab.Navigator tabBarOptions={{
        labelStyle: { fontSize: 18, fontFamily:'Roboto-Bold',textTransform: 'none'  },
        activeTintColor: '#387af6',
        inactiveTintColor: '#191919',
      }}>
        <Tab.Screen name="Drafted" component={DraftedCaseNoteList}/>
        <Tab.Screen name="Shared" component={sharedCaseNoteList}/>
        <Tab.Screen name="Submitted" component={QueriesListTherapist} />
        </Tab.Navigator>
    )
}

export default AllCaseNoteQueriesTabTherapist
