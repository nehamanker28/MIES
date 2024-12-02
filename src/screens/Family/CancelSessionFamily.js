import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, ScrollView, Button, TextInput, TouchableOpacity,Platform} from 'react-native'
import GreenButton from '../../components/GreenButton'
//import moment from 'moment'
import moment from 'moment'
import { ApiHelper }from '../../Service/Fetch'
import { ServiceUrl, AlertMessage } from '../../Common/String'
import  { ShowAlert } from '../../Common/Helper'
import colors from "../../Common/Colors";

const CancelSessionFamily = ({navigation, route}) => {
    let sessionStartDateTemp = moment.utc(route.params.session.startDateTime).local()
    let sDateTimeTemp = moment(sessionStartDateTemp).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
    let sDateTemp = new Date(sDateTimeTemp)
    
    const [selectedDate, setSelectedDate] = useState(sDateTemp)
    const [fromTime, setFromTime] = useState(null)
    const [toTime, setToTime] = useState(null)
    const [description, setDescription] = useState('')
    useEffect(() => {
        let sessionStartDate = moment.utc(route.params.session.startDateTime).local()
        var sDateTime
        if (Platform.OS === 'android') {
            sDateTime = moment(route.params.session.startDateTime).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
        } else {
            if (Platform.Version <= 14) {
                ////console.log('if enter')
                sDateTime = moment(route.params.session.startDateTime).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
            } else {
                ////console.log('else')
                sDateTime = moment(sessionStartDate).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
            }
            
        }
        let sDate = new Date(sDateTime)
        setSelectedDate(sDate)
        let sessionEndDate = moment.utc(route.params.session.endDateTime).local()
        var endDateTime
        if (Platform.OS === 'android') {
            endDateTime = moment(route.params.session.endDateTime).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
        } else {
            if (Platform.Version <= 14) {
                ////console.log('if enter')
                endDateTime = moment(route.params.session.endDateTime).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
            } else {
                ////console.log('else')
                endDateTime = moment(sessionEndDate).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
            }
        }
        //let endDateTime = moment(sessionEndDate).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
        let endDate = new Date(endDateTime)
        
        setFromTime(sDate)
        setToTime(endDate)
    }, [])
    const onSubmit = () => {


        if (description.length < 3) {
            ShowAlert(AlertMessage.valid_session_description)
            return
        }
        
        let data = {
            "reason": description,'startDateTime':fromTime,'endDateTime':toTime}
            //console.log(route.params.session.id)
          ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.cancelFamilySession +'/'+ route.params.session.id, data, 'PUT')
          .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    navigation.pop()
                } else {
                    ShowAlert(response.message)
                }
            })
    }
    
    const onCancel = () => {
        navigation.pop()
    }
    return(
        <ScrollView keyboardShouldPersistTaps='handled' style={styles.containerStyle}>
        <View style = {{flex :2}}>
           <View style = {{flexDirection :'row',paddingTop:20}}>
           <Image source={require('../../../assets/images/calendar_plain.png')} style = {{tintColor : colors.BLACK,width:25,height:23}}></Image>
           <Text style = {styles.header2}> {moment(selectedDate).format('DD MMMM YYYY') } </Text>           
           </View>
           <View style = {{flexDirection :'row',marginTop:30,marginBottom:30}}>
           <Image source={require('../../../assets/images/clock.png')} style = {{tintColor : colors.BLACK,width:25,height:25}}></Image>
           <Text style = {styles.header2}>{moment(fromTime).format('hh:mm a')} to {moment(toTime).format('hh:mm a')}</Text>     
           </View>
           <Text style = {styles.header}> Reason </Text>  
           <View style = {{padding :0}}>
           <TextInput 
                 multiline={true} 
                style = {{backgroundColor :colors.WHITE,marginTop :10,height :140,borderRadius:10,borderWidth :0.5,paddingLeft:10,fontSize :16,textAlignVertical: 'top'}}
                placeholder = 'Enter your reply'
                multiline = {true}
                onChangeText={text => setDescription(text)}
                >
             </TextInput> 
               
           </View>  
           </View>
           <View  style = {{flex :0.5}}>
           <View style={{height :38,marginTop :30}}>
                <GreenButton text='Submit Request' onMethod={() => onSubmit()} />
                </View> 
                <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginTop: 20, justifyContent:'center'}} onPress = { () => onCancel()}>
                    <Text style={{fontFamily:'Roboto-Bold', fontSize:16, textAlign:'center', fontWeight:'bold', color:'#387af6'}}>Cancel</Text>
                </TouchableOpacity>
           </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:30,
        //margin :30,
        backgroundColor: '#fff',
    },
    line: {
        width: 1,
        height: 72,
        backgroundColor: '#707070',
        marginLeft :60,
      },
    profileImage :{
        width : 88,
        height :88,
        borderRadius: 110 / 2,
        borderColor: colors.WHITE,
        borderWidth: 3,
    },
    header :{
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        marginTop :20,
       // paddingHorizontal :16,
    },
    header2 :{
        fontFamily :'Roboto-Medium',
        fontSize : 18,
        paddingHorizontal :16,
        
        
    },
    containerStyle: {
        backgroundColor:'white',
        //flex: 1,
        paddingHorizontal: 20,
        //paddingTop:20,
      
        
    },
})
export default CancelSessionFamily