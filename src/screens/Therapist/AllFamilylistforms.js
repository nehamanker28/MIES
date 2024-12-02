import React from 'react'
import { Text, View } from 'react-native'


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MyFamilyTherapist from './MyFamilyTherapist'
import FormTherapist from './FormTherapist'

const Tab = createMaterialTopTabNavigator();

const AllFamilylistforms = () => {
    return (
      // <View>
      // <Text>CaseNote</Text>
      // </View>
      <Tab.Navigator tabBarOptions={{
        labelStyle: { fontSize: 18, fontFamily:'Roboto-Bold',textTransform: 'none'  },
        activeTintColor: '#387af6',
        inactiveTintColor: '#191919',
      }}>
        <Tab.Screen name="Family" component={MyFamilyTherapist}/>
        <Tab.Screen name="Forms" component={FormTherapist} />
        </Tab.Navigator>
    )
}

export default AllFamilylistforms
