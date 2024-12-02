import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Button,
} from 'react-native';
import colors from '../../Common/Colors';
import {getApiHelper} from '../../Service/Fetch';
const TherapistArray = [
    {id: '1', value: 'Payment Info',image :require('../../../assets/images/profile_icons/payment_icon.png' )},
    {id: '2', value: 'Edit Details',image :require('../../../assets/images/profile_icons/user_icon.png')},
    {id: '3', value: 'Privacy & Security',image :require('../../../assets/images/profile_icons/privacy_icon.png')},
    {id: '4', value: 'Legal',image :require('../../../assets/images/profile_icons/legal_icon.png')},
    {id: '5', value: 'Notification',image :require('../../../assets/images/notificationBell.png')},
    {id: '6', value: 'Logout',image :require('../../../assets/images/profile_icons/logout_icon.png')},
];
const SubscriptionPlan = ({navigation}) => {
    const renderItem = ({item}) => {
        <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14,color:colors.BLACK}}>
        {item.value}
      </Text>
        }
  return(
      <View style = {styles.container}>
      <View style = {{flex:1,alignItems:'center',padding:20}}>
        <View style = {{flexDirection:'row',backgroundColor:'#387af6',justifyContent:'center',paddingHorizontal:40,paddingVertical:20,borderRadius:10}}>
           <Text style = {{fontSize:61,fontFamily:'Roboto-Bold',color:colors.WHITE}}>$520</Text>
           <Text style = {{fontSize:18,fontFamily:'Roboto',color:colors.WHITE}}>/month</Text>
        </View>
        </View>
        <View style = {{flex:3,flexDirection:'row',padding:20,backgroundColor:colors.WHITE}}>
           <Text>Plan Details</Text>
           <FlatList
            //horizontal={true}
            data={TherapistArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => 'index' + index}
          />
        </View>
      </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
})
export default SubscriptionPlan