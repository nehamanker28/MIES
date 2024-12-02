import React, {useEffect, useState} from "react";
import {getApiHelper,getApi,ApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import momentTz from 'moment-timezone'
import {
  Alert
  } from 'react-native';
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



const NotificationTherapistScreen = ({navigation, route}) => {
    
     const isFocused = useIsFocused();
     const [data, setData] = useState({
         notification : [],
         isLoading: false,
         uniqueValue: 1,
         refresh : false,
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
    }, [isFocused,data.refresh])

    const getNotificationList = () => {
        setData({
            ...data,
            isLoading:true,
           // refresh :true,
        })
        var timeZone = momentTz.tz.guess()
        AsyncStorage.getItem(AsyncStorageKey.userID, (err, value) => {
               // //console.log(JSON.parse(value)) // boolean false
            
        getApi(ServiceUrl.base_notification + ServiceUrl.getNotificatioListforThearpist + route.params.userID +'?timeZone='+ timeZone , 'GET')
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    
                    if (!unmounted) {
                     
                        setData({
                            ...data,
                            notification: response.data,
                             //refresh : false,
                             isLoading: false,
                           
                        })
                       console.log('Data ==>',response.data[0].clickable)
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
        // //console.log('Accept',data.isLoading)
        setData({
            ...data,
            isLoading:true,
            refresh :true,
        })
        //console.log('Accept',data.refresh)
        if(item.notificationType == 'Cancel Request By Family' ){
        let dataObj = {'notificationId':item.id, 'sessionId':item.sessionId}
        ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistAcceptSessionCancelRequest + item.sessionId, dataObj, 'PUT') 
        .then(response => {
           
            if (response.code >= 200 && response.code <= 299) {
                setData({
                    ...data,
                    isLoading:false,
                    refresh :false,
                })
                ShowAlert(response.data)
               // getNotificationList()
              
            } else {
                ShowAlert(response.errorMessages[0])
            }
        })
    }
    else if(item.notificationType == 'Request For Change In Therapy Session by Family'){
        let dataObj = {'endDateTime':item.endDateTime, 
        'notificationName':item.notificationType,
        'startDateTime':item.startDateTime}
        ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistAcceptSession + item.sessionId, dataObj, 'PUT') 
        .then(response => {
            // setData({
            //     ...data,
            //     isLoading:false,
            //     refresh :false
            // })
            if (response.code >= 200 && response.code <= 299) {
                //ShowAlert(response.data)
                Alert.alert(
                    "Alert ",
                    response.data,
                    [
                      { text: "OK", onPress: () =>  setData({
                        ...data,
                        isLoading:false,
                        refresh :false
                    })}
                    ]
                  );
                // setData({
                //     ...data,
                //     refresh :false
                // })
            } else {
                setData({
                    ...data,
                    isLoading:false,
                    refresh :false
                })
                ShowAlert(response.message)
            }
        })
    }
    // else if(item.notificationType == 'Request For Change In Therapy Session by Family'){
    //     let dataObj = {
    //      'endDateTime':item.endDateTime,
    //      'notificationName':item.notificationType,
    //      'startDateTime':item.startDateTime}
    //     ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistAcceptSession + item.sessionId, dataObj, 'PUT') 
    //     .then(response => {
    //         setData({
    //             ...data,
    //             isLoading:false,
    //             refresh :false
    //         })
    //         if (response.code >= 200 && response.code <= 299) {
    //             ShowAlert(response.data)
    //         } else {
    //             ShowAlert(response.errorMessages[0])
    //         }
    //         // if (response.code >= 200 && response.code <= 299) {
    //         //     ShowAlert(response.data)
    //         //     setData({
    //         //         ...data,
    //         //         isLoading:false,
    //         //         refresh :false
    //         //     })
    //         // } else {
    //         //     ShowAlert(response.errorMessages[0])
    //         //     setData({
    //         //         ...data,
    //         //         isLoading:false,
    //         //         refresh :false
    //         //     })
    //         // }
    //         // if (response.code >= 200 && response.code <= 299) {
    //         //     ShowAlert(response.data)
                
    //         //     setData({
    //         //         ...data,
    //         //         isLoading:false,
    //         //         refresh :false
    //         //     })
               
    //         // } else {
    //         //     setData({
    //         //         ...data,
    //         //         isLoading:false,
    //         //          refresh :false
    //         //     })
    //         //     ShowAlert(response.errorMessages[0])
    //         // }
    //     })
    // }
    }
    const onPressCancel = (item) => {
        //console.log('cancel')
        setData({
            ...data,
            isLoading:true,
            refresh :true,
        })
        if(item.notificationType == 'Cancel Request By Family'){
            let dataObj = {'notificationId':item.id, 'sessionId':item.sessionId}
            ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistDenySessionCancelRequest + item.sessionId, dataObj, 'PUT') 
            .then(response => {
                setData({
                    ...data,
                    isLoading:false,
                    refresh :false
                })
                if (response.code >= 200 && response.code <= 299) {
                    ShowAlert(response.data)
                } else {
                    ShowAlert(response.errorMessages[0])
                }
            })
        }
        else if(item.notificationType == 'Request For Change In Therapy Session by Family'){
            let dataObj = {'endDateTime':item.endDateTime, 'notificationName':item.notificationType,'startDateTime':item.startDateTime}
            ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.therapistDenySession + item.sessionId, dataObj, 'PUT') 
            .then(response => {
                setData({
                    ...data,
                    isLoading:false,
                    refresh :false
                })
                if (response.code >= 200 && response.code <= 299) {
                    ShowAlert(response.data)
                } else {
                    ShowAlert(response.errorMessages[0])
                }
            })
        }
    }
    const convertTime = (item) => {
        let time
        let sessionEndDate = moment.utc(item).local()
        if (Platform.OS === 'android') {
          time = moment(sessionEndDate).format('DD MMMM YYYY, hh:mm a')
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
    const renderItem = ({ item }) => (
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
             {item.notificationType == 'Request For Change In Therapy Session by Family' || item.notificationType == 'Cancel Request By Family' ?
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
              item.notificationType == 'Cancel Request By Family' || item.notificationType == 'Cancel Request By Interpreter'?
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
 

    return (
        <SafeAreaView style={styles.container}>
      
        <View key={data.uniqueValue} style = {{padding : 20}}>
        {data.notification == null ? <Text> No Notification </Text>:
        <FlatList
                    //horizontal={true}
                    style={styles.FlatListStyle}
                    data={data.notification}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => 'index'+index}
                   

                /> 
      }
        </View>

        {
            data.isLoading ? ShowLoader() : null
         }
        </SafeAreaView>
    );
}
   const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        
    },
    FlatListStyle :{
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
export default NotificationTherapistScreen