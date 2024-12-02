import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import GreenButton from '../../components/GreenButton'
import { calculateAge, isPast } from '../../Common/Utility'
import { Image } from 'react-native-elements'
import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import moment from 'moment'

const FamilySessionsInterpreter = ({route, navigation}) => {

    const [data, setData] = useState({
        sessions: [],
        isLoading: false,
        family:route.params.family
    })

    const onSelectChat = () => {
        // //console.log(route.params.family.familyMember)
        //navigation.navigate('ChatScreen',{'reciever' : route.params.family.familyMember})
        //console.log(route.params.family.familyMember)
        let sender = 'INTERPRETER-'+route.params.interpreterId 
        let recieverROLE = 'FAMILY-' + route.params.family.parent.userProfile.id + '-' + route.params.family.familyMember.id
        //console.log('receiver',sender,recieverROLE)
        navigation.navigate('ChatScreen', {sender: sender,reciever: recieverROLE,name :route.params.name,receiverName:route.params.family.familyMember.firstName});
    }

    const getSessionsByDate = () => {

        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getSessionForInterpreter + '?familyId=' + route.params.family.familyMember.id, 'GET')
        .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        ...data,
                        sessions: response.data.content,
                        isLoading: false
                    })
                    ////console.log('content detail--->>',response.data.content)
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    useEffect(() => {
        getSessionsByDate()
        return () => {
            
        }
    }, [])

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ flex: 1, marginVertical: 15 }} onPress={() => {
            navigation.push('TherapyDetail', {'therapy':item})
        }}>
            <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
                <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 20 }}>{ item.therapy.name }</Text> 
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 , marginTop:10}}>{ moment(item.startDateTime).format('MM-DD-YYYY') }</Text>
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
                    <Image source={{uri: route.params.family.familyMember.profileUrl}} style={styles.profileImageTop} PlaceholderContent={<ActivityIndicator />}></Image>
                    <Text style={{flex:1,fontFamily:'Roboto-Bold', fontSize:24, marginLeft:20}}>{route.params.family.familyMember.firstName}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{marginTop:20, flex:1}}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 20 }}>Age: {calculateAge(route.params.family.familyMember.dob)}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 20, marginTop: 20}}>Status: </Text>
                            {
                            route.params.family.familyMember.isActive ?
                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 20, marginTop: 20, color:'green' }}>Active</Text>
                                :
                                <Text style={{fontFamily:'Roboto-Medium', fontSize:20, marginTop:20, color:'red'}}>Inactive</Text>
                            }
                        </View>
                    </View>
                    <View style={{width:150}}>
                        <GreenButton text='Chat Now' onMethod={onSelectChat} />
                    </View>
                </View>
            </View>
            <FlatList
                        style={styles.FlatListStyle}
                        data={data.sessions}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => 'index'+index}
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

export default FamilySessionsInterpreter