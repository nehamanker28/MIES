import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Platform } from 'react-native'
import moment from 'moment'
import { useIsFocused } from "@react-navigation/native";
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import {Image} from 'react-native-elements';


const QueriesListTherapist = ({navigation,route}) => {

    const isFocused = useIsFocused();
    const [data, setData] = useState({
        sessions: [],
        isLoading: false,
    })

    useEffect(() => {
        if (isFocused) {
            getCaseNotes()
        }
        return () => {
            
        }
    }, [isFocused])

    const getCaseNotes = () => {
        ////console.log('get Session by date --------->>>>',date)
        let query ;
        if(route.params == null){
            query = false
        }
        else{
            query = true
        }
        setData({
            ...data,
            isLoading:true
        })

        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getCaseNotes + '?submitted=true&queries='+ query +'&sort=startDateTime,DESC', 'GET')
        .then(response => {
            if (response.code >= 200 && response.code <= 299) {

                    setData({
                        ...data,
                        sessions: response.data.content,
                        isLoading: false
                    })
                    //console.log('CaseNOteData====',response.data.content)
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    const shareCaseNoteForVerification = (item) => {
        navigation.push('ShareCaseNote', {'session':item})
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
    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ flex: 1, marginVertical: 15 }} onPress={() => {
    //console.log('i check-->>',item)
            navigation.push('CaseNotesQueriesTherapist', {'session':item})
        }}>
        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 14}}>{ convertTime(item.startDateTime) }</Text>

            <View style={{ flexDirection: 'row',marginTop:10}}>
                <Image source={{uri: item.childProfilePic}} style={{width:55, height:55, borderRadius: 20}}></Image>
                <View style={{flex:1, marginLeft:20}}>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 20 }}>{item.childName}</Text>
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 14 , marginTop:10}}>{ item.therapy }</Text>
                 

                </View> 
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.interpreterName ?
                <View>
                    {
                        item.caseNoteDTO.draftedInterpreter ?
                        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 14 , marginRight:5}} numberOfLines= {2}>Pending Translate</Text> //Submitted to Interpreter
                        :
                        item.caseNoteDTO.acceptCaseNotes ?
                        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 14 , marginRight:5}}>Accepted</Text>
                        :
                        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 14 , marginRight:5}}>Pending Accept</Text>
                    }
                    </View>:
                    <View>
                    {item.caseNoteDTO.acceptCaseNotes ?
                        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 14 , marginRight:5}}>Accepted</Text>
                        :
                        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 14 , marginRight:5}}>Pending Accept</Text>
                    }
                    </View>}
                  
                    <TouchableOpacity onPress={() => shareCaseNoteForVerification(item)}>
                        <Image source={require('../../../assets/images/share_icon.png')} style={{width:25, height:25, resizeMode:'contain', marginRight:10}}></Image>
                    </TouchableOpacity>
                    {/* <Image source={require('../../../assets/images/arrow.png')} style={{width:20, height:20}}></Image> */}
                </View>
            </View>
            {/* <Text style={{ fontFamily: 'Roboto-light', fontSize: 14,marginLeft:75}}>{ convertTime(item.startDateTime) }</Text> */}
            <View style={{height:2, backgroundColor:'#d8e4f1', marginTop:20}}></View>
        </TouchableOpacity>  
    );

    return (
        <View style={{flex:1}}>
                <FlatList
                        style={styles.FlatListStyle}
                        data={data.sessions}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => 'index'+index}
                /> 
                {
                    data.isLoading ? ShowLoader() : null
                }  
        </View>
    )
}
const styles = StyleSheet.create({
    baseView: {
        flex: 1,
        backgroundColor:'white'
    },

    profileImageTop :{
        width : 80,
        height :80,
        borderRadius: 110 / 2,
        borderColor: 'white',
        borderWidth: 3,
    },
    FlatListStyle: {
        marginHorizontal: 20,
        marginTop:10
    },
})

export default QueriesListTherapist

