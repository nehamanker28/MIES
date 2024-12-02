import React, {Component, useContext, useState, useEffect} from 'react';
import colors from '../../Common/Colors';
import string, {AsyncStorageKey,ServiceUrl} from '../../Common/String';
import style from '../../Common/styles';
import EditProfile from './EditProfileFamily';
import {AuthContext} from '../../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {getApiHelper} from '../../Service/Fetch';

//Import all required component
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {Image} from 'react-native-elements';
//import { useState } from 'react/cjs/react.development';
const TherapistArray = [
  {
    id: '1',
    value: 'SessionResourceList',
    image: require('../../../assets/images/profile_icons/payment_icon.png'),
  },
  {
    id: '2',
    value: 'Edit Details',
    image: require('../../../assets/images/profile_icons/user_icon.png'),
  },
  {
    id: '3',
    value: 'Privacy & Security',
    image: require('../../../assets/images/profile_icons/privacy_icon.png'),
  },
  {
    id: '4',
    value: 'Legal',
    image: require('../../../assets/images/profile_icons/legal_icon.png'),
  },
  {
    id: '5',
    value: 'Notifications',
    image: require('../../../assets/images/notificationBell.png'),
  },
  {
    id: '6',
    value: 'Logout',
    image: require('../../../assets/images/profile_icons/logout_icon.png'),
  },
];
const FamilyArray = [
  {
    id: '1',
    value: 'My Resources',
    image: require('../../../assets/images/profile_icons/MyResources.png'),
  },
  {
    id: '2',
    value: 'Subscription Plan',
    image: require('../../../assets/images/profile_icons/payment_icon.png'),
  },
  {
    id: '3',
    value: 'Edit Details',
    image: require('../../../assets/images/profile_icons/user_icon.png'),
  },
  {
    id: '4',
    value: 'Privacy & Security',
    image: require('../../../assets/images/profile_icons/privacy_icon.png'),
  },
  {
    id: '5',
    value: 'FAQ',
    image: require('../../../assets/images/profile_icons/question-mark.png'),
  },
  {
    id: '6',
    value: 'Notifications',
    image: require('../../../assets/images/notificationBell.png'),
  },
  {
    id: '7',
    value: 'Logout',
    image: require('../../../assets/images/profile_icons/logout_icon.png'),
  },
];

const MyProfileFamily = (props) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState({
    isLoader: false,
    userType: 'Therapist',
    isTherapist: true,
    userName: '',
    email: '',
    img: null,
    userID: '',
  });

  const {signOut} = React.useContext(AuthContext);
  const [userProfile, setUserProfile] = useState({});
  const actionOnRow = (item) => {
    //console.log(item);
    if (item.id == '1') {
      props.navigation.navigate('AllFormsResources');
    } else if (item.id == '2') {
      props.navigation.navigate('SubscriptionPlan');
    } else if (item.id == '3') {
      props.navigation.navigate('EditProfile');
      //console.log('Selected Item :', item);
    } else if (item.id == '4') {
      props.navigation.navigate('Privacy');
    } else if (item.id == '6') {
      props.navigation.navigate('NotificationFamilyScreen', {
        userID: data.userID,
      });
    } else if (item.id == '5') {
      props.navigation.navigate('FamilyFaq');
    } else if (item.id == '7') {
      unsubscribeFromTopic()
      //signOut();
    }
  };

  const ItemView = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={() => actionOnRow(item)} style = {{padding:0}}>
        <View
          style={{
            flex:1,
            flexDirection: 'row',
            marginTop: 20,
            marginBottom: 20,
            justifyContent: 'space-between',
            
          }}>
          <View style={{flexDirection: 'row',alignItems:'center',flex:3}}>
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: colors.TEXT_BLUE,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={item.image}
                style={{
                  tintColor: colors.WHITE,
                  width: 10,
                  height: 10,
                }}></Image>
            </View>
            <Text
              style={{
                fontFamily: 'Roboto-regular',
                fontSize: 18,
                marginLeft: 20,
               // marginTop: 10,
              }}>
              {item.value}
            </Text>
          </View>

          <View style={{flexDirection:'row', 
          justifyContent:'center', alignItems:'center', alignContent:'space-between'}}>
            <Image source={require('../../../assets/images/arrow.png')} style={{width:15, height:15, 
            marginLeft:0,tintColor:colors.TEXT_BLUE}} resizeMode='contain'></Image>
            </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  const ItemSeparatorView = () => {
    return (
      // FlatList Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };
 const unsubscribeFromTopic = async() =>{
  try {
    const uniqueId = await AsyncStorage.getItem(AsyncStorageKey.userUniqueId)
    messaging()
    .unsubscribeFromTopic(uniqueId)
    .then(() =>{ //console.log('Unsubscribed fom the topic!')
    signOut()
    });
    signOut()
  }
  catch (e) {
    // saving error
   }
 }
  const fetchUserDetails = async () => {
    try {
      let tempName = await AsyncStorage.getItem(AsyncStorageKey.userName);
      let tempEmail = await AsyncStorage.getItem(AsyncStorageKey.email);
      let tempImg = await AsyncStorage.getItem(AsyncStorageKey.image);
      let tempUserID = await AsyncStorage.getItem(AsyncStorageKey.userUniqueId);
      setData({
        ...data,
        userName: tempName,
        email: tempEmail,
        img: tempImg,
        userID: tempUserID,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserDetails();
      getFamilyProfile()
    }
  }, [isFocused]);

  const getFamilyProfile = () => {
    getApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.getFamilyProfile,
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Response', response.data.familyMember);
        
          setUserProfile(response.data.userProfile);
          
      } else {
        ShowAlert(response.message);
      }
    });
  };
  return (
    <ScrollView 
    showsVerticalScrollIndicator = {false}
    style={styles.container}>
      <View style={{ margin: 20 }}>
        <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
          {/* <Image source={require('../../../assets/images/sampleProfilePic.png')} style={styles.profileImage}></Image> */}
          {/* <Image
            source={{ uri: data.img }}
            style={styles.profileImage}
            PlaceholderContent={<ActivityIndicator />}
          /> */}
          { data.img ?
            <Image
              source={{uri:  data.img}}
              style={styles.profileImage}
            />
            :
           <Image source={require('../../../assets/images/defaultprofile.png')} 
           style = {styles.profileImage}></Image>
            }
          <Text style={styles.header}>{userProfile.firstName} {userProfile.lastName}</Text>
          <Text style={styles.header2}>{data.email}</Text>
        </View>
        <FlatList
          data={FamilyArray}
          keyExtractor={(item) => item.id.toString()}
          renderItem={ItemView}
          ItemSeparatorComponent={ItemSeparatorView}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  line: {
    width: 1,
    height: 72,
    backgroundColor: '#707070',
    marginLeft: 60,
  },
  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 110 / 2,
    borderColor: colors.WHITE,
    borderWidth: 3,
  },
  header: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    marginTop: 20,
    flex:1,
    textAlign:'center'
  },
  header2: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: colors.LIGHT_GRAY,
    marginTop: 5,
  },
});

export default MyProfileFamily;
