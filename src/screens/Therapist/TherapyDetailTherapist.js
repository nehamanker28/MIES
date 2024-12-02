import React, {useState} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import GreenButton from '../../components/GreenButton'
import { calculateAge, calculateDuration } from '../../Common/Utility'
import { Image } from 'react-native-elements'
import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import moment from 'moment'

const TherapyDetailTherapist = ({route}) => {

    const [data, setData] = useState({
        sessions: [],
        isLoading: false,
        family:route.params.therapy
    })

    return (
        <View style={{ flex: 1, margin: 30 }}>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ fontFamily: 'Roboto-Light', fontSize: 22, flex: 0.7 }}>Date</Text>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 22, textAlign: 'Right' }}>{moment(route.params.therapy.startDateTime).format('MM-DD-YYYY')}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ fontFamily: 'Roboto-Light', fontSize: 22, flex: 0.7 }}>Therapy</Text>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 22, textAlign: 'Right' }}>{route.params.therapy.therapy.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ fontFamily: 'Roboto-Light', fontSize: 22, flex: 0.7 }}>Duration</Text>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 22, textAlign: 'Right' }}>{calculateDuration(route.params.therapy.startDateTime, route.params.therapy.endDateTime)}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ fontFamily: 'Roboto-Light', fontSize: 22, flex: 0.7 }}>Total</Text>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 22, textAlign: 'Right' }}>No cost</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ fontFamily: 'Roboto-Light', fontSize: 22, flex: 0.7 }}>Status</Text>
                {
                    (item.status === 'PENDING') ?
                        <Text style={styles.text21}>{item.status}</Text>
                        :
                        (item.status === 'UP_COMING') ?
                            <Text style={styles.text21}>Up coming</Text>
                            :
                            (item.status === 'IN_PROGRESS') ?
                                <Text style={styles.text21}>In Progress</Text>
                                :
                                (item.status === 'NOT_COMPLETED') ?
                                    <Text style={styles.text21}>Not Completed</Text>
                                    :
                                    (item.status === 'COMPLETED') ?
                                        <Text style={styles.text21}>Completed</Text>
                                        :
                                        (item.status === 'MISSED') ?
                                            <Text style={styles.text21}>Missed</Text>
                                            :
                                            (item.status === 'CANCELLED') ?
                                                <Text style={styles.text21}>Cancelled</Text>
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
    text21 :{
        fontFamily :'Roboto-Regular',
        fontSize : 16,
        color : 'black',
        marginTop :15,
        textAlign : 'right'
    },
})

export default TherapyDetailTherapist