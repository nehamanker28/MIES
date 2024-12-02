import React from 'react'
import { Text, View } from 'react-native'


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import SessionResourceList from './SessionResourceList'
import formsFamily from './formsFamily'

const Tab = createMaterialTopTabNavigator();

const AllFormsResources = () => {
    return (
      // <View>
      // <Text>CaseNote</Text>
      // </View>
      <Tab.Navigator tabBarOptions={{
        labelStyle: { fontSize: 18, fontFamily:'Roboto-Bold',textTransform: 'none'  },
        activeTintColor: '#387af6',
        inactiveTintColor: '#191919',
      }}>
        <Tab.Screen name="Resources" component={SessionResourceList}/>
        <Tab.Screen name="Forms" component={formsFamily} />
        </Tab.Navigator>
    )
}


export default AllFormsResources
