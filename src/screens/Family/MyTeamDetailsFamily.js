import React, {useState, useEffect} from 'react';

//Import all required component
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Button,
  Platform,TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import colors from '../../Common/Colors';
import {getApiHelper,ApiHelper,FormApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey, AlertMessage} from '../../Common/String';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import {Image} from 'react-native-elements';

//import styles from '../../Common/styles';
import GreenButton from '../../components/GreenButton';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import {useIsFocused} from '@react-navigation/native';
import { ro } from 'date-fns/locale';
import moment from 'moment';
import momentTz from 'moment-timezone';
import TimePicker from '../../components/TimePicker'
import DatePicker from '../../components/DatePicker'

const MyTeamDetailsFamily = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSessionModalVisible, setSessionModalVisible] = useState(false);
  const [reason,setReason] = useState('')
  const [therapyId,SetTherapyId] = useState(0)

    const todayDate = new Date()
    const [selectedDate, setSelectedDate] = useState(todayDate)
    const [fromTime, setFromTime] = useState(selectedDate)
    const [toTime, setToTime] = useState(selectedDate)
    const [fromAmStyle, setFromAmStyle] = useState(styles.noonStyle)
    const [toPmStyle, SetToPmStyle] = useState(styles.noonStyle)
    const [fromRightAmStyle, setFromRightAmStyle] = useState(styles.noonStyle)
    const [toRightPmStyle, SetToRightPmStyle] = useState(styles.noonStyle)
    const [isLeftDatePickerVisible, setIsLeftDatePickerVisible] = useState(false);
    const [isRightDatePickerVisible, setIsRightDatePickerVisible] = useState(false);
    const [isLeftPicker, setIsLeftPicker] = useState(true)
    const [isDatePicker, setIsDatePicker] = useState(false)
    const [familyUserProfileID, setfamilyUserProfileID] = useState(0)
    const [services,setServices] = useState([])
    const [notes, setNotes] = useState('');

 const [data, setData] = useState({
     isLoading : false,
 })
  const isFocused = useIsFocused();
 // let unmounted = false;

  useEffect(() => {
    // getFamilyProfile()
   // console.log('TEAM ======>',route.params.services)
  
    if (isFocused) {
      services.length = 0
    //   route.params.services?.map((item, index) => {
        services?.push({
            label :route.params.services.name ,
            value  :route.params.services.id,
            })
    // })

      if (fromTime.getHours() <= 11) {
        setFromAmStyle(styles.selectedNoonStyle)
        SetToPmStyle(styles.noonStyle)
      } else {
        // If the Hour is Not less than equals to 11 then Set the Time format as PM.
        setFromAmStyle(styles.noonStyle)
        SetToPmStyle(styles.selectedNoonStyle)
      }

      if (toTime.getHours() <= 11) {
        setFromRightAmStyle(styles.selectedNoonStyle)
        SetToRightPmStyle(styles.noonStyle)
      } else {
        // If the Hour is Not less than equals to 11 then Set the Time format as PM.
        setFromRightAmStyle(styles.noonStyle)
        SetToRightPmStyle(styles.selectedNoonStyle)
      }
    }

    return () => {
      // unmounted = true;
    };
  }, [isFocused]);

  useEffect(() => {
    fromTime.setMonth(selectedDate.getMonth(), selectedDate.getDate())
    toTime.setMonth(selectedDate.getMonth(), selectedDate.getDate())
    return () => {
        
    }
}, [selectedDate])

  const toggleModal = () => {
    //console.log('toggle data');
    //SubmitRequest()
    setModalVisible(!isModalVisible);
  };
 
  const ChatNow = () => {
    console.log('Chat Now',route.params.team.ChildName);
    let sender = 'FAMILY-'+route.params.familyUserProfileID  +'-' +route.params.team.familyMemberId
    var recieverROLE 
  
    if(route.params.item.description == 'Interpreter')
    {
      recieverROLE = 'INTERPRETER-' +route.params.item.id
    }
    else
    {
      recieverROLE = 'THERAPIST-' +route.params.item.id
    }
    console.log('reciver',sender,recieverROLE)

    navigation.navigate('ChatScreen', 
    {sender: sender,
      reciever: recieverROLE,
      name :route.params.team.ChildName,
      receiverName:route.params.item.name});
    // navigation.navigate('ChatScreen', {reciever: route.params.item});
  };
  

  const SubmitRequest  = () => {
    //console.log('Accept')
    setData({
        ...data,
        isLoading:true
    })
    if(route.params.item.description == 'Interpreter'){
      if (reason.trim().length == 0) {
        setData({
          ...data,
          isLoading:false
      })
        ShowAlert("Please Select the Reason")
       return
      }
      let data = {
        'childName' : route.params.team.ChildName,
        'familyMemberId' : route.params.team.familyMemberId,
        'reason' : reason,
        'interpreterId' : route.params.item.id,
        'interpreterName' : route.params.item.name,
      }
      ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.changeInterpreterRequestByfamily , data , 'PUT') 
      .then(response => {
          setData({
              ...data,
              isLoading:false
          })
          if (response.code >= 200 && response.code <= 299) {
              toggleModal()
              ShowAlert(response.message)
          } else {
             toggleModal()
              ShowAlert(response.message)
          }
      })
      
    }
    else{
      if (reason.trim().length == 0) {
        setData({
          ...data,
          isLoading:false
      })
        ShowAlert("Please Select the Reason")
       return
      }
      if (therapyId == 0) {
        setData({
          ...data,
          isLoading:false
      })
        ShowAlert("Please Select the Therapy")
       return
      }
 
    let data = {
      'childName' : route.params.team.ChildName,
      'familyMemberId' : route.params.team.familyMemberId,
      'reason' : reason,
      'therapistId' : route.params.therapistId,
      'therapistName' : route.params.therapistName,
      'therapyId' : therapyId,

    }
    ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.changeThearpistRequestByfamily , data , 'PUT') 
    .then(response => {
        setData({
            ...data,
            isLoading:false
        })
        if (response.code >= 200 && response.code <= 299) {
            toggleModal()
            ShowAlert(response.message)
        } else {
           toggleModal()
            ShowAlert(response.message)
        }
    })
  }
  }
  const getFamilyProfile = () => {
    //console.log('ITEM=========>', route.params.team);
    let childID = route.params.team.familyMemberId;
    getApiHelper(
      ServiceUrl.base_url_91 +
        ServiceUrl.getFamilyDetailByChildID +
        '?familyMemberId=' +
        childID,
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        //if (!unmounted) {
         // setfamilyUserProfileID(response.data.familyMembersuserProfile.id)
          //console.log('name --->>>', response.data);
        //}
      } else {
        ShowAlert(response.message);
      }
    });
  };

  const requestSession = () => {
    setSessionModalVisible(true)
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    let hour = date.getHours(); 
    if (isLeftPicker) {
        setFromTime(date)
        
        // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
        if (hour <= 11) {
            setFromAmStyle(styles.selectedNoonStyle)
            SetToPmStyle(styles.noonStyle)
        } else {
            // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            setFromAmStyle(styles.noonStyle)
            SetToPmStyle(styles.selectedNoonStyle)
        }
    } else {    
        setToTime(date)
        
        // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
         if (hour <= 11) {
            setFromRightAmStyle(styles.selectedNoonStyle)
            SetToRightPmStyle(styles.noonStyle)
        } else {
            // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            setFromRightAmStyle(styles.noonStyle)
            SetToRightPmStyle(styles.selectedNoonStyle)
        }
    }
};

const hideDatePicker = () => {
  setIsLeftDatePickerVisible(false);
  setIsRightDatePickerVisible(false);
};

const showDatePicker = (isLeft) => {
  setIsLeftPicker(isLeft)
  if (isLeft) {
      setIsLeftDatePickerVisible(true);
      setIsRightDatePickerVisible(false);
  } else {
      setIsLeftDatePickerVisible(false);
      setIsRightDatePickerVisible(true);
  }
};

const selectDate = () => {

  setIsDatePicker(true)
}

const handleConfirmDatePicker = (date)=> {
  setSelectedDate(date)
  setIsDatePicker(false)
}

const hideDatePickerDatePicker = ()=> {
  setIsDatePicker(false)
}

  const SubmitRequestForSession = (text) => {

    var finalDate = selectedDate
    finalDate.setHours(fromTime.getHours(), fromTime.getMinutes())

    let isFutureHour = moment(finalDate).diff(moment(todayDate), 'hours')
    let isFutureMinutes = moment(finalDate).diff(moment(todayDate), 'minutes')
    let timediff = moment(toTime).diff(moment(fromTime),'minutes')
    // console.log('fromTime------->>',fromTime)
    // console.log('toTime------->>',toTime)
    // console.log('finalDate------->>',finalDate)
    // console.log('isFutureHour------->>',isFutureHour)
    // console.log('isFutureMinutes------->>',isFutureMinutes)

    if (isFutureHour <= 0 && isFutureMinutes <= 0) {
      ShowAlert(AlertMessage.valid_session_time)
      return
    }
    if (timediff < 30 ) {
      ShowAlert(AlertMessage.valid_time)
      return
  }
  if (text.length < 3) {
    ShowAlert(AlertMessage.valid_reason)
    return
}
    let data = {
      'endDateTime': toTime,
      'familyMemberId': route.params.team.familyMemberId,
      'startDateTime': fromTime,
      'therapistId': route.params.item.id,
      'note' : text
    }

    var timeZone = momentTz.tz.guess()

    ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.sessionRequest + '?timeZone='+ timeZone, data, 'POST')
      .then(response => {
        setData({
          ...data,
          isLoading: false
        })
        if (response.code >= 200 && response.code <= 299) {
          setSessionModalVisible(false)
           ShowAlert(response.message)
        } else {
          ShowAlert(response.message)
        }
      })
  }
const CancelModal = () =>{
  console.log('cancel')
    setModalVisible(false)
    setReason('')
    SetTherapyId(0)
}
  return (
    <SafeAreaView style={styles.container}>
      <Modal
         isVisible={isModalVisible}
         onBackdropPress= {() => CancelModal}
         style={styles.box2}>
         <View style = {{flex:1}}>
          <View>
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: colors.TEXT_BLUE,
                height: 60,
                borderTopEndRadius: 10,
                borderTopStartRadius: 10,
              }}>
              <Text style={styles.text4}>Change Therapist</Text>
            </View>
            <View style={{padding: 20, justifyContent: 'space-between'}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text style={styles.text2}>Therapist Name:</Text>
                <Text style={{ flex:1,fontFamily: 'Roboto',fontSize: 18, color: colors.GRAY,marginStart:5}}>{route.params.item.name}</Text>
              </View>
              <View style = {{marginVertical:0,...(Platform.OS !== 'android' && {zIndex: 10})}}>
              <Text style={styles.text5}>Select Therapy : </Text>
              <DropDownPicker zIndex = {50}
                items={services}
                placeholder="Select Therapy"
                placeholderStyle={{color: colors.BLACK}}
                defaultIndex={0}
                labelStyle = {{color: colors.BLACK}}
                containerStyle={{height: 40, marginTop: 20}}
                dropDownStyle={{backgroundColor: colors.WHITE}}
               
                onChangeItem={(item) => SetTherapyId(item.value)}
              />
              </View>
              <View style = {{marginTop:10,paddingBottom:100}}>
              <Text style={styles.text5}>Reason :</Text>
              <DropDownPicker
                items={[
                  {label: 'Treatment is not showing progress', value: 'Treatment is not showing progress'},
                  {label: 'Lack of knowledge', value: 'Lack of knowledge'},
                  {label: 'Poor communication', value: ' Poor communication'},
                ]}
                placeholder="Select Reason"
                placeholderStyle={{color: colors.BLACK}}
               // defaultIndex={0}
                labelStyle = {{color: colors.BLACK}}
                containerStyle={{height: 40, marginTop: 20}}
                onChangeItem={(item) => setReason(item.label)}
              />
              </View>
              {/* <View style={{padding: 40, height: 10}}>
              <GreenButton text="Submit" onMethod={SubmitRequest} />
            </View> */}
            </View>
            <View style = {{marginTop:10,padding:20}}>
             <View style={{height: 38}}>
            <GreenButton text="Submit" onMethod={() => SubmitRequest()} />
          </View>
          <View style={{height: 0,paddingHorizontal:0,marginVertical:20}}>
          <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginTop: 0, justifyContent:'center'}} 
          onPress = { () => CancelModal() }>
            <Text style={{fontFamily:'Roboto-Bold', fontSize:16, textAlign:'center', fontWeight:'bold', color:'#387af6'}}>Cancel</Text>
          </TouchableOpacity>
          </View>
          </View>
            </View>
            
       
        </View>
      </Modal>
      <View
        style={{
          flexDirection: 'column',
          padding: 20,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View>
          <View style={{flexDirection: 'row'}}>
            {/* <Text>hello</Text> */}
            <Image
              source={{uri: route.params.item.profilePicUrl}}
              style={{width: 90, height: 90, borderRadius: 40}}></Image>
            <Image
              source={{uri: route.params.item.profilePicUrl}}
              style={styles.profileImage}
            />
            <View style={{marginStart:20,flex:1}}>
              <Text style={styles.text2}>{route.params.item.name}</Text>
              <Text style={styles.text3}>{route.params.item.description}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.text1}>Contact Email:</Text>
            <Text style={styles.text2}>{route.params.item.email}</Text>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={styles.text1}>Contact Phone:</Text>
            <Text style={styles.text2}>{route.params.item.phone}</Text>
          </View>
          {
            route.params.item.description != 'Interpreter' 
            ?
          <TouchableOpacity style={{marginTop: 20}} onPress={toggleModal}>
            <Text
              style={{
                color: '#387af6',
                textDecorationLine: 'underline',
                fontSize: 14,
              }}>
              Change Request
            </Text>
          </TouchableOpacity> :null}
          {
            route.params.item.description != 'Interpreter' 
            ?
            <TouchableOpacity style={{marginTop: 20}} onPress={() => requestSession()}>
              <Text
              style={{
                color: '#387af6',
                textDecorationLine: 'underline',
                fontSize: 14,
              }}>
              Session Request
              </Text>
            </TouchableOpacity>
            :
            null
          }
        </View>
        <TouchableOpacity onPress={() => ChatNow()} style={{backgroundColor:'#0fd683', width:120, height:35, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6}}>
              <Image source={require('../../../assets/images/chat.png')} style={{width:20, height:20, resizeMode:'contain'}}></Image>
              <Text style={{fontFamily:'Roboto-Regular', fontSize:14, color:'white', marginLeft:10}}>Chat Now</Text>
          </TouchableOpacity>
      </View>
      <Modal
         isVisible={isSessionModalVisible}
         onBackdropPress= {() => setSessionModalVisible(false)}
         style={styles.box3}>
         <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{flex: 1, padding: 0}}>
          
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: colors.TEXT_BLUE,
                height: 60,
                borderTopEndRadius: 10,
                borderTopStartRadius: 10,
              }}>
              <Text style={styles.text4}> Session Request</Text>
            </View>
            <View style={{padding: 20, justifyContent: 'space-between'}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.text2}>Therapist Name:</Text>
                <Text style={{flex:1,fontFamily: 'Roboto',fontSize: 18, color: colors.GRAY,marginStart:5}} >{route.params.item.name}</Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:15}}>
                <Text style={styles.text2}>Child Name:</Text>
                <Text style={styles.text3}>{route.params.team.ChildName}</Text>
              </View>
              <Text style={styles.text5}>Date:</Text>
              <View style={{marginTop:20}}>
                   <TouchableOpacity onPress={() => selectDate()} style={{height:40, borderWidth:1,borderRadius:5, justifyContent:'center'}}>
                      <Text style={{ marginLeft: 10, fontFamily: 'Roboto-Bold', fontSize: 18 }}>{ moment(selectedDate).format('MM-DD-YYYY') }</Text> 
                   </TouchableOpacity>
              </View>
              <DatePicker
                        isVisible={isDatePicker}
                        onConfirm={handleConfirmDatePicker}
                        onCancel={hideDatePickerDatePicker}
                        date = {selectedDate}
                            />
              <View style={{flexDirection:'row', marginTop:20}}>
                <Image source={require('../../../assets/images/clock_block.png')} style={{width:20, height:20, resizeMode:'contain', marginRight:10, marginTop:3}}></Image>
                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Start Time:</Text>
              </View>

              <View style={{ marginTop: 15}}>
                <TouchableOpacity style={{ flexDirection: 'row'}} onPress={() => showDatePicker(true)} >
                        
                        <Text
                                style={{
                                    height: 40, borderColor: '#86adf8', borderWidth: 2, width: 65, borderRadius: 10, fontFamily: 'Roboto-Regular',
                                    fontSize: 18, textAlign:'center', paddingTop:5
                                }}>{moment(fromTime).format('hh:mm')}</Text>

                            <View style={fromAmStyle}>
                                <Text style={{ fontFamily:'Roboto-Regular', fontSize:17}}>AM</Text>
                            </View>
                            <View style={toPmStyle}>
                                <Text style={{ fontFamily:'Roboto-Regular', fontSize:17}}>PM</Text>
                            </View>
                 </TouchableOpacity>
                 
                        <TimePicker
                        isVisible={isLeftDatePickerVisible}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        date = {fromTime}
                            />
              </View>

              <View style={{flexDirection:'row',  marginTop:15}}>
                   <Image source={require('../../../assets/images/clock_block.png')} style={{width:20, height:20, resizeMode:'contain', marginRight:10, marginTop:3}}></Image>
                   <Text style={{fontFamily:'Roboto-Medium', fontSize:18}}>End Time:</Text>
                </View>

                <View style={{ marginTop: 15}}>
                <TouchableOpacity style={{ flexDirection: 'row'}} onPress={() => showDatePicker(false)}>
                    <Text
                            style={{
                                height: 40, borderColor: '#86adf8', borderWidth: 2, width: 65, borderRadius: 10, fontFamily: 'Roboto-Regular',
                                fontSize: 18, textAlign:'center', paddingTop:5
                            }}>{moment(toTime).format('hh:mm')}</Text>
                        <View style={fromRightAmStyle}>
                            <Text style={{ fontFamily:'Roboto-Regular', fontSize:18}}>AM</Text>
                        </View>
                        <View style={toRightPmStyle}>
                            <Text style={{ fontFamily:'Roboto-Regular', fontSize:18}}>PM</Text>
                        </View>
                    
                    </TouchableOpacity>

                    <TimePicker
                        isVisible={isRightDatePickerVisible}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        date = {toTime}
                    />
                </View> 

              

             {/* <View style={{height: 38, marginTop: 25 ,marginBottom:20}}>
              <GreenButton text="Submit" onMethod={() => SubmitRequestForSession()} />
            </View> */}
            <Text style={styles.text5}>Notes :</Text>
            <TextInput
                multiline={true}
               
                style={{
                  backgroundColor: colors.WHITE,
                  marginTop: 10,
                  height: 60,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  paddingLeft: 10,
                  fontSize: 16,
                  textAlignVertical: 'top',
                }}
               
                multiline={true}
                onChangeText={(text) => setNotes(text)}></TextInput>
            <View style = {{paddingHorizontal:0,paddingVertical:20,flexDirection:'row',justifyContent:'space-around'}}>
             {/* <View style={{height: 38}}>
            <GreenButton text="Submit" onMethod={() => SubmitRequestForSession()} />
          </View> */}
          <View style={{height: 0,paddingHorizontal:0,marginVertical:0}}>
          <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 1, height: 40, borderRadius: 10, marginTop: 0, justifyContent:'center',paddingHorizontal:30,backgroundColor:'#0fd683'}} onPress = { () => SubmitRequestForSession(notes)}>
            <Text style={{fontFamily:'Roboto-Bold', fontSize:16, textAlign:'center', fontWeight:'bold', color:'#fff'}}>Submit</Text>
          </TouchableOpacity>
          </View>
          <View style={{height: 0,paddingHorizontal:0,marginVertical:0}}>
          <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 40, borderRadius: 10, marginTop: 0, justifyContent:'center',paddingHorizontal:30}} onPress = { () => setSessionModalVisible(false)}>
            <Text style={{fontFamily:'Roboto-Bold', fontSize:16, textAlign:'center', fontWeight:'bold', color:'#387af6'}}>Cancel</Text>
          </TouchableOpacity>
          </View>
          </View>
            </View>
            
        
        </KeyboardAwareScrollView>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  text1: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: colors.BLACK,
    marginTop: 20,
  },
  text2: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: colors.BLACK,
    //marginTop :5,
  },
  text4: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    color: colors.WHITE,
    textAlign: 'center',
  },
  text3: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.GRAY,
    flex:1,
    marginStart:5,
    marginTop:2,
    marginBottom:1,
  },
  text5: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 15,
  },
  box2: {
    //opacity: 0.9,
    marginVertical: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 30,
    flex:1,
    // flexDirection: 'column',
    //     //  padding: 20,
      justifyContent: 'center',
    //       flex: 1,
   // marginVertical:50
    //marginBottom:40,
    //right:90
  },
  box3: {
    opacity: 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 30,
    marginVertical:40,
    padding:10,
  },
  noonStyle: {  
    backgroundColor: '#C0C0C0', width: 50, height: 45, marginLeft: 6, borderRadius: 10, justifyContent:'center', alignItems:'center', height:40 
  },
selectedNoonStyle: {
    backgroundColor: '#387af6', width: 50, height: 45, marginLeft: 6, borderRadius: 10, justifyContent:'center', alignItems:'center', height:40 
},
});

export default MyTeamDetailsFamily;


