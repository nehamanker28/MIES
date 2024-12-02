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
  Image
} from 'react-native';
import colors from '../Common/Colors';
import {getApiHelper} from '../Service/Fetch';

const PrivacyandSecurity = ({navigation}) => {
    const renderItem = ({item}) => {
        <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14,color:colors.BLACK}}>
        {item.value}
      </Text>
        }
  return(
    <ScrollView style={styles.container}>
      <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: colors.BLACK }}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut Lorem ipsum .Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy Final
       </Text>
      <View style={{ margin: 20, flexDirection: 'row', justifyContent: 'center' }}>
        <Image source={require('../../assets/images/MIS-logo.png')} style={{ width: 40, height: 20, resizeMode: 'contain' }} ></Image>
        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 12 }}>Copyright @RCE 2021</Text>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal:30,
      paddingBottom:50
    },
})
export default PrivacyandSecurity