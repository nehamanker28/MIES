import React from 'react'
import { Text, View } from 'react-native'


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import CaseNoteInterpreter from './CaseNoteInterpreter'
import QueriesListInterpreter from './QueriesListInterpreter'

const Tab = createMaterialTopTabNavigator();

const AllCaseNoteQueriesTabInterpreter = () => {
    return (
      // <View>
      // <Text>CaseNote</Text>
      // </View>
      <Tab.Navigator tabBarOptions={{
        labelStyle: { fontSize: 18, fontFamily:'Roboto-Bold',textTransform: 'none'  },
        activeTintColor: '#387af6',
        inactiveTintColor: '#191919',
      }}>
        <Tab.Screen name="Translate" component={CaseNoteInterpreter}/>
        <Tab.Screen name="Submitted" component={QueriesListInterpreter} />
        </Tab.Navigator>
    )
}

export default AllCaseNoteQueriesTabInterpreter
