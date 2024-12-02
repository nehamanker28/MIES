import React, {useEffect} from 'react'
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import GreenButton from '../../components/GreenButton'

const FamilyDetailInterpreter = ({ route, navigation }) => {
    
    useEffect(() => {
        ////console.log('de------>>>',route.params.family.familyMember.familyMemberTherapies)
        return () => {
            
        }
    }, [])

    const addNewSession = () => {

    }
    const onSelectChat = () => {
        //console.log(route.params.family.familyMember)
        let sender = 'INTERPRETER-'+route.params.interpreterId 
        let recieverROLE = 'FAMILY-' + route.params.family.parent.userProfile.id + '-' + route.params.family.familyMember.id
        //console.log('receiver',sender,recieverROLE)
        navigation.navigate('ChatScreen', {sender: sender,reciever: recieverROLE,name :route.params.name,receiverName:route.params.family.familyMember.firstName});
    }
    const goToSessions = () => {
        navigation.push('FamilySession', {'family':route.params.family})
    }

    return (
        <ScrollView style={{flex:1, backgroundColor:'#ffffff'}}>
            <View style={{ flex: 1, backgroundColor: '#ffffff' , margin: 20}}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems:'center'}}>
                    <Image source={{uri: route.params.family.familyMember.profileUrl}} style={{ width : 80,
        height :80,
        borderRadius: 110 / 2, resizeMode:'contain'}}></Image>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 24, color: '#012770', marginLeft: 10 }}>{  }</Text>
                </View>
                <View style={{ flex: 1,flexDirection: 'row', marginVertical:10, paddingTop:15 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248'}}>Age: {route.params.family.familyMember.age} yrs</Text>
                        <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248', marginTop:10}}>Status: {route.params.family.familyMember.active ? 'true' : 'false'}</Text>
                    </View>
                    <TouchableOpacity 
                    onPress = {() => onSelectChat()}
                    style={{backgroundColor:'#0fd683', width:120, height:35, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6}}>
                        <Image source={require('../../../assets/images/chat.png')} style={{width:20, height:20, resizeMode:'contain'}}></Image>
                        <Text style={{fontFamily:'Roboto-Regular', fontSize:14, color:'white', marginLeft:10}}>Chat Now</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginVertical:20}}>
                    <Text style={{fontFamily:'Roboto-Light', fontSize:18, color:'#414141'}}>
                        { route.params.family.familyMember.about }</Text>
                </View>
                <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Parent Information</Text>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>{route.params.family.parent.userProfile.firstName} / {route.params.family.parent.relationship}</Text>
                </View>
                <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Email</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248'}}>{route.params.family.parent.userProfile.email}</Text>
                </View>
                <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Phone No.</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248'}}>{route.params.family.familyMember.phone}</Text>
                </View>
                <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Languages</Text>
                    {
                        route.params.family.parent.languages.map((item, index) => {
                            return (
                                <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248', marginTop:5}}>{item.languageName}</Text>
                            )
                        })
                    }
                    
                </View>
                <View style={{paddingTop:25, paddingBottom:10}}>
                {/* <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginBottom: 20, justifyContent:'center'}} onPress = { () => goToSessions()}>
                    <Text style={{fontFamily:'Roboto-Bold', fontSize:16, textAlign:'center', fontWeight:'bold', color:'#387af6'}}>Sessions</Text>
                </TouchableOpacity> */}
                <GreenButton text='Sessions' onMethod={() => goToSessions()}/>
            </View>
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({

})

export default FamilyDetailInterpreter

