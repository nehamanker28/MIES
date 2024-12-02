import React from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Button } from 'react-native'
import GreenButton from '../../components/GreenButton'


const DeleteSessionTherapist = ({ navigation }) => {

    const doSubmit = () => {

    }

    const onCancel = () => {
         navigation.pop()
    }

    return (
        <ScrollView style={{flex:1, backgroundColor:'white'}}>
            <View style={{ margin: 25, flex: 1, backgroundColor: 'white' }}>
                <View style={{flex:1}}>
                <View style={{ flexDirection: 'row', alignItems:'center', marginTop:20 }}>
                    <Image source={require('../../../assets/images/calendar.png')} style={{width:30, height:30}}></Image>
                    <Text style={{ marginLeft: 20, fontSize:23, fontFamily:'Roboto-Medium'}}>25 September 2020</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems:'center', marginTop:25 }}>
                    <Image source={require('../../../assets/images/clock_block.png')} style={{width:30, height:30}}></Image>
                    <Text style={{ marginLeft: 20, fontSize:23, fontFamily:'Roboto-Medium'}}>06:00 AM to 07:00 AM</Text>
                </View>
                    
                <View style={{marginTop:30}}>
                    <Text style={{ fontSize: 22, fontFamily: 'Roboto-Bold' }}>Reason</Text>
                    <View style={{borderWidth:1, borderColor:'gray', height:200, borderRadius:10, marginVertical:20}}>
                        <TextInput></TextInput>
                    </View>
                </View>
                </View>
                <View style={{justifyContent:'flex-end'}}>
                    <GreenButton text='Submit' onMethod={() => { doSubmit() }} />
                    <TouchableOpacity style={{marginTop:20}} onPress={ () => { onCancel()}}>
                        <View style={{ borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, justifyContent:'center', alignItems:'center' }}>
                            <Text style={{fontSize:18, fontFamily:'Roboto-Bold'}}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}


export default DeleteSessionTherapist