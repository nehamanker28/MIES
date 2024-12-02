import React, {useEffect , useState , useRef} from 'react'
import { View, StyleSheet, Text, ScrollView, Image ,FlatList,SectionList,Platform} from 'react-native'
import { TouchableOpacity} from 'react-native-gesture-handler'
import GreenButton from '../../components/GreenButton'
import Collapsible from 'react-native-collapsible';
import styles from '../../Common/styles';
import colors from '../../Common/Colors';
import { calculateAge, isPast } from '../../Common/Utility'

const FamilyDetailTherapist = ({ route, navigation }) => {
    const TherapistArray = [
        {
          id: '1',
          value: 'Payment Info',
          image: require('../../../assets/images/profile_icons/MyResources.png'),
        },
    ];
    const [thcollapsed, setthCollapsed] = useState(true);
    const [Insurancecollapsed, setInsuranceCollapsed] = useState(true);
    const [icdcollapsed,seticdcollapsed] = useState(true)
    const [insuranceDetailDtoList,setinsuranceDetailDtoList] = useState([])

    useEffect(() => {
        const ilDtoList = route.params.parent?.familyMembers?.map(row => row?.insuranceDetailDtoList)
       setinsuranceDetailDtoList(ilDtoList)
        return () => {
            
        }
    }, [])
    const toggleExpanded = () => {
        // Toggling the state of single Collapsible
        setthCollapsed(!thcollapsed);
      };
    const toggleExpandedInsurance = () => {
        // Toggling the state of single Collapsible
        setInsuranceCollapsed(!Insurancecollapsed);
      };
    const toggleExpandedICD = () => {
        seticdcollapsed(!icdcollapsed);
      };
    const addNewSession = () => {
        navigation.navigate('Add Session',{'family':route.params.family, 'isFamilySelected':true});
    }

    const goToSessions = () => {
        navigation.push('FamilySession', {'family':route.params.family})
    }
    const onSelectChat = () => {
        console.log(route.params.family)
        // //console.log('Chat Now');
        let sender = 'THERAPIST-'+route.params.therapistId 
        let recieverROLE = 'FAMILY-' + route.params.parent.userProfile.id + '-' + route.params.family.id
        console.log('reciver',sender,recieverROLE)
        navigation.navigate('ChatScreen', 
        {   sender: sender,
            reciever: recieverROLE,
            name :route.params.name,
            receiverName:route.params.family.firstName});
        //navigation.navigate('ChatScreen',{'reciever' : route.params.family})
    }


    return (
        <ScrollView style={{flex:1, backgroundColor:'#ffffff'}}>
            <View style={{ flex: 1, backgroundColor: '#ffffff' , margin: 20}}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems:'center'}}>
                    <Image source={{uri: route.params.family.profileUrl}} style={{ width : 80,
        height :80,
        borderRadius: 110 / 2, resizeMode:'contain'}}></Image>
                    <Text style={{flex:1, fontFamily: 'Roboto-Bold', fontSize: 24, color: '#012770', marginLeft: 10 }}>{ route.params.family.firstName }</Text>
                </View>
                <View style={{ flex: 1,flexDirection: 'row', marginVertical:10, paddingTop:15 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248'}}>Age:  {calculateAge(route.params.family.dob)}</Text>
                        <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248', marginTop:10}}>Status: {route.params.family.active ? 'Active' : 'Inactive'}</Text>
                    </View>
                    {route.params.MyFamily ?
                    <TouchableOpacity onPress={() => onSelectChat()} style={{backgroundColor:'#0fd683', width:120, height:35, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6}}>
                        <Image source={require('../../../assets/images/chat.png')} style={{width:20, height:20, resizeMode:'contain'}}></Image>
                        <Text style={{fontFamily:'Roboto-Regular', fontSize:14, color:'white', marginLeft:10}}>Chat Now</Text>
                    </TouchableOpacity>
                    :
                    null}
                </View>
                <View style={{marginVertical:20}}>
                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>About :</Text>
                    <Text style={{fontFamily:'Roboto-Light', fontSize:18, color:'#414141'}}>
                        { route.params.family.about }</Text>
                </View>
                <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Parent Information</Text>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248',marginTop:0}}>{route.params.parent.userProfile.firstName} / {route.params.parent.relationship}</Text>
                </View>
                <View style={{marginVertical:26}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Email</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248'}}>{route.params.parent.userProfile.email}</Text>
                </View>
                <View style={{marginVertical:26}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Phone No.</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248'}}>{route.params.family.phone}</Text>
                </View>
                <View style={{marginVertical:26}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>Languages</Text>
                    {
                        route.params.parent.languages.map((item, index) => {
                            let width = item.languageName.length
                            return (
                                <View style = {{marginVertical:17,backgroundColor:'#d8e4f1',borderRadius:10,alignSelf: 'flex-start',paddingHorizontal:15,paddingVertical:5}}>
                                <Text style={{fontFamily:'Roboto-Light', fontSize:18, color:'#222248', marginTop:5}}>{item.languageName}</Text>
                                </View>
                            )
                        })
                    }
                    
                </View>
              
                {/* Collapsible View */}
                <TouchableOpacity onPress={toggleExpanded} style ={{marginVertical:20}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:10}}>
                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>
               Assigned Therapy
                </Text>
             
               <Image source={require('../../../assets/images/arrow.png')} style={{width:15, height:15,  transform: [{ rotate: '90deg'}],marginTop:10,
               marginLeft:0,tintColor:colors.BLACK}} resizeMode='contain'></Image>
           
              {/*Heading of Single Collapsible*/}
              </View>
              </TouchableOpacity>
          {/*Content of Single Collapsible*/}
            <Collapsible
            collapsed={thcollapsed}
            align="center"
            >
            <ScrollView style={style.content} nestedScrollEnabled = {true}>
            <View style = {{padding:10}}>
            <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Physician NPI Number</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{route.params.family.physicianNpiNumber}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Physician First Name</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{route.params.family.physicianFirstName}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Physician Last Name</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{route.params.family.physicianLastName}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Allergies</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{route.params.family.allergies}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Precautions</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{route.params.family.precautions}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Medications</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{route.params.family.medications}</Text>
                </View>
                
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Interpreter</Text>
                    {route.params.family.interpreter ?
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{route.params.family.interpreter.userProfile.firstName}</Text>
                    :
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>None needed</Text>
}
                </View>
            </View>
            </ScrollView>
            {route.params.filter == 'MyFamily' ? 
            <View>
            {route.params.therapy?.map(item =>   {
                //console.log('Myfamily===',item)
                return(
            <View style={style.content}>
            <View style = {{padding:10}}>
                <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Service Type</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.therapy.name}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Referral Date</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item?.referralDate}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Therapist</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248'}}>{item?.therapist.userProfile.firstName} {item.therapist.userProfile.lastName}</Text>
                </View>
                <View style={{marginVertical:16}}>

                <TouchableOpacity onPress={toggleExpandedICD} style ={{marginVertical:20}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:10}}>
                     <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>ICD 10 Code</Text>
                    <Image source={require('../../../assets/images/arrow.png')} style={{width:15, height:15,  transform: [{ rotate: '90deg'}],marginTop:10,
                     marginLeft:0,tintColor:colors.BLACK}} resizeMode='contain'></Image>
           
              {/*Heading of Single Collapsible*/}
                   </View>
              </TouchableOpacity>
                    <Collapsible
                    collapsed={icdcollapsed}
                     align="center"
                     >
                    {item?.diagnosis?.map(di =>{
                        return(
                            <View style={{flexDirection:'row',flex:1,backgroundColor:colors.LIGHT_BLUE,padding:10}}>
                            <Text style = {{flex:0.5}}>{di.code} - </Text>
                            <Text minimumFontScale = {8} style = {{flex:2}}>{di.description}</Text>
                            </View>
                        )
                    })}
                    </Collapsible>
                </View>
               
              
            </View>
            </View>)})}
            </View>:
            <View>
            {route.params.therapy?.map(ids => ids?.map(item =>  {
                console.log('Allfamily===',item )
                return(
                    <View style={style.content}>
            <View style = {{padding:10}}>
                <View style={{marginVertical:10}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Service Type</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.therapy.name}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Referral Date</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item?.referralDate}</Text>
                </View>
                <View style={{marginVertical:16}}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Therapist</Text>
                    <Text style={{fontFamily:'Roboto-Medium', fontSize:18, color:'#222248'}}>{item?.therapist.userProfile.firstName} {item.therapist.userProfile.lastName}</Text>
                </View>
                <View style={{marginVertical:16}}>

                <TouchableOpacity onPress={toggleExpandedICD} style ={{marginVertical:20}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:10}}>
                     <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>ICD 10 Code</Text>
                    <Image source={require('../../../assets/images/arrow.png')} style={{width:15, height:15,  transform: [{ rotate: '90deg'}],marginTop:10,
                     marginLeft:0,tintColor:colors.BLACK}} resizeMode='contain'></Image>
           
              {/*Heading of Single Collapsible*/}
                   </View>
              </TouchableOpacity>
                    <Collapsible
                    collapsed={icdcollapsed}
                     align="center"
                     >
                    {item?.diagnosis?.map(di =>{
                        return(
                            <View style={{flexDirection:'row',flex:1,backgroundColor:colors.LIGHT_BLUE,padding:10}}>
                            <Text style = {{flex:0.5}}>{di.code} - </Text>
                            <Text minimumFontScale = {8} style = {{flex:2}}>{di.description}</Text>
                            </View>
                        )
                    })}
                    </Collapsible>
                </View>
               
              
            </View>
            </View>
                )
            
            }))}
          </View>
            }
          </Collapsible>
          <TouchableOpacity onPress={toggleExpandedInsurance} style ={{marginVertical:20}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:10}}>
                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 22, color: '#222248' }}>
                Insurance Information
                </Text>
             
               <Image source={require('../../../assets/images/arrow.png')} style={{width:15, height:15,  transform: [{ rotate: '90deg'}],marginTop:10,
               marginLeft:0,tintColor:colors.BLACK}} resizeMode='contain'></Image>
           
              {/*Heading of Single Collapsible*/}
              </View>
              </TouchableOpacity>
          {/*Content of Single Collapsible*/}
         {route.params.filter === 'MyFamily' ?
            <Collapsible
            collapsed={Insurancecollapsed}
            align="center"
            >
            
                { route.params.insuranceDetailDtoList?.map(item => {
                    return(
                        <View style = {style.content}>
                        <View style = {{padding:10}}>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Payee Name</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.payeeName}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Payee Address</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.payeeAddress}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Payee Phone</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.payeePhoneNumber}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Insurance Plan</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.insurancePlan}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Group Number</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.groupNumber}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Type of Insurance</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{item.insuranceType}</Text>
                        </View>
                       
                        </View>
                        </View>
                    )
                })}
                
          </Collapsible>
          :
            <Collapsible
            collapsed={Insurancecollapsed}
            align="center"
            >
            
            {route.params.insuranceDetailDtoList?.map(item => item?.map(ids =>{
                    return(
                        <View style = {style.content}>
                        <View style = {{padding:10}}>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Payee Name</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{ids.payeeName}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Payee Address</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{ids.payeeAddress}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Payee Phone</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{ids.payeePhoneNumber}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Insurance Plan</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{ids.insurancePlan}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Group Number</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{ids.groupNumber}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                             <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, color: '#222248' }}>Type of Insurance</Text>
                             <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#222248'}}>{ids.insuranceType}</Text>
                        </View>
                       
                        </View>
                        </View>
                    )
                })
                )}
          </Collapsible>
          }
          <View>


        </View>
                <View style={{paddingVertical:20, height:100}}>
                {/* <GreenButton text='+ Add New Session' onMethod={() => addNewSession()}/> */}
                <TouchableOpacity  style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, justifyContent: 'center', marginTop: 20}}
                 onPress={() => goToSessions()} >
                    <Text style={{fontFamily:'Roboto-Bold', fontSize:16, textAlign:'center', fontWeight:'bold', color:'#387af6'}}>Sessions</Text>
                </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    content: {
        marginTop:10,
        //padding: 20,
        //paddingHorizontal:20,
       backgroundColor:'#d8e4f1',
       borderRadius:20,
      },
})

export default FamilyDetailTherapist

