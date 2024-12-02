import React, { useState, useEffect } from 'react';

//Import all required component
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Button,
    Platform,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from "../../Common/Colors";
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import GreenButton from '../../components/GreenButton';
import Modal from 'react-native-modal';
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { getApiHelper } from '../../Service/Fetch'
import moment from 'moment'


const QueriesArray = [
    {id: '1',image :require('../../../assets/images/sampleresources.png' )},
    {id: '2',image :require('../../../assets/images/sampleresources.png' )},
    {id: '3',image :require('../../../assets/images/sampleresources.png' )},
    {id: '4',image :require('../../../assets/images/sampleresources.png' )},
];


const SessionDetailFamily = ({navigation, route}) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState('')
    let sessionStartDateTemp = moment.utc(route.params.session.startDateTime).local()
     let sDateTimeTemp = moment(sessionStartDateTemp).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
     let sDateTemp = new Date(sDateTimeTemp)
    
    const [selectedDate, setSelectedDate] = useState(sDateTemp)
    const [fromTime, setFromTime] = useState(null)
    const [toTime, setToTime] = useState(null)
    const [fromAm, setFromAm] = useState(false)
    const [toAm, setToAm] = useState(false)

    const [data, setData] = useState({
        isLoading:false,
    })

    const [therapistName, setTherapistName] = useState('')
    const [interpreterName, setInterpreterName] = useState('')

    useEffect(() => {
        //console.log('inttt ----------->>>>', route.params.session.familyMember)
        var name = ''
        if(route.params.session.interpreter != null) {
            name = route.params.session.interpreter.userProfile.firstName
            if (route.params.session.interpreter.userProfile.lastName != null) {
                name = name + ' ' + route.params.session.interpreter.userProfile.lastName
            }
        }
        
        setInterpreterName(name)
        //fetchCaseNoteByApi()

        var tname = route.params.session.therapist.userProfile.firstName
        if (route.params.session.therapist.userProfile.lastName != null) {
            tname = tname + ' ' + route.params.session.therapist.userProfile.lastName
        }
        setTherapistName(tname)
        return () => {

        }
    }, [])

    const ItemSeparatorView = () => {
        return (
          // FlatList Item Separator
          <View
              style={{
                  height: 100,
                  width: 15,
                  backgroundColor: '#ffff'
              }}
          />
        );
      };
      const renderItem = ({ item }) => (
        <View style = {{borderRadius :20}}>
              <Image source={item.image} style = {{width:120,height:80}}></Image>           
        </View>
    );

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const onTypeDescription = (text) => {
        setDescription(text)
    }

    // const fetchApiDetail = () => {
    //     setData({
    //         ...data,
    //         isLoading: true,
    //     })

    //     getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getSessionForTherapist +'/'+ route.params.session.id, 'GET')
    //     .then(response => {
    //             if (response.code >= 200 && response.code <= 299) {
    //                 setData({
    //                     ...data,
    //                     isLoading: false,
    //                     session:response.data
    //                 })
    //                 //console.log('sdfasdffsdf-->>>',response.data.therapy)
    //             } else {
    //                 ShowAlert(response.message)
    //             }
    //         })
    // }

    const onEdit = () => {
        navigation.push('EditSession', {'session':route.params.session})
    }

    const onCancel = () => {
        //navigation.pop()
        navigation.push('CancelSessionFamily', {'session':route.params.session})
    }

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
        //let sDateTime = moment(sessionStartDate).format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
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

        return () => {
            
        }
    }, [])

        return (
            <View style={styles.container}>
                    <ScrollView style={styles.TopViewContainer}>
                        <Modal isVisible={isModalVisible}
                            onBackdropPress={() => setModalVisible(false)}
                            style={styles.box2}>
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text>Hello!</Text>
                                <Button title="Hide modal" onPress={toggleModal} />
                            </View>
                        </Modal>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{flex:1}}>
                                <Text style={styles.text1}>Therapy</Text>
                                <Text style={styles.text2} numberOfLines={2}>{route.params.session.therapy.name}</Text>
                                <Text style={styles.text1}>Date </Text>
                                <Text style={styles.text2}>{ moment(selectedDate).format('MM-DD-YYYY') }</Text>
                                <Text style={styles.text1}>Therapist</Text>
                                <Text style={styles.text2} numberOfLines={2}>{ therapistName }</Text>
                            </View>
                            
                            <View style={{flex:1}}>
                                <Text style={styles.text11}>Status</Text>
                                <Text style={styles.text21}>{route.params.session.status} </Text>
                                <Text style={styles.text11}>Time</Text>
                                <Text style={styles.text21}>{moment(fromTime).format('hh:mm a')} to {moment(toTime).format('hh:mm a')}</Text>
                                <Text style={styles.text11}>Interpreter</Text>
                                {route.params.session.interpreter == null ?
                                <Text style={styles.text21}>None Needed </Text> :
                                <Text style={styles.text21} numberOfLines={2}>{ interpreterName }</Text>}
                            </View>
                        </View>
                        <View>
                        <Text style={styles.text1}>Description</Text>
                            <Text style={styles.text3}>{route.params.session.description}</Text>
                        </View>
                        {route.params.session.caseNoteDTO ?
                        <View>
                            <Text style={styles.text1}>Soap Note</Text>
                            <Text style = {styles.text3}>{route.params.session.caseNoteDTO.description}</Text>
                            {/* <TouchableOpacity onPress={toggleModal}>
                                <Text style={{ color: '#387af6' }}>Read More</Text>
                            </TouchableOpacity> */}
                        </View>: null
                        }
                    </ScrollView>  
                    { (route.params.session.status === 'COMPLETED') || (route.params.session.status === 'CANCELLED') || (route.params.session.status === 'NOT_COMPLETED') ? <View></View> :
                    <View style={{margin:20}}>
                        <GreenButton text='Edit' onMethod={() => onEdit()}/>
                        <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginTop: 20, justifyContent:'center'}} onPress = { () => onCancel()}>
                            <Text style={{fontFamily:'Roboto-Bold', fontSize:16, textAlign:'center', fontWeight:'bold', color:'#387af6'}}>Cancel Request</Text>
                        </TouchableOpacity>
                    </View>
                    }
                    {
                        data.isLoading ? ShowLoader() : null
                    }
            </View>
        );
    
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    TopViewContainer: {
        flex: 3,
        margin:20
    },
    text1 :{
        
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop :30,
      
       
    },
    text2 :{
        fontFamily :'Roboto-Regular',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :15,
        
    },
    text11 :{
        
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop :30,
        textAlign : 'right'
    },
    text21 :{
        fontFamily :'Roboto-Regular',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :15,
        textAlign : 'right'
    },
    text3 :{
        fontFamily :'Roboto-Light',
        fontSize : 16,
        color : colors.GREY,
        marginTop :15,
        
    },
    scrollViewStyle: {
          backgroundColor: 'gray',
          flex: 1 ,
          //flexGrow :0.05,  
    },
    box2: {
        opacity: 0.9,
        marginVertical :150,
        backgroundColor: 'white',
        borderRadius: 20,
        //marginBottom:40,
        //right:90
      },
})
export default SessionDetailFamily
