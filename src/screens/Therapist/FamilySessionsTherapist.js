import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity,Platform } from 'react-native'
import GreenButton from '../../components/GreenButton'
import { calculateAge, isPast } from '../../Common/Utility'
import { Image } from 'react-native-elements'
import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import moment from 'moment'

const FamilySessionsTherapist = ({route, navigation}) => {

    const [data, setData] = useState({
        sessions: [],
        isLoading: false,
        family:route.params.family,
        maxPage:0
    })
    const [pageNo, setPageNo] = useState(0)
    const [maxPage, setMaxPage] = useState(0)

    useEffect(() => {
        getSessionsByDate()
        return () => {
            
        }
    }, [pageNo])

    const onSelectChat = () => { 
        //console.log(route.params.parent)
        let sender = 'THERAPIST-'+route.params.therapistId 
        let recieverROLE = 'FAMILY-' + route.params.parent.userProfile.id + '-' + route.params.family.id
        //console.log('reciver',sender,recieverROLE)
        navigation.navigate('ChatScreen', {sender: sender,reciever: recieverROLE,name :route.params.name,receiverName:route.params.family.firstName});
        //navigation.navigate('ChatScreen',{'reciever' : route.params.family})
    }

    const getSessionsByDate = () => {

        setData({
            ...data,
            isLoading:true
        })

        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getSessionForTherapist + '?familyMemberId=' + route.params.family.id + '&page='+ pageNo +'&size=10&sort=startDateTime,DESC', 'GET')
        .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        ...data,
                        sessions: data.sessions.concat(response.data.content),
                        isLoading: false,
                        maxPage:response.data.totalPages
                    })
                    //console.log('content detail--->>',response.data.content)
                } else {
                    ShowAlert(response.message)
                }
            })
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
    const loadMoreResults = (info) => {
        if(pageNo < (data.maxPage - 1)){
            setPageNo(pageNo + 1)
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ flex: 1, marginVertical: 15 }} onPress={() => {
            //navigation.push('TherapyDetail', {'therapy':item})
            navigation.push('Session Details', {'session':item})
        }}>
            <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
                <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 20 }}>{ item.therapy.name }</Text> 
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 , marginTop:10}}>{ convertTime(item.startDateTime)}</Text>
            </View> 
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isPast(item.endDateTime) ? 
                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16, marginRight: 10 }}>past</Text>
                        :
                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16, marginRight: 10 }}>upcoming</Text>
                    } 
                    <Image source={require('../../../assets/images/arrow.png')} style={{width:20, height:20}}></Image>
                </View>
            </View>
        </TouchableOpacity>  
    );

    return (
        <View style={styles.baseView}>
            <View style={{margin:20}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image source={{uri: route.params.family.profileUrl}} style={styles.profileImageTop} PlaceholderContent={<ActivityIndicator />}></Image>
                    <Text style={{flex:1,fontFamily:'Roboto-Bold', fontSize:24, marginLeft:20}}>{route.params.family.firstName}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{marginTop:20, flex:1}}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 20 }}>Age: {calculateAge(route.params.family.dob)}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 20, marginTop: 20}}>Status: </Text>
                            {
                            route.params.family.isActive ?
                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 20, marginTop: 20, color:'green' }}>Active</Text>
                                :
                                <Text style={{fontFamily:'Roboto-Medium', fontSize:20, marginTop:20, color:'red'}}>Inactive</Text>
                            }
                        </View>
                    </View>
                    {route.params.MyFamily ?
                    <TouchableOpacity onPress={() => onSelectChat()} style={{backgroundColor:'#0fd683', width:120, height:35, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6}}>
                        <Image source={require('../../../assets/images/chat.png')} style={{width:20, height:20, resizeMode:'contain'}}></Image>
                        <Text style={{fontFamily:'Roboto-Regular', fontSize:14, color:'white', marginLeft:10}}>Chat Now</Text>
                    </TouchableOpacity>
                    :null}
                </View>
            </View>
            <FlatList
                style={styles.FlatListStyle}
                data={data.sessions}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'index' + index}
                onEndReachedThreshold={0.01}
                onEndReached={info => {
                    loadMoreResults(info);
                }}
            />
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
        marginHorizontal:20
    },
})

export default FamilySessionsTherapist