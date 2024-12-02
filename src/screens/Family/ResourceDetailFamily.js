import React, {Component} from 'react';

//Import all required component
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../Common/Colors';
import {Image} from 'react-native-elements';
import {ShowAlert, ShowLoader} from '../../Common/Helper'

import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
const ResourceDetailFamily = ({route}) => {
 const videoBuffer = (isBuffer) =>{
    //console.log(isBuffer)
    //here you could set the isBuffer value to the state and then do something with it
    //such as show a loading icon
    }
  return (
    // <View style={{paddingTop:20,alignItems:'center'}}>
    //   <Text>Aug 12,2020</Text>
    //   <Text>Session-10 with Dr. Neel Saha </Text>
    //   <View style={{marginTop:20}}>
    //     <Image
    //       source={require('../../../assets/images/sampleresources.png')}
    //       style={{
    //          width: 315,
    //         height: 295,
    //         borderColor: '#d8e4f1',
    //         borderWidth: 2,
    //         borderRadius: 10,

    //       }}></Image>
    //   </View>
    //   </View>
    <View style={{flex: 1, padding: 30, backgroundColor: colors.WHITE}}>
      <View>
        <Text style={{fontFamily: 'Roboto-Regular', fontSize: 16}}>
          {route.params.time}
        </Text>
        <Text
          style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginTop: 20}}>
          {route.params.Name}{' '}
        </Text>
      </View>
      <View style={{marginTop: 30,backgroundColor:colors.GRAY_LIGHT_BG}}>
      {(route.params.includes('image')) ?   
      <Image source={{uri: route.params.image}}
          style={{
             width: 300,
            height: 295,
            borderColor: '#d8e4f1',
            borderWidth: 2,
            borderRadius: 10,
            padding:10,
          }}></Image>
          :
          <VideoPlayer
                        hideControlsOnStart = {false}
                        video={{ uri: route.params.image }}
                        videoWidth={1600}
                        videoHeight={900}
                          />
          }
        {/* <Image
          source={require('../../../assets/images/sampleresources.png')}
          style={{
             width: 300,
            height: 295,
            borderColor: '#d8e4f1',
            borderWidth: 2,
            borderRadius: 10,

          }}></Image> */}
      
        
      </View>
    </View>
  );
};
export default ResourceDetailFamily;
