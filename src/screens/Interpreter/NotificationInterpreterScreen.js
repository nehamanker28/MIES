import React, {useEffect, useState} from "react";
import {getApi,ApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

//Import all required component
import {
    StyleSheet,
    View,
    Text,

    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import colors from "../../Common/Colors";
import { useIsFocused } from "@react-navigation/native";
import {ShowAlert, ShowLoader} from '../../Common/Helper'
import { da } from "date-fns/locale";
import { Image } from 'react-native-elements'
const QueriesArray = [
    {id: '1',name : 'Today', header : true},
    {id: '2',name :'Jhon Doe',value :'4 Pm - 5 Pm',image :require('../../../assets/images/sampleProfilePic.png'),header :false },
    {id: '3',name :'Jhon Doe',value :'4 Pm - 5 Pm',image :require('../../../assets/images/sampleProfilePic.png' ),header :false },
    {id: '4',name :'Jhon Doe',value :'4 Pm - 5 Pm',image :require('../../../assets/images/sampleProfilePic.png' ),header :false },
    {id: '1',name : 'Yesterday', header : true},
    {id: '2',name :'Jhon Doe',value :'4 Pm - 5 Pm',image :require('../../../assets/images/sampleProfilePic.png'),header :false },
    {id: '3',name :'Jhon Doe',value :'4 Pm - 5 Pm',image :require('../../../assets/images/sampleProfilePic.png' ),header :false },
    {id: '4',name :'Jhon Doe',value :'4 Pm - 5 Pm',image :require('../../../assets/images/sampleProfilePic.png' ),header :false },
  
];


const NotificationInterpreterScreen = ({navigation, route}) => {
    
    const isFocused = useIsFocused();
    const [data, setData] = useState({
        notification : [],
        isLoading: false
   })
   let unmounted = false;
   const ItemSeparatorView = (item) => {
       return (
        // FlatList Item Separator
           item.header ? <View>

           </View> :
       <View
         style={{
             height: 2,
             margin :10,
             backgroundColor: '#d8e4f1'
         }}
       />
       );
       };
   useEffect(() => {
       getNotificationList()
       return () => {
           unmounted = true
       }
   }, [])

   const getNotificationList = async() => {
       setData({
           ...data,
           isLoading:true
       })
       AsyncStorage.getItem(AsyncStorageKey.userID, (err, value) => {
               //console.log(JSON.parse(value)) // boolean false
           
       getApi(ServiceUrl.base_notification + ServiceUrl.getNotificatioListforInterpreter + route.params.userID, 'GET')
           .then(response => {
               if (response.code >= 200 && response.code <= 299) {
                   
                   if (!unmounted) {
                    
                       setData({
                           ...data,
                           notification: response.data,
                           isLoading: false,
                       })
                       //console.log('Data ==>',data.notification)
                       // setUserProfile(response.data.userProfile)
                       //storeData(response.data.userProfile)
                   }
               } else {
                   ShowAlert(response.error)
               }
           })
       })
   }

   const onPressAccept = (item) => {
       //console.log('Accept',item)
       if(item.notificationType == 'Cancel Request By Family'){
       let dataObj = {'notificationId':item.id, 'sessionId':item.sessionId}
       ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistAcceptSessionCancelRequest + item.sessionId, dataObj, 'PUT') 
       .then(response => {
           setData({
               ...data,
               isLoading:false
           })
           if (response.code >= 200 && response.code <= 299) {
               ShowAlert(response.body)
           } else {
               ShowAlert(response.body)
           }
       })
   }
   else if(item.notificationType == 'Request For Change In Therapy Session by Family'){
       let dataObj = {'endDateTime':item.endDateTime, 'notificationName':item.notificationType,'startDateTime':item.startDateTime}
       ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistAcceptSession + item.sessionId, dataObj, 'PUT') 
       .then(response => {
           setData({
               ...data,
               isLoading:false
           })
           if (response.code >= 200 && response.code <= 299) {
               ShowAlert(response.body)
           } else {
               ShowAlert(response.body)
           }
       })
   }
   }
   const onPressCancel = (item) => {
       //console.log('cancel')
       if(item.notificationType == 'Cancel Request By Family'){
           let dataObj = {'notificationId':item.id, 'sessionId':item.sessionId}
           ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistDenySessionCancelRequest + item.sessionId, dataObj, 'PUT') 
           .then(response => {
               setData({
                   ...data,
                   isLoading:false
               })
               if (response.code >= 200 && response.code <= 299) {
                   ShowAlert(response.body)
               } else {
                   ShowAlert(response.body)
               }
           })
       }
       else if(item.notificationType == 'Request For Change In Therapy Session by Family'){
           let dataObj = {'endDateTime':item.endDateTime, 'notificationName':item.notificationType,'startDateTime':item.startDateTime}
           ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistDenySession + item.sessionId, dataObj, 'PUT') 
           .then(response => {
               setData({
                   ...data,
                   isLoading:false
               })
               if (response.code >= 200 && response.code <= 299) {
                   ShowAlert(response.body)
               } else {
                   ShowAlert(response.body)
               }
           })
       }
   }
   const convertTime = (item) => {
    let time
    // let sessionStartDate = moment.utc(item);
    // let sTime = moment(sessionStartDate).format('DD MMMM YYYY , hh:mm a');
    // return sTime;
    let sessionEndDate = moment.utc(item).local()
    if (Platform.OS === 'android') {
      time = moment(sessionEndDate).format('DD MMMM YYYY , hh:mm a')
  } else {
      if (Platform.Version <= 14) {
          time = moment(sessionEndDate).format('DD MMMM YYYY , hh:mm a')
      } else {
          time = moment(sessionEndDate).format('DD MMMM YYYY , hh:mm a')
      }
  }
  return time
  };
  const convertTime1 = (item) => {
    let time
    let sessionEndDate = moment.utc(item).local()
    if (Platform.OS === 'android') {
      time = moment(sessionEndDate).format('hh:mm a')
  } else {
      if (Platform.Version <= 14) {
          time = moment(sessionEndDate).format('hh:mm a')
      } else {
          time = moment(sessionEndDate).format('hh:mm a')
      }
  }
    return time
  };
  const renderItem1 = ({ item }) => (
    //  item.header ? <Text style = {{ fontFamily :'Roboto',fontSize : 18,color : '#414141',padding :20}}>{item.name}</Text> :
     <View>
     <Text style = {{fontFamily :'Roboto-Medium',fontSize : 14,color : colors.BLACK}}> {convertTime(item.notificationDateTime)} </Text>
        <View style = {{flexDirection : 'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
        <View style = {{flex:0.5}}>
            <Image
          source={{uri: item.icon}}
          style={{width: 50, height: 50, borderRadius: 40}}></Image>  
          </View>
            <View style = {{paddingHorizontal:0,flex:2,padding:10}}>
            {/* <Text style = {styles.text2}>{item.notificationType}</Text> */}
             {item.notificationType == 'Accepted Session Change Request By Therapist' ?
             <View>
             <Text style = {styles.text2}>{item.name} {item.body}</Text>
             <View style = {{flexDirection : 'row',flex :1,marginTop:10}}>
            
             <Text style = {styles.text2}>Time:</Text>
             <Text style = {styles.text3} numberOfLines = {2}> {convertTime(item.startDateTime)}-{convertTime1(item.endDateTime)}</Text>
             </View>
       
             </View>:
             <View style = {{flex :1}}>
             <Text style = {styles.text2}>{item.body}</Text>
             {/* <View style = {{flexDirection : 'row',flex :1}}>
             <Text style = {styles.text2}>Time :</Text>
             <Text style = {styles.text3}>{convertTime(item)}</Text>
             </View> */}
             </View>
             
             }
            
             {
              item.notificationType == 'Cancel Request By Family'?
             <View style = {{flexDirection:'row'}}>
               <Text style = {styles.text2}>Reason :</Text>
               <Text style = {styles.text3}> {item.reason}</Text>
               </View>
               :
               item.notificationType == 'Session create request by Family' ?
               <View style = {{flexDirection:'row'}}>
               <Text style = {styles.text2}>Request Note:</Text>
               <Text style = {styles.text3}> {item.reason}</Text>
               </View> :
               null
               
             }
             {/* //<Text style = {styles.text3}>{item.title}</Text> */}
             
             {/* <View style = {{flexDirection : 'row',flex :1}}>
             <Text style = {styles.text2}>Time :</Text>
             <Text style = {styles.text3}>{convertTime(item)}</Text>
             </View> */}
              { item.clickable ?
               <View>
              
                <View style = {{flexDirection : 'row',marginTop :10,flex : 1}}>
               
                <TouchableOpacity style = {styles.AcceptButton}
                onPress = {() =>  onPressAccept(item)}>
                <Text style = {{color :'#191919',fontSize :16,fontFamily : 'Roboto-Bold',margin :10}}>Accept</Text>      
                </TouchableOpacity>
                <TouchableOpacity style = {styles.closeButton}
                onPress = {() =>  onPressCancel(item)}>
                <Image source = {require('../../../assets/images/close.png' )} style = {{width :10 , height :10}}/>
                </TouchableOpacity>
                </View>
                </View>
                :
                <View>
              
                </View>
                }
            </View>
            </View>
            {/* <Text style = {{textAlign:'right'}}>{moment(item.notificationDateTime).format('dddd , DD MMMM YYYY , hh:mm a')} </Text> */}
            <View style = {{ height: 2,backgroundColor: '#d8e4f1',marginTop :30,marginBottom :30}}>

        </View>

                


    </View>
        
     
    );
   const renderItem = ({ item }) => (
   //  item.header ? <Text style = {{ fontFamily :'Roboto',fontSize : 18,color : '#414141',padding :20}}>{item.name}</Text> :
   <View>
   <Text
     style={{
       fontFamily: 'Roboto-Medium',
       fontSize: 14,
       color: colors.BLACK,
       //marginBottom:10,

       justifyContent:'center',alignItems:'center'
     }}>
      {convertTime(item.notificationDateTime)}
   </Text>

   <View style = {{flexDirection : 'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>

     <View style = {{flex:0.5}}>
            <Image
          source={{uri: item.icon}}
          style={{width: 50, height: 50, borderRadius: 40}}></Image>  
          </View>

     <View style={{paddingHorizontal:0,flex:2}}>
       {item.notificationType == 'Therapy Session for family' ? (
         <View>
           <Text style={styles.text2}>
             {item.name} {item.body}
           </Text>
         </View>
       ) : (
         <View>
           <Text style={styles.text2}>{item.body}</Text>
           <View style={{flexDirection: 'row', flex: 1}}></View>
         </View>
       )}

       {item.clickable ? (
         <View style={{flexDirection: 'row', marginTop: 10, flex: 1}}>
           <TouchableOpacity
             style={styles.AcceptButton}
             onPress={() => onPressAccept(item)}>
             <Text
               style={{
                 color: '#191919',
                 fontSize: 16,
                 fontFamily: 'Roboto-Bold',
                 margin: 10,
               }}>
               Accept
             </Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={styles.closeButton}
             onPress={() => onPressCancel(item)}>
             <Image
               source={require('../../../assets/images/close.png')}
               style={{width: 10, height: 10}}
             />
           </TouchableOpacity>
         </View>
       ) : (
         <View></View>
       )}
     </View>
   </View>
   <View
     style={{
       height: 2,
       backgroundColor: '#d8e4f1',
       marginTop: 30,
       marginBottom: 30,
     }}></View>
 </View>
    
   );


   return (
    <SafeAreaView style={styles.container}>
      
        <View style={{padding: 20}}>
          {data.notification == null ? (
            <Text> No Notification </Text>
          ) : (
            <FlatList
              //horizontal={true}
              style={styles.FlatListStyle}
              data={data.notification}
              renderItem={renderItem1}
              keyExtractor={(item, index) => 'index' + index}
            />
          )}
        </View>
        {data.isLoading ? ShowLoader() : null}
    
    </SafeAreaView>
  );
}
  const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: 'white',
       
   },
  
   text1 :{
    fontFamily :'Roboto',
    fontSize : 14,
    color : colors.BLACK,
   // margin :10,
},
text2 :{
    fontFamily :'Roboto-Medium',
    fontSize : 14,
    color : colors.BLACK,
    //margin :10,
    
   // paddingHorizontal:15
 
},
text3 :{
    fontFamily :'Roboto',
    fontSize : 14,
    color : colors.BLACK,
    flex:1,
    //marginTop :5,
    //padding :5,
   
},
   closeButton : {
       backgroundColor : '#000000',
       borderRadius :20 ,
       borderColor : '#e2e2e2',
       alignItems :'center',
       padding :15,
       justifyContent :'center',
       marginStart :20,
   },
   AcceptButton :{
       backgroundColor : '#ffd629',
       borderRadius :6 ,
       borderColor : '#e2e2e2',
       paddingHorizontal :10,
       alignItems :'center',
       justifyContent:'center'
   }
  
})
export default NotificationInterpreterScreen