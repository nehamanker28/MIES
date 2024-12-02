import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import colors from '../../Common/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';

import {GiftedChat} from 'react-native-gifted-chat'; //
import firebase from 'firebase';
import {Image, StyleSheet} from 'react-native';
import {AsyncStorageKey} from '../../Common/String';
import {da, te} from 'date-fns/locale';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import ImageCropPicker from 'react-native-image-crop-picker';

const ChatScreen = ({route, navigation}) => {
  let unmounted = false;
  const isFocused = useIsFocused();
  const [data, setData] = useState({
    email: '',
    phoneNumber: '',
    isLoading: false,
    uniqueId: null,
    profileImage: null,
    userName: '',
    lastName: '',
    phone: '',
    tenantID : 0,
  });

  const [messages, setMessages] = useState('');
  const [messageList, setMessagelist] = useState([]);

  const flatListRef = useRef(null);

  useEffect(() => {
    //firebase.app();
    var config = {
      apiKey: 'AIzaSyDGE1vo2s-m35-7wI5sM-lSJ11n7FL4b5k',
      authDomain: 'meis-dev.firebaseapp.com',
      databaseURL: 'https://meis-dev-default-rtdb.firebaseio.com',
      projectId: 'meis-dev',
      storageBucket: 'meis-dev.appspot.com',
      messagingSenderId: '581868426889',
      appId: '1:581868426889:web:221da5d0b5547d04b79858',
      measurementId: 'G-KJH0VZ66N1',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
      //  checkPermission();
    } else {
      firebase.app(); // if already initialized, use that one
    }
 
    setTimeout(async () => {
      try {
        const uniqueId = await AsyncStorage.getItem(
          AsyncStorageKey.userUniqueId,
        );
        let tempemail = await AsyncStorage.getItem(AsyncStorageKey.email);
        let tempfirstName = await AsyncStorage.getItem(
          AsyncStorageKey.userName,
        );
        let tempPhone = await AsyncStorage.getItem(AsyncStorageKey.phone);
        let tempimage = await AsyncStorage.getItem(AsyncStorageKey.image);
        let tenantID = await AsyncStorage.getItem(AsyncStorageKey.tenantId)
        //console.log('uniqueid', tenantID);
        setData({
          ...data,
          isLoading: false,
          uniqueId: uniqueId,
          email: tempemail,
          userName: tempfirstName,
          phone: tempPhone,
          profileImage: tempimage,
          tenantID :tenantID
        });


        getMessagelist();
       
        //   if (isFocused) {
        //     getMessagelist()
        // }
      } catch (e) {
        // saving error
      }
    }, 100);
  }, [data.phone]);

  const getMessagelist = (phone) => {
    setMessagelist([]);
    //console.log(route.params.sender, route.params.reciever);
    
    // let dbRef = firebase
    //   .database()
    //   .ref('messages')
    //   .child(data.phone)
    //   .child(route.params.reciever.phone);

    let dbRef = firebase
    .database()
    .ref(data.tenantID)
    .child(route.params.sender)
    .child(route.params.reciever);

     dbRef.on('child_added', (val) => {
      let person = val.val();

      setMessagelist((oldarr) => [...oldarr, person]);
    });
    flatListRef.current.scrollToEnd()
    //console.log('messageList==>>', messageList)
  };
  const handleMessaging = () => {
  
   //console.log(route.params.sender,messages)
    if(data.phone == null || route.params.reciever.phone == null){
     // ShowAlert("Value is null")

    }
    // ShowAlert(
    //   data.phone + 'N' +
    //   route.params.reciever.phone + 
    //   messages,
    // );
    if (messages.length > 0) {
      let msgId = firebase
        .database()
        .ref(data.tenantID)
        .child(route.params.sender)
        .child(route.params.reciever) // child number
        .push().key;

      let updates = {};
      let message = {
        message: messages,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: route.params.sender,
      };
      updates[
        data.tenantID + '/' +
          route.params.sender +
          '/' +
          route.params.reciever +
          '/' +
          msgId
      ] = message;
      updates[
        data.tenantID + '/' +
          route.params.reciever +
          '/' +
          route.params.sender +
          '/' +
          msgId
      ] = message;
      
      firebase.database().ref().update(updates);
      
     // flatListRef.scrollToItem({animated: true,item :message})
      //flatListRef.scrollToIndex({animated: true, index: 9});
      setMessages('');
      //getMessagelist(data.phone)
    }
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then((image) => {
      //console.log(image);
      //UpdateProfileImage(image)
    });
  };

  const renderRow = ({item}) => {
    return (
      <View>
        {item.from === route.params.sender ? (
          <View style={{alignSelf:'flex-end'}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 18,
                textTransform: 'capitalize',
                alignSelf: 'flex-end',
                marginBottom: 5,
              }}>
              {route.params.name}
            </Text>
            <Text
              style={{
                color: colors.BLACK,
                fontSize: 8,
                //marginTop: 12,
                marginStart: 2,
                marginBottom: 5,
                alignSelf:'flex-end'
              }}>
              {convertTime(item.time)}
            </Text>
          </View>
        ) : (
          <View style={{}}>
            {route.params.receiverName == null ? (
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontSize: 18,
                  textTransform: 'capitalize',
                  alignSelf: 'flex-start',
                  marginBottom: 5,
                }}>
                {route.params.receiverName}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontSize: 18,
                  textTransform: 'capitalize',
                  alignSelf: 'flex-start',
                  marginBottom: 5,
                }}>
                {route.params.receiverName}
              </Text>
            )}
            <Text
              style={{
                color: colors.BLACK,
                fontSize: 8,
                marginTop: 0,
                marginStart: 2,
                marginBottom: 5,
              }}>
              {convertTime(item.time)}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            // width: '70%',
            alignSelf: item.from === route.params.sender ? 'flex-end' : 'flex-start',
            backgroundColor: item.from === route.params.sender ? '#e1eafc' : '#e1eafc',
            borderRadius: 10,
            marginBottom: 10,
            padding: 10,
          }}>
          <Text style={{color: colors.BLACK, padding: 7, fontSize: 16}}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };
  const convertTime = (time) => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.toLocaleString();
    }
    let sTime = moment(time).format('DD MMM hh:mm a');
    return sTime;
  };

  let {height, width} = Dimensions.get('window');
  return (
    // <SafeAreaView>
    <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' >
    <View
      style={{
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.WHITE,
        padding: 30,
      }}>
  

      {/** here in this view the right header for chat screen will come. */}
      <View style={{
          padding: 10,
          height: height * 0.6,
          //backgroundColor: colors.BLUE,
        }}>
      <FlatList
      //  inverted
        showsVerticalScrollIndicator={false}
        style={{
          padding: 0,
          //height: height * 0.6,
          backgroundColor: colors.WHITE,
        }}
        data={messageList}
        renderItem={renderRow}
        ref={flatListRef}
        
        onContentSizeChange = {()=> flatListRef.current.scrollToEnd()}
        //  onLayout={() => flatListRef.scrollToOffset({offset: 0,animated: true})}

        keyExtractor={(item, index) => index.toString()}
      />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          bottom: 0,
          padding: 5,
          //position :'absolute'
          //backgroundColor: colors.BLACK,
        }}>
        <TextInput
          multiline={true}
          style={{
            backgroundColor: colors.WHITE,
            marginTop: 10,
            height: 95,
            borderRadius: 10,
            borderWidth: 0.5,
            padding: 10,
            fontSize: 16,
            width: '90%',
            textAlignVertical: 'top',
          }}
          placeholder="Enter your reply"
          value={messages}
          onFocus ={()=> flatListRef.current.scrollToEnd()}
          onChangeText={(value) => {
            setMessages(value);
          }}></TextInput>
        <TouchableOpacity
          onPress={handleMessaging}
          style={{paddingBottom: 10, marginLeft: 5}}>
          <Image
            source={require('../../../assets/images/send-button.png')}
            style={{
              width: 32,
              height: 32,
              marginRight: 5,
              marginLeft: 5,
              tintColor: '#32ccb0',
            }}
          />
        </TouchableOpacity>
      </View>
      {/* <View style={{flexDirection: 'row', marginTop: 20}}>
        <TouchableOpacity style={{}} onPress={openGallery}>
          <Image
            source={require('../../../assets/images/attachment.png')}
            style={{width: 38, height: 38, marginEnd: 10}}></Image>
        </TouchableOpacity>
        <Text style={styles.text1}>Attach audio/video/image file</Text>
      </View> */}
      {messageList.isLoading ? ShowLoader() : null}
      {/* {Platform.OS === "ios"} */}
    </View>
</KeyboardAwareScrollView>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ProfileDetail: {
    padding: 15,
  },
  container: {
   // flex: 1,
    backgroundColor:'#ffffff' ,
    
},
  text1: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 5,
  },
  topView: {
    flexDirection: 'row',
    // paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 24,
  },
  profileImageTop: {
    width: 50,
    height: 50,
    borderRadius: 110 / 2,
    borderColor: 'white',
    borderWidth: 3,
  },
});

export default ChatScreen;
