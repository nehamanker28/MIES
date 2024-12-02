import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, ScrollView, Button,Platform, TextInput, TouchableOpacity} from 'react-native'
//import { TouchableOpacity } from 'react-native-gesture-handler';
import WeekCalender from '../../components/WeekCalender'
import GreenButton from '../../components/GreenButton'
//import moment from 'moment'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { ApiHelper }from '../../Service/Fetch'
import TimePicker from '../../components/TimePicker'
import { ServiceUrl, AlertMessage } from '../../Common/String'
import  { ShowAlert } from '../../Common/Helper'

const EditSessionInterpreter = ({navigation, route}) => {

    const todayDate = new Date()

    let sessionStartDateTemp = moment.utc(route.params.session.startDateTime).local()
    let sDateTimeTemp = moment(sessionStartDateTemp).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
    let sDateTemp = new Date(sDateTimeTemp)
    
    const [selectedDate, setSelectedDate] = useState(sDateTemp)
    const [fromTime, setFromTime] = useState(null)
    const [toTime, setToTime] = useState(null)
    const [isLeftDatePickerVisible, setIsLeftDatePickerVisible] = useState(false);
    const [isRightDatePickerVisible, setIsRightDatePickerVisible] = useState(false);
    const [isLeftPicker, setIsLeftPicker] = useState(true)
    //const [isFromTimeAm, setIsFromTimeAm] = useState(true)
    const [fromAmStyle, setFromAmStyle] = useState(styles.noonStyle)
    const [toPmStyle, SetToPmStyle] = useState(styles.noonStyle)
    const [fromRightAmStyle, setFromRightAmStyle] = useState(styles.noonStyle)
    const [toRightPmStyle, SetToRightPmStyle] = useState(styles.noonStyle)
    const [description, setDescription] = useState(route.params.session.description)
    const [isLoading, setIsLoading] = useState(false) 

    
    const onSelectedDay = (d) =>{
        setSelectedDate(d)
        setFromTime(d)
        setToTime(d)
    };

    const isToday = (date) => {
        const today = new Date()
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const onSubmit = () => {

        if (isToday(selectedDate)) {
        }

        var finalDate = selectedDate
        finalDate.setHours(fromTime.getHours(), fromTime.getMinutes())

        let isFutureHour = moment(finalDate).diff(moment(todayDate), 'hours')
        let isFutureMinutes = moment(finalDate).diff(moment(todayDate), 'minutes')
        let timediff = moment(toTime).diff(moment(fromTime),'minutes')

        if (isFutureHour <= 0 && isFutureMinutes <= 0) {
            ShowAlert(AlertMessage.valid_session_time)
            return
        }
        if (timediff < 30 ) {
            ShowAlert(AlertMessage.valid_time)
            return
        }
        if (description.length < 3) {
            ShowAlert(AlertMessage.valid_session_description)
            return
        }
        
        let interpreterId = ''
        if (route.params.session.interpreter != null) {
            interpreterId = route.params.session.interpreter.id
        }
        var timeZone = momentTz.tz.guess()

        let data = {
            "description": description, "familyMemberId": route.params.session.familyMember.id, "interpreterId": interpreterId,
            "therapyId": route.params.session.therapy.id, 'startDateTime': fromTime, 'endDateTime': toTime, 'timeZone' : timeZone
        }

        ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.updateInterpreterSession + '/' + route.params.session.id, data, 'PUT')
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    navigation.pop()
                } else {
                    ShowAlert(response.message)
                }
            })
    }
    
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

    const hideDatePicker = () => {
        setIsLeftDatePickerVisible(false);
        setIsRightDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        
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
       hideDatePicker();
    };

    const onCancel = () => {
        navigation.pop()
    }

    useEffect(() => {

        setIsLoading(true)
        //var dateObj = new Date(moment(route.params.session.startDateTime, 'YYYY-MM-DD'+'T'+'hh:mm:ss').local())
        //var dateObj = new Date(route.params.session.startDateTime);

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

        console.log('sDateTime--------->>>>',sDateTime)

        
        //let sDateTime = moment(sessionStartDate).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
        
        let sDate = new Date(sDateTime)

        // //console.log(' platform ---->>>--', Platform.Version)
        // //console.log('api date----->>>', route.params.session.startDateTime)
        // //console.log('sessionStartDate----->>>', sessionStartDate)
        // //console.log('sDateTime----->>>', sDateTime)
        // //console.log('sDate----->>>', sDate)
        // //console.log('final ---->>>', moment(sDate).format('hh:mm'))
        // //console.log(' ---->>>--------------------')

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
       // let endDateTime = moment(sessionEndDate).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
        let endDate = new Date(endDateTime)
        
        setSelectedDate(sDate)
        setFromTime(sDate)
        setToTime(endDate)

        let hour = sDate.getHours(); 

         if (hour <= 11) {
            setFromAmStyle(styles.selectedNoonStyle)
            SetToPmStyle(styles.noonStyle)
        } else {
                // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            setFromAmStyle(styles.noonStyle)
            SetToPmStyle(styles.selectedNoonStyle)
        }

        let rightHour = endDate.getHours(); 
        if (rightHour <= 11) {
            setFromRightAmStyle(styles.selectedNoonStyle)
            SetToRightPmStyle(styles.noonStyle)
        } else {
            setFromRightAmStyle(styles.noonStyle)
            SetToRightPmStyle(styles.selectedNoonStyle)
        }

        //console.log('testing effect ------------->>>')

        setIsLoading(false)
        
        return () => {
            
        }
    }, [])

    return (

        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
            <View style={styles.calendarContainer}>
                <WeekCalender date={selectedDate} onChange={onSelectedDay}></WeekCalender>
            </View>
            <View style={styles.containerStyle}>
                <View style={{ height: 2, backgroundColor: 'gray', marginTop: 30 }}></View>
                <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image source={require('../../../assets/images/calendar.png')} style={{ width: 22, height: 20, resizeMode: 'contain', marginRight: 10 }}></Image>
                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>You have selected</Text>
                    <Text style={{ marginLeft: 10, fontFamily: 'Roboto-Bold', fontSize: 18 }}>{moment(selectedDate).format('MM-DD-YYYY')}</Text>
                </View>
                <View style={{ height: 2, backgroundColor: 'gray' }}></View>

                <View style={{ height: 130, marginTop: 15, paddingVertical: 20 }}>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Image source={require('../../../assets/images/clock_block.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10, marginTop: 2 }}></Image>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Start Time</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginRight: 30 }}>
                            <Image source={require('../../../assets/images/clock_block.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 65, marginRight: 10, marginTop: 2 }}></Image>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>End Time</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>


                        <View>
                            <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={() => showDatePicker(true)} >
                                <Text
                                    style={{
                                        height: 40, borderColor: '#86adf8', borderWidth: 2, borderRadius: 10, fontFamily: 'Roboto-Regular',
                                        fontSize: 18, textAlign: 'center', paddingTop: 5, paddingHorizontal: 5
                                    }}>{moment(fromTime).format('hh:mm')}</Text>
                                <View style={fromAmStyle}>
                                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 17 }}>AM</Text>
                                </View>
                                <View style={toPmStyle}>
                                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 17 }}>PM</Text>
                                </View>
                            </TouchableOpacity>
                            {
                                isLeftDatePickerVisible ?
                                    <TimePicker
                                        isVisible={isLeftDatePickerVisible}
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                        date={fromTime}
                                    />
                                    :
                                    null
                            }

                        </View>

                        <View>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => showDatePicker(false)}>
                                <Text
                                    style={{
                                        height: 40, borderColor: '#86adf8', borderWidth: 2, borderRadius: 10, fontFamily: 'Roboto-Regular',
                                        fontSize: 20, textAlign: 'center', paddingTop: 5, paddingHorizontal: 5
                                    }}>{moment(toTime).format('hh:mm')}</Text>
                                <View style={fromRightAmStyle}>
                                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>AM</Text>
                                </View>
                                <View style={toRightPmStyle}>
                                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>PM</Text>
                                </View>
                            </TouchableOpacity>
                            {
                                isRightDatePickerVisible ?
                                    <TimePicker
                                        isVisible={isRightDatePickerVisible}
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                        date={toTime}
                                    />
                                    :
                                    null
                            }
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Description</Text>
                    <View style={{ height: 150, backgroundColor: '#eaf1fe', marginTop: 10, padding: 15, borderRadius: 10 }}>
                        <TextInput multiline={true} maxLength={175} style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }} value={description} onChangeText={text => setDescription(text)} />
                    </View>
                </View>
                <View style={{ paddingVertical: 20, height: 200 }}>
                    <GreenButton text='Submit Request' onMethod={() => onSubmit()} />
                    <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginTop: 20, justifyContent: 'center' }} onPress={() => onCancel()}>
                        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#387af6' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                {
                    isLoading ? ShowLoader() : null
                }
            </View>
        </ScrollView>
     )
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor:'white',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical:20
    },
    calendarContainer: {
        height: 110,
        backgroundColor:'white'
    },
    noonStyle: {
        backgroundColor: '#C0C0C0', width: 40, height: 40, marginLeft: 3, borderRadius: 10, justifyContent:'center', alignItems:'center' 
    },
    selectedNoonStyle: {
        backgroundColor: '#387af6', width: 40, height: 40, marginLeft: 3, borderRadius: 10, justifyContent:'center', alignItems:'center' 
    },
})

export default EditSessionInterpreter



