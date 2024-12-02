import React, {useState} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import GreenButton from '../../components/GreenButton'
import { calculateAge, calculateDuration } from '../../Common/Utility'
import { Image } from 'react-native-elements'
import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import moment from 'moment'

const TherapyDetailInterpreter = ({route}) => {

    const [data, setData] = useState({
        sessions: [],
        isLoading: false,
        family:route.params.therapy
    })

    return (
        <View style = {{flex:1, margin:30}}>
            <View style = {{flexDirection:'row', marginTop:30}}>
                <Text style={{fontFamily:'Roboto-Light', fontSize:22, flex:0.7}}>Date</Text>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 22, textAlign:'left'}}>{ moment(route.params.therapy.startDateTime).format('MM-DD-YYYY') }</Text>
            </View>
            <View style = {{flexDirection:'row', marginTop:30}}>
                <Text style={{fontFamily:'Roboto-Light', fontSize:22, flex:0.7}}>Therapy</Text>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 22, textAlign:'left'}}>{ route.params.therapy.therapy.name }</Text>
            </View>
            <View style = {{flexDirection:'row', marginTop:30}}>
                <Text style={{fontFamily:'Roboto-Light', fontSize:22, flex:0.7}}>Duration</Text>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 22 }}>{ calculateDuration(route.params.therapy.startDateTime, route.params.therapy.endDateTime)}</Text>
            </View>
            <View style = {{flexDirection:'row', marginTop:30}}>
                <Text style={{fontFamily:'Roboto-Light', fontSize:22, flex:0.7}}>Total</Text>
                <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>No cost</Text>
            </View>
            <View style = {{flexDirection:'row', marginTop:30}}>
                <Text style={{fontFamily:'Roboto-Light', fontSize:22, flex:0.7}}>Status</Text>
                {/* <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>{ route.params.therapy.status }</Text> */}
                {
                    (route.params.therapy.status === 'PENDING') ?
                        <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>{item.status}</Text>
                        :
                        (route.params.therapy.status === 'UP_COMING') ?
                            <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>Up coming</Text>
                            :
                            (route.params.therapy.status === 'IN_PROGRESS') ?
                                <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>In Progress</Text>
                                :
                                (route.params.therapy.status === 'NOT_COMPLETED') ?
                                    <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>Not Completed</Text>
                                    :
                                    (route.params.therapy.status === 'COMPLETED') ?
                                        <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>Completed</Text>
                                        :
                                        (route.params.therapy.status === 'MISSED') ?
                                            <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>Missed</Text>
                                            :
                                            (route.params.therapy.status === 'CANCELLED') ?
                                                <Text style={{fontFamily:'Roboto-Regular', fontSize:22}}>Cancelled</Text>
                                                :
                                                null
                }
            </View>
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

export default TherapyDetailInterpreter