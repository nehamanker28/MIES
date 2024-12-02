import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, ScrollView, Button, TextInput, TouchableOpacity } from 'react-native'
//import { TouchableOpacity} from 'react-native-gesture-handler'


import WeekCalender from '../../components/WeekCalender'
import GreenButton from '../../components/GreenButton'
import { useIsFocused } from "@react-navigation/native";
import moment from 'moment'
import momentTz from 'moment-timezone';
import TimePicker from '../../components/TimePicker'
import { ApiHelper } from '../../Service/Fetch'
import { ServiceUrl , AlertMessage} from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { calculateAge } from '../../Common/Utility'
import roundToNearestMinutes from 'date-fns/fp/roundToNearestMinutes';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
LogBox.ignoreAllLogs();


const AddSessionTherapist = ({navigation, route}) => {

    const todayDate = new Date()
    const [selectedDate, setSelectedDate] = useState(route.params.test)
    const [isLeftDatePickerVisible, setIsLeftDatePickerVisible] = useState(false);
    const [isRightDatePickerVisible, setIsRightDatePickerVisible] = useState(false);
    const [isLeftPicker, setIsLeftPicker] = useState(true)
    const [fromTime, setFromTime] = useState(selectedDate)
    const [toTime, setToTime] = useState(selectedDate)
   // const [isFromTimeAm, setIsFromTimeAm] = useState(true)
    const [fromAmStyle, setFromAmStyle] = useState(styles.noonStyle)
    const [toPmStyle, SetToPmStyle] = useState(styles.noonStyle)
    const [fromRightAmStyle, setFromRightAmStyle] = useState(styles.noonStyle)
    const [toRightPmStyle, SetToRightPmStyle] = useState(styles.noonStyle)
    const isFocused = useIsFocused();
    const [isFamilySelected, setIsFamilySelected] = useState(false)
    const [isTherapySelected, setIsTherapySelected] = useState(false)
    const [description, setDescription] = useState('')
    const [isInterpreter, setIsInterpreter] = useState(true)
    const [isTherapyType, setIsTherapyType] = useState(false)
    const [isLocationSelected, setIsLocationSelected] = useState(false)
    const [location, setLocation] = useState('')

    const [familyChildName, setFamilyChildName] = useState('')
    const [therapyName, setTherapyName] = useState(null)
    const [interpreterName, setInterpreterName] = useState('')
    const [therapyId, setTherapyId] = useState(null)
    const [therapistId, setTherapistId] = useState(null)
    const [isFamilySelection, setIsFamilySelection] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [therapistImg, setTherapistImg] = useState(null)
    const [interpreterImg, setInterpreterImg] = useState(null)
    const [isRemoveInterpreter, setRemoveInterpreter] = useState(false)

    useEffect(() => {
        
        if (isFocused) {

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

            if (route.params.isFamilySelected == true && isFamilySelection == true) {
                //console.log('fff------->>>',route.params.family.familyMember)

                var fName = route.params.family.familyMember.firstName
                    if(route.params.family.familyMember.lastName != null){
                        fName = fName+' '+route.params.family.familyMember.lastName 
                    }
                    setFamilyChildName(fName)
                if (route.params.family.familyMember.interpreter != null) {
                    setIsInterpreter(true)
                    
                    var iName = route.params.family.familyMember.interpreter.userProfile.firstName
                    if(route.params.family.familyMember.interpreter.userProfile.lastName != null){
                        iName = iName+' '+route.params.family.familyMember.interpreter.userProfile.lastName 
                    }
                    setInterpreterName(iName)
                    ////console.log('0000----->>>',route.params.family.familyMember.interpreter.userProfile)
                    setInterpreterImg(route.params.family.familyMember.interpreter.userProfile.profilePicUrl)
                } else {
                    setIsInterpreter(false)
                }
                setIsFamilySelected(route.params.isFamilySelected)
                if (route.params.family.familyMember.familyMemberTherapies.length == 1) {
                    setTherapyName(route.params.family.familyMember.familyMemberTherapies[0].therapy.name)
                    setTherapyId(route.params.family.familyMember.familyMemberTherapies[0].therapy.id)
                    setTherapistId(route.params.family.familyMember.familyMemberTherapies[0].therapist.id)
                    setTherapistImg(route.params.family.familyMember.familyMemberTherapies[0].therapist.userProfile.profilePicUrl)
                    ////console.log('0000----->>>',route.params.family.familyMember.familyMemberTherapies[0].therapist)
                    setIsTherapySelected(true)
                } 
            } else if (route.params.familyTherapy && isFamilySelection == false) {
                    setTherapyName(route.params.familyTherapy.therapy.name)
                    setTherapyId(route.params.familyTherapy.therapy.id)
                    setTherapistId(route.params.familyTherapy.therapist.id)
                    ////console.log('else----->>>',route.params.familyTherapy.therapist)
                    setIsTherapySelected(true)
            }

            if (route.params.interpreter) {
                if(route.params.interpreter.name == 'None Needed') {
                    setRemoveInterpreter(true)
                }else {
                    setRemoveInterpreter(false)
                }
            }

            if (route.params.isLocation) {
                //console.log('is location ------>>>',location)
                setLocation(route.params.location)
                setIsLocationSelected(true)
            }
        }
        return () => {
            
        }
    }, [isFocused])

    useEffect(() => {
        //fromTime.setDate(selectedDate.getDate())
        fromTime.setMonth(selectedDate.getMonth(), selectedDate.getDate())
        //toTime.setDate(selectedDate.getDate())
        toTime.setMonth(selectedDate.getMonth(), selectedDate.getDate())
        return () => {
            
        }
    }, [selectedDate])
    
    const onSelectedDay = (d) =>{
        setSelectedDate(d)
        //setFromTime(d)
        //setToTime(d)
    };

    const onSubmit = () => {

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
        if (!isFamilySelected) {
            ShowAlert(AlertMessage.valid_add_session_family)
            return 
        } 

        if (!isLocationSelected) {
             ShowAlert(AlertMessage.valid_location)
            return 
        }

        if (description.length < 3) {
            ShowAlert(AlertMessage.valid_session_description)
            return
        }

        // //console.log('fromTime -------->>>',fromTime)
        // //console.log('toTime -------->>>',toTime)
        // //console.log('=====================================')
        setIsLoading(true)

        var data = {}

        if (route.params.family.familyMember.interpreter == null || isRemoveInterpreter) {
            data = {
            "description": description, 'familyMemberId': route.params.family.familyMember.id, 
            'therapistId': therapistId, 'therapyId': therapyId, 'startDateTime':fromTime,'endDateTime':toTime}
        } else {
            data = {
            "description": description, 'familyMemberId': route.params.family.familyMember.id, "interpreterId": route.params.family.familyMember.interpreter.id,
            'therapistId': therapistId, 'therapyId': therapyId, 'startDateTime':fromTime,'endDateTime':toTime}  
        }

        if (route.params.isCustom) {
            data['locationOfTreatment'] = 'Other'
            data['otherLocationText'] = location
        } else {
            data['locationOfTreatment'] = location
        }
        var timeZone = momentTz.tz.guess()

        ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.addSession + '?timeZone='+ timeZone, data, 'POST')
        .then(response => {
            setIsLoading(false)
            if (response.code >= 200 && response.code <= 299) {
                navigation.navigate('SessionsTabScreen')
            } else {
                ShowAlert(response.message)
            }
        })
    }

    const onCancel = () => {
        navigation.navigate('SessionsTabScreen')
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

    const showAddFamilyScreen = () => {
        ////console.log('-------->>>',route.params.familyTherapy)
        setTherapyName(null)
        setTherapyId(null)
        setTherapistId(null)
        setIsTherapySelected(false)
        setIsFamilySelection(true)
        navigation.navigate('Add Family')
    }

    const showAddTherapyScreen = () => {
        if (isFamilySelected) {
            setIsFamilySelection(false)
            route.params.family.familyMember.familyMemberTherapies.map((item, index) => {
                item.isSelected = false
            })
            navigation.navigate('Add_Therapy', {'familyMembers':route.params.family.familyMember.familyMemberTherapies})
        } else {
            ShowAlert(AlertMessage.valid_add_session_family)   
        }
    }

    const showSelectLocationScreen = () => {
        //SelectLocation
        navigation.navigate('SelectLocation')
    }

    const onTypeDescription = (text) => {
        setDescription(text)
    }

    

    const removeInterpreter = () => {
        navigation.navigate('Add_Interpreter', {'interpreter':interpreterName})
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
            <View style={styles.calendarContainer}>
                <WeekCalender date={selectedDate} onChange={onSelectedDay}></WeekCalender>
            </View>
            <View style={styles.containerStyle}>
                <View style={{ height: 2, backgroundColor: '#D3D3D3', marginTop: 30 }}></View>
                <View style={{ height: 80, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../../assets/images/calendar.png')} style={{ width: 30, height: 40, resizeMode: 'contain', marginRight: 20 }}></Image>
                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>You have selected</Text>
                    <Text style={{ marginLeft: 10, fontFamily: 'Roboto-Bold', fontSize: 18 }}>{moment(selectedDate).format('MM-DD-YYYY')}</Text>
                </View>
                <View style={{ height: 2, backgroundColor: '#D3D3D3' }}></View>

                <View style={{ paddingHorizontal: 0, paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>

                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/clock_block.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10, marginTop: 3 }}></Image>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Start Time</Text>
                        </View>

                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10 }} onPress={() => showDatePicker(true)} >
                            <Text
                                style={{
                                    height: 40, borderColor: '#86adf8', borderWidth: 2, width: 65, borderRadius: 10, fontFamily: 'Roboto-Regular',
                                    fontSize: 18, textAlign: 'center', paddingTop: 5
                                }}>{moment(fromTime).format('hh:mm')}</Text>
                            <View style={fromAmStyle}>
                                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>AM</Text>
                            </View>
                            <View style={toPmStyle}>
                                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>PM</Text>
                            </View>
                        </TouchableOpacity>
                        <TimePicker
                            isVisible={isLeftDatePickerVisible}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            date={fromTime}
                        />
                    </View>


                    <View style={{}}>

                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/clock_block.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10, marginTop: 3 }}></Image>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>End Time</Text>
                        </View>

                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10 }} onPress={() => showDatePicker(false)}>
                            <Text
                                style={{
                                    height: 40, borderColor: '#86adf8', borderWidth: 2, width: 65, borderRadius: 10, fontFamily: 'Roboto-Regular',
                                    fontSize: 18, textAlign: 'center', paddingTop: 5
                                }}>{moment(toTime).format('hh:mm')}</Text>
                            <View style={fromRightAmStyle}>
                                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>AM</Text>
                            </View>
                            <View style={toRightPmStyle}>
                                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>PM</Text>
                            </View>

                        </TouchableOpacity>

                        <TimePicker
                            isVisible={isRightDatePickerVisible}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            date={toTime}
                        />
                    </View>

                </View>

                <View>
                    <View style={{ height: 2, backgroundColor: '#D3D3D3', marginBottom: 25 }}></View>
                    {
                        isFamilySelected ?
                            <TouchableOpacity onPress={showAddFamilyScreen}>
                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 15 }}>Family & Child</Text>
                                <View style={{
                                    height: 85, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                                    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'
                                }}>
                                    <Image source={{ uri: route.params.family.familyMember.profileUrl }} style={styles.profileImage}></Image>
                                    <View style={{ paddingLeft: 15, flex: 1 }}>
                                        <Text style={{ color: 'black', fontFamily: 'Roboto-Regular', fontSize: 20 }} numberOfLines={2}>{familyChildName}</Text>
                                        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 18, paddingTop: 5, color: 'black' }}>{calculateAge(route.params.family.familyMember.dob)}</Text>
                                    </View>
                                    <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={showAddFamilyScreen}>
                                <View style={{ backgroundColor: '#eaf1ff', height: 55, width: '100%', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../assets/images/select_family.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>Select Family & Child</Text>
                                    </View>
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }

                    <View style={{ height: 2, backgroundColor: '#D3D3D3', marginVertical: 25 }}></View>
                    {/* <TouchableOpacity> */}
                    {
                        isTherapySelected ?
                            <TouchableOpacity onPress={showAddTherapyScreen}>
                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 15 }}>Therapy</Text>

                                <View style={{
                                    height: 85, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                                    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'
                                }}>
                                    {/* <Image source={{uri: therapistImg}} style={styles.profileImage}></Image> */}
                                    <Image source={require('../../../assets/images/select_Therapy.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                    <View style={{ paddingLeft: 15, flex: 1 }}>
                                        <Text style={{ color: 'black', fontFamily: 'Roboto-Regular', fontSize: 18 }} numberOfLines={2}>{therapyName}</Text>
                                    </View>
                                    <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={showAddTherapyScreen}>
                                <View style={{ backgroundColor: '#eaf1ff', height: 55, width: '100%', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../assets/images/select_Therapy.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>Select Therapy</Text>
                                    </View>
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }

                    <View style={{ height: 2, backgroundColor: '#D3D3D3', marginVertical: 25 }}></View>
                    {/* <TouchableOpacity> */}
                    {
                        isTherapySelected ?
                            <View>
                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 15 }}>Type</Text>
                                <View style={{
                                    height: 85, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                                    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'
                                }}>
                                    {/* <Image source={{uri: therapistImg}} style={styles.profileImage}></Image> */}
                                    <Image source={require('../../../assets/images/select_TherapyType.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                    <View style={{ paddingLeft: 15 }}>
                                        <Text style={{ color: 'black', fontFamily: 'Roboto-Regular', fontSize: 18 }}>Therapy</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View>
                                <View style={{ backgroundColor: '#eaf1ff', height: 55, width: '100%', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../assets/images/select_TherapyType.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>Session Type</Text>
                                    </View>
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                    </View>
                                </View>
                            </View>
                    }

                    <View style={{ height: 2, backgroundColor: '#D3D3D3', marginVertical: 25 }}></View>
                    {/* <TouchableOpacity> */}
                    {
                        isLocationSelected ?
                            <TouchableOpacity onPress={showSelectLocationScreen}>
                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 15 }}>Location</Text>
                                <View style={{
                                    height: 85, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                                    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'
                                }}>
                                    <Image source={require('../../../assets/images/location.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                    <View style={{ paddingLeft: 15, flex: 1 }}>
                                        <Text style={{ color: 'black', fontFamily: 'Roboto-Regular', fontSize: 18 }} numberOfLines={2}>{location}</Text>
                                    </View>

                                    <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>

                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={showSelectLocationScreen}>
                                <View style={{ backgroundColor: '#eaf1ff', height: 55, width: '100%', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../assets/images/location.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>Select Location</Text>
                                    </View>
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }

                    <View style={{ height: 2, backgroundColor: '#D3D3D3', marginVertical: 25 }}></View>
                    {/* <TouchableOpacity> */}
                    {
                        isInterpreter == false ?
                            <View style={{ backgroundColor: '#eaf1ff', height: 55, width: '100%', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../../../assets/images/select_Translate.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 15 }}></Image>
                                    <Text style={{ flex: 1, fontFamily: 'Roboto-Regular', fontSize: 18 }} numberOfLines={2}>No Interpreter for this family</Text>
                                </View>
                                <View style={{ justifyContent: 'flex-end' }}>
                                    <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                </View>
                            </View>
                            :
                            isFamilySelected ?
                                <View>

                                    <TouchableOpacity onPress={() => removeInterpreter()}>
                                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 15 }}>Interpreter</Text>
                                        <View style={{
                                            height: 85, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                                            paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'
                                        }}>
                                            {
                                                isRemoveInterpreter ?
                                                    null
                                                    :
                                                    <Image source={{ uri: interpreterImg }} style={styles.profileImage}></Image>
                                            }
                                            <View style={{ paddingLeft: 15, flex: 1 }}>
                                                {
                                                    isRemoveInterpreter ?
                                                        <Text style={{ color: 'black', fontFamily: 'Roboto-Regular', fontSize: 20 }}>None Needed</Text>
                                                        :
                                                        <Text style={{ color: 'black', fontFamily: 'Roboto-Regular', fontSize: 20 }} numberOfLines={2}>{interpreterName}</Text>
                                                }
                                            </View>

                                            <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>

                                        </View>
                                    </TouchableOpacity>

                                </View>
                                :
                                <View style={{ backgroundColor: '#eaf1ff', height: 55, width: '100%', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../assets/images/select_Translate.png')} style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 20 }}></Image>
                                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>Select Interpreter</Text>
                                    </View>
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        <Image source={require('../../../assets/images/rightArrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
                                    </View>
                                </View>
                    }

                    <View style={{ height: 2, backgroundColor: '#D3D3D3', marginBottom: 10, marginTop: 25 }}></View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Description</Text>
                    <View style={{ height: 150, backgroundColor: '#eaf1fe', marginTop: 10, padding: 15, borderRadius: 10 }}>
                        <TextInput placeholder='Add your description' multiline={true} maxLength={150} style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }} onChangeText={text => onTypeDescription(text)} />
                    </View>
                </View>
                <View style={{ paddingVertical: 20, height: 200 }}>
                    <GreenButton text='Submit' onMethod={() => onSubmit()} />
                    <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, justifyContent: 'center', marginTop: 20 }}
                        onPress={() => onCancel()} >
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
    },
    calendarContainer: {
        paddingTop:20,
        height: 120,
        backgroundColor:'white'
    },
    noonStyle: {
        backgroundColor: '#C0C0C0', width: 40, height: 40, marginLeft: 3, borderRadius: 10, justifyContent:'center', alignItems:'center' 
    },
    selectedNoonStyle: {
        backgroundColor: '#387af6', width: 40, height: 40, marginLeft: 3, borderRadius: 10, justifyContent:'center', alignItems:'center' 
    },
     profileImage :{
        width : 52,
         height: 52,
        borderRadius:25
    },
})

export default AddSessionTherapist


















// var hour = '0'
            // if (fromTime.getUTCHours() < 10) {
            //     hour = '0'+fromTime.getUTCHours()
            // } else {
            //     hour = fromTime.getUTCHours()
            // }
            // var minute = '00'
            // if (fromTime.getUTCMinutes() < 10) {
            //     minute = '0'+fromTime.getUTCMinutes()
            // } else {
            //     minute = fromTime.getUTCMinutes()
            // }

            // var endHour = '0'
            // if (toTime.getUTCHours() < 10) {
            //     endHour = '0'+toTime.getUTCHours()
            // }else {
            //     endHour = toTime.getUTCHours()
            // }
            // var endMinute = '00'
            // if (toTime.getUTCMinutes() < 10) {
            //     endMinute = '0'+toTime.getUTCMinutes()
            // } else {
            //     endMinute = toTime.getUTCMinutes()
            // }

            // let startTime = hour + ':' + minute + ':' + '00'
            // let endTime = endHour+ ':' + endMinute + ':' + '00'