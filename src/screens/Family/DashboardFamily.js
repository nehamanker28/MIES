import React, {useEffect, useState, useCallback} from 'react';
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
  RefreshControl
} from 'react-native';
import GreenButton from '../../components/GreenButton';
import colors from '../../Common/Colors';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import style from '../../Common/styles';
import moment from 'moment';
import momentTz from 'moment-timezone'
import {getApiHelper} from '../../Service/Fetch';
import {useIsFocused} from '@react-navigation/native';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import {Image} from 'react-native-elements';
//import PushNotification from 'react-native-push-notification';
import RemotePushController from '../AuthFlow/RemotePushController';
import {Badge, Icon} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import firebase from 'firebase';
import Modal from 'react-native-modal';
import requestCameraAndAudioPermission from '../../components/Permission';
import { calculateDuration, calculateMinsLeft, calculateMinsLeftForEnd } from '../../Common/Utility'
import { da } from 'date-fns/locale';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreAllLogs();

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const QueriesArray = [
  {id: '1', value: 'Johan Golden - Lorem ipssm ioicc nicicie'},
  {id: '2', value: 'Johan Golden - Lorem ipssm ioicc nicicie'},
  {id: '3', value: 'Johan Golden - Lorem ipssm ioicc nicicie'},
];

const DashBoardFamily = ({navigation}) => {
  const [userProfile, setUserProfile] = useState({});
  const [sessions, setSessions] = useState([]);
  const [userUniqueId, setuserUniqueId] = useState('');
  const [badgeValue, setBadgeValue] = useState(0);
  //let unmounted = false;
  const todayDate = new Date();
  const isFocused = useIsFocused();
  var isJoinSession = false
  const [team, setMyTeam] = useState({
    child: []
  });
  const [data, setData] = useState({
    casenotes: []
})
  const [isModalVisible, setModalVisible] = useState(global.isDisclaimerVisible);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    isJoinSession = false
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        //console.log('requested!');
      });
    }
    if (isFocused) {
      callApis()
    }
    setTimeout(async () => {
      try {
        const uniqueId = await AsyncStorage.getItem(
          AsyncStorageKey.userUniqueId,
        );

        setuserUniqueId(uniqueId);
      } catch (e) {
        // saving error
      }
    }, 100);

    return () => {
      // unmounted = true;

      setUserProfile({})
      setSessions([])
      setuserUniqueId(null)
      //setBadgeValue(null)

      setMyTeam({
        child: []
      })

      setData({
        casenotes: []
      })

      setModalVisible(null)
    };
  }, [isFocused]);

  const callApis = () => {
    let dateObj = new Date();
    let dayInt = dateObj.getUTCDate();

    dateObj.setUTCDate(dayInt - 1);
    dateObj.setUTCHours(18);
    dateObj.setUTCMinutes(30);
    dateObj.setUTCSeconds(0);
    getTodaySessions(dateObj);
  }

  const onRefresh = useCallback(() => {
    callApis()

    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));    
}, []);

  const toggleModal = () => {
  
    global.isDisclaimerVisible = false;
    setModalVisible(global.isDisclaimerVisible);
   //  AsyncStorage.setItem(AsyncStorageKey.disclaimer,'false');
  };

  const ItemView = ({item}) => {
    return (
      // FlatList Item
      <View
        style={{
          flexDirection: 'row',
          //alignContent: 'center',
          justifyContent: 'space-between',
          marginTop: 15,
          marginBottom: 15,
        }}>
        {/* <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}}>
          {item.value}
        </Text> */}
        <View>
        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 16 }}>{item.childName}</Text>
        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 14 , marginTop:5}}>{ item.therapy }</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            onPressDetails(item);
          }}>
          <Text
            style={{
              fontFamily: 'Roboto',
              marginStart: 30,
              textDecorationColor: '#000000',
              textDecorationLine: 'underline',
              fontSize: 11,
            }}>
            Details
          </Text>
        </TouchableOpacity>
      </View>
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

  const onPressEdit = (item) => {
    navigation.navigate('EditSession', {session: item});
  };

  const onPressDelete = (item) => {
    //console.log('delete', item);
    navigation.push('CancelSessionFamily', {session: item});
  };

  const onPressDetails = (item) => {
    navigation.push('CaseNotesQueriesFamily', {'session':item})
  };

  const getTodaySessions = (date) => {
    setIsLoading(true)
    var endDay = moment(date).add(1, 'day').subtract(1, 'minutes');
    // let sTime = moment(date)
    //   .utc()
    //   .format('YYYY-MM-DD' + 'T' + 'HH:mm:ss');
    let sTime = moment(Date()).utc().format('YYYY-MM-DD' + 'T' + 'HH:mm:ss');
    let eTime = moment(endDay)
      .utc()
      .format('YYYY-MM-DD' + 'T' + 'HH:mm:ss');
    //'?sessionDate=' + moment(date).format('YYYY-MM-DD')
    var timeZone = momentTz.tz.guess()

    getApiHelper(
      ServiceUrl.base_url_91 +
        ServiceUrl.familySessions +
        '/current-day?startFromDateTime=' +
        sTime +
        '&startToDateTime=' +
        eTime + '&timeZone='+ timeZone + '&sort=startDateTime,ASC',
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Sessions======',response.data.content)
        response.data.content.map((item, index) => {
                        let time = calculateMinsLeft(item.startDateTime)
                        let endTime = calculateMinsLeftForEnd(item.endDateTime)
                        // //console.log('start left--->>', time)
                        // //console.log('end left--->>', endTime)
                        if (time <= 5 && endTime >=2 && item.status != 'COMPLETED' && item.status != 'CANCELLED') {
                            item.isSessionReady = true
                        } else {
                            item.isSessionReady = false
                        }
                        return {...item}
                    })

        setSessions(response.data.content);
      } else {
            if (result.code != 403) {
                ShowAlert(response.message);
            }
      }
      setIsLoading(false)
      getFamilyProfile();
    });
  };

  const getFamilyProfile = () => {
    setIsLoading(true)
    getApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.getFamilyProfile,
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Response', response.data.familyMember);
       // if (!unmounted) {
          setMyTeam({
            ...team,
            child: response.data.familyMembers.slice(0,3),
          });
          //console.log('myteam = ', team.child);
          // let dateObj = todayDate;
          // let dayInt = dateObj.getUTCDate();

          // dateObj.setUTCDate(dayInt - 1);
          // dateObj.setUTCHours(18);
          // dateObj.setUTCMinutes(30);
          // dateObj.setUTCSeconds(0);
          // getTodaySessions(dateObj);

          setUserProfile(response.data.userProfile);
          storeData(response.data.userProfile);
          //storeMyTeamDetails(response.data.familyMembers);
        //}
      } else {
        ShowAlert(response.message);
      }
      setIsLoading(false)
      getCaseNotes();
    });
  };
  const storeMyTeamDetails = (myTeam) => {
    setMyTeam({
      ...team,
      child: myTeam.slice(0,2),
    });
    //console.log('myteam = ', team.child);
  };
  const storeData = async (userProfile) => {
    console.log('family ------>>>', userProfile);
    try {
      await AsyncStorage.setItem(
        AsyncStorageKey.userID,
        userProfile.id.toString(),
      );
      await AsyncStorage.setItem(AsyncStorageKey.userName,(userProfile.firstName+' '+userProfile.lastName));
      await AsyncStorage.setItem(AsyncStorageKey.email, userProfile.email);
      await AsyncStorage.setItem(AsyncStorageKey.phone, userProfile.phone);
      if(userProfile.profilePicUrl != null){
        await AsyncStorage.setItem(AsyncStorageKey.image,userProfile.profilePicUrl);
      }
      if(userProfile.signatureUrl != null){
        await AsyncStorage.setItem(AsyncStorageKey.signature,userProfile.signatureUrl);
      }else {
        await AsyncStorage.setItem(AsyncStorageKey.signature, '');
      }
     
    } catch (e) {
      // saving error
      //console.log('storing error --->>>', e);
    }
  };

  const convertTime = (item) => {
    let sessionStartDate = moment.utc(item.startDateTime).local();
    let sessionEndDate = moment.utc(item.endDateTime).local();
    let sTime = moment(sessionStartDate).format('hh:mm a');
    let eTime = moment(sessionEndDate).format('hh:mm a');

    return sTime + ' - ' + eTime;
  };

  const calculateDuration = (item) => {
    let sessionStartDate = new Date(item.startDateTime);
    let sessionEndTime = new Date(item.endDateTime);
    let day = moment(sessionEndTime).diff(moment(sessionStartDate), 'days');
    let hour = moment(sessionEndTime).diff(moment(sessionStartDate), 'hours');
    let minutes = moment(sessionEndTime).diff(
      moment(sessionStartDate),
      'minutes',
    );

    let ms = moment(sessionEndTime).diff(moment(sessionStartDate))
    var d = moment.duration(ms);
    ////console.log(d.days() + ':' + d.hours() + ':' + d.minutes() + ':' + d.seconds());
    var returnText = ''

    if (hour < 1) {
        returnText = minutes + ' min'
    } else {
        if (d.minutes() == 0) {
            returnText = d.hours() + ' hr'
        } else {
            returnText = d.hours() + ' hr ' + d.minutes() + ' min'
        }
    }

    return returnText;
  };

  messaging().onMessage(async (remoteMessage) => {
    //console.log('new message', remoteMessage);
    //displayNotification(remoteMessage)
    // ShowAlert("New Request")
    setBadgeValue(badgeValue + 1);
  });
  const onPressNotify = (item) => {
    //console.log('item ---->');
    navigation.navigate('NotificationFamilyScreen', {userID: userUniqueId});
    setBadgeValue(0);
  };
  +messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      //console.log(remoteMessage)
      //remoteMessage.data
      if (remoteMessage) {
        const uniqueId = await AsyncStorage.getItem( AsyncStorageKey.userUniqueId);
        console.log(uniqueId)
        navigation.navigate('NotificationFamilyScreen', {userID: userUniqueId});
        // console.log(
        //   'getInitialNotification:' +
        //     'Notification caused app to open from quit state',
        // );
        //console.log(remoteMessage);
      }
    });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
  
    if (remoteMessage) {
      const uniqueId = await AsyncStorage.getItem( AsyncStorageKey.userUniqueId);
      console.log(uniqueId)
    
      navigation.navigate('NotificationFamilyScreen', {userID: uniqueId});
      // console.log(
      //   'onNotificationOpenedApp: ' +
      //     'Notification caused app to open from background state',
      // );
      //console.log(remoteMessage);
      // alert(

      //   'onNotificationOpenedApp: Notification caused app to' +
      //   ' open from background state',
      // );
    }
  });
  const displayNotification = (notification) => {
    //console.log('remotehjbscbsjkcnbsk',notification)
    if (Platform.OS === 'android') {
           if (Platform.Version >= 21) {
              const localNotification = new     firebase.notifications.Notification({
                    show_in_foreground: true,
              })
              .setBody(notification.title)
 .android.setPriority(firebase.notifications.Android.Priority.High);
            // Create push notification
            firebase.notifications()
                    .displayNotification(localNotification)
                    .catch(err => console.error(err));
         } else {
      // Same code as above just in small icon use any color icon     instead of white for version > 21
         }
   } else {
     // Same code as version <21 code block 
   }
  }
  const joinSession = (item) => {
    if(isJoinSession == false){
        isJoinSession = true
        navigation.push('VideoCall',{'sessionId':item.id,'startTime':item.startDateTime, 'endTime':item.endDateTime, 'item':item})
    }
}
  const onShowDetail = (item) => {
    //console.log('item ---->>>', item);
    navigation.push('SessionDetailFamily', {session: item});
    //Session Details
  };
  const getCaseNotes = () => {
    ////console.log('get Session by date --------->>>>',date)

   setIsLoading(true)

    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getCaseNotes + '?queries=true&sort=startDateTime,DESC', 'GET')
    .then(response => {
        if (response.code >= 200 && response.code <= 299) {

                setData({
                    ...data,
                    casenotes: response.data.content.slice(0,3) 
                })
                //console.log('casenotes------>',response.data.content)
            } else {
                ShowAlert(response.message)
            }
            setIsLoading(false)
        })
}
  const renderItemTeam = ({item}) => {
    let familyMemberTh = [];
    if (item.familyMemberTherapies) {
      //console.log(item.familyMemberTherapies.length)
      familyMemberTh = item.familyMemberTherapies.map((row, index) => {
        //console.log(row.therapist)
        return (
          <View style={{flexDirection: 'row', margin: 10}}>
          
            {/* <Image
              source={{uri: row.therapist.userProfile.profilePicUrl}}
              style={styles.profileImageTop}></Image> */}
            {row.therapist.userProfile.profilePicUrl ?
            <Image
              source={{uri: row.therapist.userProfile.profilePicUrl}}
              style={styles.profileImageTop}
            />
            :
           <Image source={require('../../../assets/images/defaultprofile.png')} 
           style = {styles.profileImageTop}></Image>
            }
            <View style={{marginLeft: 10}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>
                {row.therapist.userProfile.firstName}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: 'Roboto-Regular',
                  fontSize: 12,
                  color: 'gray',
                }}>
                {row.therapy.description}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: 'Roboto-Regular',
                  fontSize: 12,
                  color: 'gray',
                }}>
                {row.therapist.userProfile.email}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: 'Roboto-Regular',
                  fontSize: 13,
                  color: 'gray',
                }}>
                {row.therapist.userProfile.phone}
              </Text>
            </View>
          </View>
        );
      });
    }
    return (
      <View>
        {/* {item.interpreter == null ? <View></View> :
        <View style={{flexDirection: 'row', margin: 10}}>
          <Image
            source={{uri: item.interpreter.userProfile.profilePicUrl}}
            style={styles.profileImageTop}></Image>

          <View style={{marginLeft: 10}}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>
              {item.interpreter.userProfile.firstName}
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontFamily: 'Roboto-Regular',
                fontSize: 12,
                color: 'gray',
              }}>
              {item.interpreter.userProfile.email}
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontFamily: 'Roboto-Regular',
                fontSize: 13,
                color: 'gray',
              }}>
              {item.interpreter.userProfile.phone}
            </Text>
          </View> 
         </View>
         } */}
        {familyMemberTh}
      </View>
    );
    //   <View>

    //   </View>
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.ListViewContainer}
      onPress={() => {
        onShowDetail(item);
      }}>
      <View
        style={{
          backgroundColor: '#387af6',
          borderRadius: 15,
          borderWidth: 1,
          borderTopColor: '#C0C0C0',
          borderBottomColor: '#D3D3D3',
          borderLeftColor: '#C0C0C0',
          borderRightColor: '#C0C0C0',
          paddingHorizontal: 10,
          paddingVertical: 12,
          width:300,
          flex:1
        
        }}>
        <View>
          <View style={{flexDirection: 'row', marginBottom: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flex: 1,
                marginRight:5 ,
              }}>
              <Image
                source={{uri: item.familyMember.profileUrl}}
                style={styles.profileImage}></Image>
              <Text
                style={{
                  flex:1,
                  fontFamily: 'Roboto-Medium',
                  fontSize: 18,
                  color: 'white',
                  marginLeft: 10,
                           //marginTop: 4 ,
                  width:100,
                  textTransform: 'capitalize',
                }}
                numberOfLines={2}>
                {item.familyMember.firstName} {item.familyMember.lastName}
              </Text>
            </View>
            {
              (item.status === 'COMPLETED') || (item.status === 'CANCELLED') || (item.status === 'NOT_COMPLETED') ? (
              null
            ) : (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    onPressEdit(item);
                  }}>
                  <Image
                    source={require('../../../assets/images/edit.png')}
                    style={styles.iconStyle}></Image>
                </TouchableOpacity>
                <View
                  style={{
                    height: 27,
                    width: 1,
                    backgroundColor: 'white',
                    marginTop: -2,
                  }}></View>
                <TouchableOpacity
                  onPress={() => {
                    onPressDelete(item);
                  }}>
                  <Image
                    source={require('../../../assets/images/cancel.png')}
                    style={styles.iconStyle}></Image>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 14,
            }}>
            <Text style={styles.bodyTextStyle} numberOfLines={2}>{item.therapy.name}</Text>
           
          </View>

          <View style={{flexDirection: 'row', paddingStart: 0, marginTop: 20}}>
            <View
              style={{
                flex: 2,
  
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../assets/images/clock.png')}
                  style={styles.iconStyle1}></Image>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 11,
                    marginLeft: 5,
                    color: 'white',
                  }}>
                  {convertTime(item)}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5 }}>
                <Image
                  source={require('../../../assets/images/duration_blue.png')}
                  style={styles.iconStyle1}></Image>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 11,
                    marginLeft: 5,
                    color: 'white',
                  }}>
                  {calculateDuration(item)}
                </Text>
              </View>
            </View>
            {
                        (item.isSessionReady) ?
                            <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#0fd683', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7, borderColor: '#0fd683', borderWidth: 1 }} onPress={() => {
                                joinSession(item)
                            }}>
                                <Text style={{ paddingLeft: 5, color: 'black', fontSize: 11, fontFamily: 'Roboto-Regular' }}>Join Now</Text>
                            </TouchableOpacity>
                            :
                            (item.status === 'PENDING') ?

                                <View style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#FFCECC', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7 }}>
                                    <Image source={require('../../../assets/images/pending.png')} style={{
                                        width: 11, height: 11, resizeMode: 'contain'
                                    }}></Image>
                                    <Text style={{ paddingLeft: 5, color: 'white', fontSize: 11 }}>{item.status}</Text>
                                </View>
                                :
                                (item.status === 'UP_COMING') ?

                                    // <TouchableOpacity style={{flex:0.7, flexDirection: 'row',backgroundColor: 'white', alignItems: 'center', borderRadius: 7,justifyContent:'center',padding :5,paddingHorizontal :7, borderColor:'black', borderWidth:1}} onPress={() => {
                                    //     joinSession(item)
                                    // }}>
                                    //     <Text style={{paddingLeft: 5, color: 'black', fontSize: 11, fontFamily:'Roboto-Regular' }}>Join Now</Text>
                                    // </TouchableOpacity>
                                    <View style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#E2F6E9', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7 }}>
                                        <Image source={require('../../../assets/images/tick_black.png')} style={{
                                            width: 11, height: 11, resizeMode: 'contain'
                                        }}></Image>
                                        <Text style={{ paddingLeft: 5, color: 'black', fontSize: 11 }}>Upcoming</Text>
                                    </View>
                                    :
                                    (item.status === 'IN_PROGRESS') ?

                                        <View style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#FFCECC', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7 }}>
                                            <Image source={require('../../../assets/images/pending.png')} style={{
                                                width: 11, height: 11, resizeMode: 'contain'
                                            }}></Image>
                                            <Text style={{ paddingLeft: 5, color: 'black', fontSize: 11 }}>In Progress</Text>
                                        </View>
                                        :
                                        (item.status === 'NOT_COMPLETED') ?
                                            <View style={{ flex: 0.8, flexDirection: 'row', backgroundColor: '#FFCECC', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 4 }}>
                                                <Image source={require('../../../assets/images/pending.png')} style={{
                                                    width: 11, height: 11, resizeMode: 'contain'
                                                }}></Image>
                                                <Text style={{ paddingLeft: 5, color: 'black', fontSize: 10 }}>Not Completed</Text>
                                            </View>
                                            :
                                            (item.status === 'COMPLETED') ?

                                                <View style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#387af6', 
                                                alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7 
                                                ,borderColor:'white',borderWidth:1}}>
                                                    <Image source={require('../../../assets/images/approve.png')} style={{
                                                        width: 11, height: 11, resizeMode: 'contain'
                                                    }}></Image>
                                                    <Text style={{ paddingLeft: 5, color: 'white', fontSize: 11 }}>Completed</Text>
                                                </View>
                                                :
                                                (item.status === 'MISSED') ?
                                                    <View style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#F5F59B', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7 }}>
                                                        <Image source={require('../../../assets/images/missed.png')} style={{
                                                            width: 11, height: 11, resizeMode: 'contain'
                                                        }}></Image>
                                                        <Text style={{ paddingLeft: 5, color: 'black', fontSize: 11 }}>Missed</Text>
                                                    </View>
                                                    :
                                                    (item.status === 'CANCELLED') ?
                                                        <View style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#D93025', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7 }}>
                                                            <Image source={require('../../../assets/images/cancel.png')} style={{
                                                                width: 11, height: 11, resizeMode: 'contain'
                                                            }}></Image>
                                                            <Text style={{ paddingLeft: 5, color: 'black', fontSize: 11 }}>Cancelled</Text>
                                                        </View>
                                                        :
                                                        <View></View>
                    }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
     
      <ScrollView
      showsVerticalScrollIndicator = {false}
      //nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollViewStyle}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
        >
        <View style={styles.topView}>
          <View style={{flexDirection: 'row', flex: 1}}>
          {userProfile.profilePicUrl ?
            <Image
              source={{uri: userProfile.profilePicUrl}}
              style={styles.profileImageTop}
            />
            :
           <Image source={require('../../../assets/images/defaultprofile.png')} 
           style = {styles.profileImageTop}></Image>
            }
            <View style={styles.ProfileDetail}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 18,
                  textTransform: 'capitalize',
                }}
                numberOfLines = {3} >
                {userProfile.firstName} {userProfile.lastName}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 14,
                  color: colors.LIGHT_GRAY,
                  marginTop: 4,
                }}>
                {moment(todayDate).format('dddd DD MMMM, YYYY')}
              </Text>
            </View>
          </View>
          <View>
          <TouchableOpacity 
            onPress={() => {
              onPressNotify();
            }}>
            <Image
              source={require('../../../assets/images/notificationBell.png')}
              style={{width: 22, height: 22, resizeMode: 'contain'}}></Image>
            <Badge
              value={badgeValue}
              status="error"
              containerStyle={styles.badgeStyle}
            />

            {/* <Icon type="ionicon" name="notifications-outline" size={50} color="blue" /> */}
          </TouchableOpacity>
          </View>
        </View>

        <View style={styles.SectionHeaderStyle}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 18}}>
              {' '}
              Today's Therapy
            </Text>
          </View>

          <TouchableOpacity onPress={() => navigation.jumpTo('Session')}>
            <Text style={styles.ViewAll}>View All </Text>
          </TouchableOpacity>
        </View>

        {sessions.length == 0 ? (
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: 'Roboto-Regular', fontSize: 20}}>
              No Sessions Today
            </Text>
          </View>
        ) : (
          <FlatList
            horizontal={true}
            style={styles.FlatListStyle}
            data={sessions}
            renderItem={renderItem}
            keyExtractor={(item, index) => item + index}
          />
        )}

        <View style={styles.SectionHeaderStyle}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 18}}>
              Recent Queries
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('CaseNote',{queries : true})}>
            <Text style={styles.ViewAll}>View All </Text>
          </TouchableOpacity>
        </View>

        <View>
        {data.casenotes.length == 0 ?
                    <View style={{height:50, justifyContent:'center', alignItems:'center'}}><Text style={{fontFamily: 'Roboto-Regular', fontSize: 20}}>No Recent Queries</Text></View> 
                    :
                <FlatList  
                    data={data.casenotes}
                    renderItem={ItemView}
                    ItemSeparatorComponent={ItemSeparatorView}
                    keyExtractor={(item, index) => item + index}
                />
            }
        </View>

        <View style={styles.SectionHeaderStyle}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 18}}>
              My Team
            </Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('MyTeam')}>
            <Text style={styles.ViewAll}>View All </Text>
          </TouchableOpacity>
        </View>

        <View style = {{}}>
          <FlatList
            nestedScrollEnabled = {true}
            //horizontal={true}
            style={styles.FlatListStyle}
            data={team.child}
            
            renderItem={renderItemTeam}
            scrollEnabled={true}
            // contentContainerStyle = {
            //  {height: 230}
            // }
            //initialNumToRender = {2}
            keyExtractor={(item, index) => item + index}
          />
     </View>
       
        {/* <RemotePushController /> */}
      </ScrollView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.box2}>
        <View
          style={{
            backgroundColor: '#eaf1fe',
            height: 58,
            justifyContent: 'center',
            borderTopEndRadius: 20,
            borderTopLeftRadius: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Roboto',
              fontSize: 18,
              textAlign: 'center',
              color: colors.BLACK,
            }}>
            Disclaimer
          </Text>
        </View>
        <View style={{flex: 1, padding: 20}}>
          <ScrollView style={{flex: 2, padding: 0}}>
            <Text>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt Lorem ipsum dolor sit amet,
              consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut Lorem ipsum dolor sit amet, consetetur sadipscing
              elitr, sed diam nonumy eirmod tempor invidunt Lorem ipsum dolor
              sit amet,mod tempor invidunt ut Lorem ipsum dolor sit amet,
              consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
              sed diam nonumy eirmod tempor invidunt ut Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
              sed diam nonumy eirmod tempor invidunt ut
            </Text>
          </ScrollView>

          <View style={{height: 38, marginTop: 10,marginBottom:20}}>
            <GreenButton text="Accept" onMethod={() => toggleModal()} />
          </View>
          
        </View>
      </Modal>
      {
        isLoading ? ShowLoader() : null
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  
  scrollViewStyle: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
  },
  box2: {
    opacity: 0.9,
    marginVertical: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 30,
    //marginBottom:40,
    //right:90
  },
  line: {
    width: 1,
    height: 100,
    backgroundColor: '#707070',
  },
  topView: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
   // alignContent: 'center',
    //flex:1,
  },
  ProfileDetail: {
    padding: 15,
    flex:1,
  },
  ViewAll: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#387af6',
    textDecorationColor: '#387af6',
    textDecorationLine: 'underline',
    //justifyContent : 'flex-end'
  },
  SectionHeaderStyle: {
    marginTop: 30,
    flexDirection: 'row',
    marginBottom: 20,
    flex: 1,
  },

  FlatListStyle: {
    backgroundColor: 'white',
    
    //height:150,
    },

  ListViewContainer: {
    borderRadius: 15,
   // height: 135,
    backgroundColor: '#D3D3D3',
    marginVertical: 10,
    marginHorizontal:20,
    marginRight: 5,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 60,
  },
  iconStyle: {
    width: 15,
    height: 16,
    resizeMode: 'contain',
    marginHorizontal: 12,
  },
  iconStyle1: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor:'white',
  },
  badgeStyle: {
    position: 'absolute',
    marginTop: -15,
    // marginStart:5,
    marginStart: 2,
    padding: 2,
  },
  bodyTextStyle: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: 'white',
    // marginTop:20
  },
  MyTeamView: {
   // flexDirection: 'row',
   // alignItems: 'center',
   // height: 150,
    // marginVertical :10,
    // marginBottom:30,
    //justifyContent : 'space-around'
  },
  profileImageTop: {
    width: 80,
    height: 80,
    borderRadius: 110 / 2,
    borderColor: colors.LIGHT_GRAY,
    borderWidth: 3,
  },
});

export default DashBoardFamily;
