import React, {useEffect, useState} from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";
//import SessionEdit from './src/screens/EditSessionScreen'
import moment from 'moment'
import momentTz from 'moment-timezone'
//import CalendarStrip from 'react-native-calendar-strip';
import WeekCalender from '../../components/WeekCalender'
import FloatingButton from '../../components/FloatingButton'
import { getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
//import { useState } from "react/cjs/react.development";
import { useIsFocused } from "@react-navigation/native";
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { calculateDuration, calculateMinsLeft, calculateMinsLeftForEnd } from '../../Common/Utility'
import { color } from "react-native-reanimated";
import colors from "../../Common/Colors";


//import { addDays } from 'date-fns'


const UpComingSessionInterpreter = (props) => {

    const isFocused = useIsFocused();

    const [data, setData] = useState({
        sessions: [],
        isLoading: false,
    })
    const todayDate = new Date()
    const [selectedDate, setSelectedDate] = useState(todayDate)
    var isJoined = false

    const onPressEdit = (item) => {
        props.navigation.push('EditSession', {'session':item})
    }

    const onPressDelete = (item) => {
        props.navigation.push('CancelSessionInterpreter', {'session':item})
    }
    
    const onSelectedDay = (d) =>{
        setSelectedDate(d)
        getSessionsByDate(d)
    };
 
    const onAddNewSection = () => {
       // //console.log('add sessions')
        //props.navigation.push('Add Session', {'test':'test1'})
    }

    const convertTime = (item) => {

        // //console.log('tem.startDateTime -->>', item.startDateTime)
        // //console.log('tem.startDateTime -->>',typeof(item.startDateTime))
        let sessionStartDate = moment.utc(item.startDateTime).local()
        let sessionEndDate = moment.utc(item.endDateTime).local()

        // //console.log('sessionStartDate -->>',sessionStartDate)
        // //console.log('sessionStartDate -->>',typeof(sessionStartDate))

        let sTime = moment(sessionStartDate).format('hh:mm a')
        let eTime = moment(sessionEndDate).format('hh:mm a')

        // //console.log('sTime -->>',sTime)
        // //console.log('eTime -->>',typeof(sTime))

        return (sTime+" - "+eTime)
    }

    const getSessionsByDate = (date) => {
        ////console.log('get Session by date --------->>>>',date)

        setData({
            ...data,
            isLoading:true
        })

        var endDay = moment(date).add(1, 'day').subtract(1, 'minutes')
        
       // //console.log('endDay sub------>>>',endDay)

        let sTime = moment(date).utc().format('YYYY-MM-DD'+'T'+'HH:mm:ss')
        let eTime = moment(endDay).utc().format('YYYY-MM-DD'+'T'+'HH:mm:ss')

        var timeZone = momentTz.tz.guess()

        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getSessionForInterpreter + '?startFromDateTime=' + sTime +'&startToDateTime='+ eTime + '&timeZone='+ timeZone + '&sort=startDateTime,ASC', 'GET')
        .then(response => {
            if (response.code >= 200 && response.code <= 299) {
                    
                    response.data.content.map((item, index) => {
                        let time = calculateMinsLeft(item.startDateTime)
                        let endTime = calculateMinsLeftForEnd(item.endDateTime)
                        //console.log('start left--->>', time)
                        //console.log('end left--->>', endTime)
                        if (time <= 5 && endTime >= 1 && item.status != 'COMPLETED' && item.status != 'CANCELLED') {
                            item.isSessionReady = true
                        } else {
                            item.isSessionReady = false
                        }
                        return {...item}
                    })
                
                    setData({
                        ...data,
                        sessions: response.data.content,
                        isLoading: false
                    })
                    ////console.log('Inter content detail--->>',response.data.content)
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    const isToday = (date) => {
        const today = new Date()
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const joinSession = (item) => {
        if(isJoined == false) {
            isJoined = true
            props.navigation.push('VideoCall',{'sessionId':item.id, 'startTime':item.startDateTime, 'endTime':item.endDateTime, 'item':item})
        }
    }
    
    useEffect(() => {
        if (isFocused) {
            ////console.log('selectedDate ----------->>>>', selectedDate)
            
            if (isToday(selectedDate)) {
                let dateObj = todayDate
                let dayInt = dateObj.getUTCDate()
            
                dateObj.setUTCDate((dayInt - 1))
                dateObj.setUTCHours(18)
                dateObj.setUTCMinutes(30)
                dateObj.setUTCSeconds(0)

                ////console.log('dateObj ----------->>>>', dateObj)
                getSessionsByDate(dateObj)   
            } else {
                getSessionsByDate(selectedDate)
            }
        }
        return () => {
            
        }
    }, [isFocused])
    const onShowDetail = (item) => {
        ////console.log ('ef')
        props.navigation.push('SessionDetailInterpreter', {'session':item})
        //Session Details
    }
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.ListViewContainer} onPress={() => {
            onShowDetail(item)
        }}>
            <View style={{
                borderRadius: 15, borderWidth: 1,
                paddingHorizontal: 14, paddingVertical: 12, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
            }}>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1, marginRight:5 }}>
                        <Image source={{ uri: item.familyMember.profileUrl }} style={styles.profileImage}></Image>
                        <Text style={{ flex: 1, fontFamily: 'Roboto-Medium', fontSize: 18, color: '#387af6', marginLeft: 10, marginTop: 4 }} numberOfLines={2}>{item.familyMember.firstName} {item.familyMember.lastName}</Text>
                    </View>
                    {
                        (item.status === 'COMPLETED') || (item.status === 'CANCELLED') || (item.status === 'NOT_COMPLETED') ? null :
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                                <TouchableOpacity onPress={() => {
                                    onPressEdit(item)
                                }}>
                                    <Image source={require('../../../assets/images/edit_blue.png')} style={styles.iconStyle}></Image>
                                </TouchableOpacity>
                                <View style={{ height: 27, width: 1, backgroundColor: 'gray', marginHorizontal: 10, marginVertical: -2 }}></View>
                                <TouchableOpacity onPress={() => {
                                    onPressDelete(item)
                                }}>
                                    <Image source={require('../../../assets/images/cancel.png')} style={styles.iconStyle}></Image>
                                </TouchableOpacity>
                            </View>
                    }

                </View>
                <Text style={styles.bodyTextStyle} numberOfLines={2}>{item.therapy.name}</Text>
                <View style={{ flexDirection: 'row', paddingStart: 0, marginTop: 17 }}>
                    <View style={{flex: 2, marginTop: 2 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/clock_block.png')} style={styles.iconStyle1}></Image>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 12, marginLeft: 3, color: 'gray', marginTop:-2 }}>{convertTime(item)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Image source={require('../../../assets/images/duration_blue.png')} style={styles.iconStyle1}></Image>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 12, marginLeft: 3, color: 'gray', marginTop:-2 }}>{calculateDuration(item.startDateTime, item.endDateTime)}</Text>
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

                                                <View style={{ flex: 0.7, flexDirection: 'row', backgroundColor: '#387af6', alignItems: 'center', borderRadius: 7, justifyContent: 'center', padding: 5, paddingHorizontal: 7 }}>
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
        </TouchableOpacity>
    );
    return (
        <View style={{flex:1}}>
            <View style={styles.container}>
                <WeekCalender  date={selectedDate} onChange={onSelectedDay}></WeekCalender>
            </View>
            <FlatList
                style={styles.FlatListStyle}
                data={data.sessions}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'index'+index}
            />
            {/* <FloatingButton press={onAddNewSection}></FloatingButton> */}
            {
                    data.isLoading ? ShowLoader() : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        backgroundColor:'#ffffff',
    },

    FlatListStyle: {
        backgroundColor:'white'
    },

    ListViewContainer: {
        borderRadius: 15,
        //height: 124.5,
       // backgroundColor: '#D3D3D3',
        marginVertical: 20,
        marginHorizontal:30
    },
    profileImage :{
        width : 34,
        height: 34,
        borderRadius: 60
    },
    iconStyle :{
        width : 15,
        height: 15,
        resizeMode: 'contain'
    },
    iconStyle1 :{
        width : 13,
        height: 13,
        resizeMode: 'contain'
    },
    bodyTextStyle :{
        fontFamily :'Roboto-Regular',
        fontSize : 14,
        color: '#222248',
        marginTop:8
      }

})

export default UpComingSessionInterpreter



// let sessionDateObj = new Date(date)
//         var hour = time.split(":")[0];
//         var minute = time.split(":")[1];
//         const dateObj = moment.utc()
//                    .hour(parseInt(hour) + 5)   // numbers from 0 to 23
//             .minute(parseInt(minute) + 30);
//         //console.log('date------>>>',dateObj)
//         return moment(dateObj).format('HH:mm')


// let startTime = item.startTime
        // const startArr = startTime.split(':');
        // sessionStartDate.setUTCHours(startArr[0], startArr[1])
        // sessionEndDate.setUTCHours(startArr[0], startArr[1])


        // let endTime = item.endTime
        // const endArr = endTime.split(':');
        // // sessionEndDate.setUTCHours(endArr[0], endArr[1])
        
        
        // sessionEndDate = moment(sessionEndDate).add(parseInt(endArr[0]), 'hours')
        // sessionEndDate = moment(sessionEndDate).add(parseInt(endArr[1]), 'minutes')