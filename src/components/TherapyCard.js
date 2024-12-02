import React, {Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Alert,
    Image,
    TouchableHighlight,
    PermissionsAndroid,
  } from 'react-native';


import string from '../Common/String';
import colors from '../Common/Colors';

const TherapyCard = (props) => {
        
        return (
            <View style = {{marginTop :0,backgroundColor : props.backgroundColor ,width :320,height :150,marginStart :30,paddingHorizontal:15,borderRadius :10}}>
                 <View style = {{flexDirection :'row',alignItems : 'center',marginTop :10}}>
                 <Image source={require('../../assets/images/sampleProfilePic.png')} style = {styles.profileImage}></Image>
                 <Text style = {styles.headertextStyle}>Johan Doe </Text>
                 </View>
                <View style = {{marginTop :20,paddingHorizontal:0,flexDirection: 'row',justifyContent :'space-between'}}>
                  <Text style = {styles.bodytextStyle}> Speech Therapy</Text>
                  <View style = {{flexDirection:'row',justifyContent :'space-evenly'}}>
                <TouchableOpacity onPress={() => {
                    props.editButtonMethod()
                  }}>
                  <Image source={require('../../assets/images/edit.png')} style = {{width:20,height:20,marginLeft :10}}></Image>
                  </TouchableOpacity>
                    <View style={styles.line} />
                    <TouchableOpacity>
                    <Image source={require('../../assets/images/delete.png')} style = {{width:20,height:22,marginLeft :10}}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style = {{flexDirection :'row', alignItems :'center',marginTop :10}}>
                   <Image source={require('../../assets/images/clock.png')} style = {{width:20,height:20,marginLeft :0}}></Image>
                   <Text  style = {styles.basictextStyle}> 9.00 - 10.00 AM </Text> 
                   <Image source={require('../../assets/images/clock.png')} style = {{width:20,height:20,marginLeft :15}}></Image>
                   <Text style = {styles.basictextStyle}> 1 Hour </Text>
                   <View style= {{backgroundColor :'#f69577',borderRadius :5,marginLeft :40,width :80,alignItems :'center',height :25,justifyContent :'center',flexDirection:'row'}} >
                   <Image source={require('../../assets/images/pending.png')} style = {{width:15,height:15,marginLeft:5}}></Image>
                   <Text style = {styles.bodytextStyle}>Pending </Text>
                   </View>
                 </View>
            </View>
        );
}

export default TherapyCard

const styles = StyleSheet.create({
    profileImage :{
        width : 52,
        height :52,
    },
    line: {
        width: 1,
        height: 27,
        backgroundColor: colors.WHITE,
        marginLeft :10,
      },
      headertextStyle :{
        marginLeft : 10,
         fontFamily :'Roboto-Medium',
         fontSize : 18,
         color :colors.WHITE_FOUR
      },
      bodytextStyle :{
        
         fontFamily :'Roboto-Medium',
         fontSize : 14,
         color :colors.WHITE_FOUR,
         marginLeft :5
      },
      basictextStyle :{
        
        fontFamily :'Roboto-Medium',
        fontSize : 11,
        color :colors.WHITE_FOUR
     }
})
