import React, {useState ,useEffect } from 'react'
//import PushNotification from 'react-native-push-notification'
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
 import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AsyncStorageKey } from '../../Common/String';
import { Alert } from 'react-native';
import { ShowAlert, ShowLoader } from '../../Common/Helper';
const RemotePushController = () => {
  const [topic,setTopic] = useState('')
  let unmounted = false;
  useEffect(() => {
    
   
    // messaging().onMessage(async remoteMessage => {
    //   //console.log("new message" , remoteMessage);
    //   ShowAlert("New Request")
   
    // })

    messaging().getToken().then((fcmToken) => {
          ////console.log('FCM Token -> ', fcmToken);
         
        });
    

    // messaging().getInitialNotification().then(async (remoteMessage) => {
    //       if (remoteMessage) {
    //         //console.log(
    //           'getInitialNotification:' +
    //             'Notification caused app to open from quit state',
    //         );
    //         //console.log(remoteMessage);
    //       }
    //     });
        
    // messaging().onNotificationOpenedApp(async (remoteMessage) => {
    //       if (remoteMessage) {
    //         //console.log(
    //           'onNotificationOpenedApp: ' +
    //             'Notification caused app to open from background state',
    //         );
    //         //console.log(remoteMessage);
    //         // alert(
    //         //   'onNotificationOpenedApp: Notification caused app to' +
    //         //   ' open from background state',
    //         // );
    //       }
    //     });
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        //console.log('TOKEN:', token)
      },
// (required) Called when a remote or local notification is opened or received
     onNotification: function(notification) {
        //console.log('REMOTE NOTIFICATION ==>', notification)
// process the notification here
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      onError: err => {
        //console.log('Error configuring notifications', err)
      },
      // Android only: GCM or FCM Sender ID
      senderID: '581868426889',
      popInitialNotification: true,
      requestPermissions: true
    })
    return () => {
      unmounted = true
  }
}, [])


  return(null)
}


export default RemotePushController
