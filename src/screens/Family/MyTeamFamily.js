import React, {useEffect, useState} from "react";
import {getApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import DropDownPicker from 'react-native-dropdown-picker';

//Import all required component
import {
    StyleSheet,
    View,
    Text,
   
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import colors from "../../Common/Colors";
import { useIsFocused } from "@react-navigation/native";
import {ShowAlert, ShowLoader} from '../../Common/Helper'
import { da } from "date-fns/locale";
import {Image} from 'react-native-elements';

const QueriesArray = [
    {id: '1',name :'Dr. Jennifer',value :'Speech Language Pathologist',image :require('../../../assets/images/sampleProfilePic.png' )},
    {id: '2',name :'Dr. Jennifer',value :'Speech Language Pathologist',image :require('../../../assets/images/sampleProfilePic.png' )},
    {id: '3',name :'Gina Lee',value :'English',image :require('../../../assets/images/sampleProfilePic.png' )},
  
];


const MyTeamFamily = (props) => {
    const [TeamArray,setTeamArray] = useState([0])
    const [ChildTeam,setChildTeamArray] = useState([])
    const [FirstChild,setFamilyChild] = useState(null)
    const [familyMember,setFamilyMember] = useState ([])
    const [familyMemberID,setfamilyMemberID] = useState(0)
    const [therapistTeam,settherapistTeam] = useState ([])
    const [interpreterTeam , setInterpreterTeam] = useState([])
    const [ChildName,setChildName] = useState('')
    const [data, setData] = useState({
        isLoading: false
    })
    const [familyUserProfileID, setfamilyUserProfileID] = useState(0)
    const [Team,setTeam] = useState({
        ChildName :'',
        familyMemberId : 0,
        therapistId : 0,
        therapistName: '',
        serviceID: 0,
        services :[],
        
    })
     const isFocused = useIsFocused();
    let unmounted = false;
    const ItemSeparatorView = () => {
    return (
      // FlatList Item Separator
      <View
          style={{
              height: 2,
              margin :10,
              backgroundColor: '#d8e4f1'
          }}
      />
    );
    };
    useEffect(() => {
        ////console.log('test------>>>');
        getFamilyProfile()
        return () => {
            unmounted = true
        }
    }, [])

    const getFamilyProfile = () => {
        ////console.log("calling Api")
        setData({
            ...data,
            isLoading:true
        })
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamilyProfile, 'GET')
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                   // //console.log('Response',response.data.familyMembers[0].familyMemberTherapies[0].therapist.therapistServices)
                    if (!unmounted) {
                        setData({
                            ...data,
                            isLoading:false
                        })
                        setfamilyUserProfileID(response.data.userProfile.id)
                        StoreMyTeam(response.data.familyMembers)
                        //setUserProfile(response.data.userProfile)
                        ////console.log('name --->>>', response.data.userProfile.id)
                        // getTodaySessions(todayDate)
                         //storeData(response.data)
                        //  setTeamArray(response.data.familyMembers)
                        //  //console.log("TeamArray --->",TeamArray)
                    }
                } else {

                    ShowAlert(response.message)
                }
            })
    }
    const StoreMyTeam = async(data)=>{
       
        data?.map((item, index) => {
         console.log("itemmmmmm",item.firstName)
            item?.familyMemberTherapies.map((familyTherapy, index) => {
                //console.log("therapy = ",familyTherapy.therapist.userProfile.firstName)
                therapistTeam.push({ 
                    id: familyTherapy.therapist.userProfile.id,
                    name:familyTherapy.therapist.userProfile.firstName +' ' +familyTherapy.therapist.userProfile.lastName,
                    email:familyTherapy.therapist.userProfile.email,
                    phone:familyTherapy.therapist.userProfile.phone, 
                    profilePicUrl:familyTherapy.therapist.userProfile.profilePicUrl, 
                    //serviceID:familyTherapy.therapist.therapistServices[0].therapy.id, 
                    services : familyTherapy.therapy,
                    description:familyTherapy.therapy.description })
            })
            //console.log("interrr",item.interpreter)
            if (item.interpreter != null){
                interpreterTeam.push({id: item.interpreter.userProfile.id,
                    name :item.interpreter.userProfile.firstName +' ' + item.interpreter.userProfile.lastName,
                    email:item.interpreter.userProfile.email,
                    phone:item.interpreter.userProfile.phone,
                    profilePicUrl :item.interpreter.userProfile.profilePicUrl,
                    services:[],
                    //image :require('../../../assets/images/sampleProfilePic.png'),
                    description : "Interpreter"})
                }
        const interest = [...therapistTeam, ...interpreterTeam];
        empty()
        setTeamArray(interest)
        familyMember?.push({id: item.id,
            label :item.firstName +' ' +item.lastName,
            value  :item.id,
            Team : interest,
            })
          
            console.log("FamilyMember==",familyMember)
        })
        setFamilyChild(familyMember[0].label)
        setFamilyMember(familyMember)
        setChildTeamArray(familyMember[0].Team)
        getFamilyMyTeam(familyMember[0])

       // console.log('TeamArray ------>',TeamArray)
    }
const storeData = async (Data) =>{
    // //console.log('Family Members ------>',Data)
      var family = Data.familyMembers
   
  
        family?.map((item, index) => {
            familyMember?.push({id: item.id,
                label :item.firstName +' ' +item.lastName,
                value  :item.id
                })
        })
  
    setFamilyMember(familyMember)
    setFamilyChild(familyMember[0].label)
    //console.log('Family Members ------>',familyMember)
    getFamilyMyTeam(familyMember[0])
    
    }

    const renderItem = ({ item }) => (
        <View style = {{flexDirection : 'row',margin :10}}>
            {/* <Image source={item.image}
            style = {{width:90,height:90,borderRadius:40,marginTop:20}}></Image>   */}
           
                {item.profilePicUrl ?
            <Image
              source={{uri: item.profilePicUrl}}
              style={styles.profileImageTop}
            />
            :
           <Image source={require('../../../assets/images/defaultprofile.png')} 
           style = {styles.profileImageTop}></Image>
            }
            <View style = {{margin :10,flex:1}}>
                <Text style = {styles.text2}>{item.name}</Text>
                <Text style = {styles.text1}>{item.description}</Text>
                <TouchableOpacity style = {{marginTop :20}}
                onPress = {() =>  onPressDetails(item)}>
                <Text style = {{color :'#387af6',textDecorationLine :'underline',fontSize :18}}>Detail</Text>      
                </TouchableOpacity>
            </View>
        </View>
        
    );
    const onPressDetails = (item) => {
        console.log('item ------->>>',familyUserProfileID)
         setTeam({
            ...Team,
            therapistId: item.id,
            therapistName: item.name,
            serviceID: item.serviceID,
            services :item.services,
    // }
        })
        console.log('team===',Team)
        props.navigation.navigate('MyTeamDetailsFamily',{'item':item,
        'team' :Team,
        familyUserProfileID: familyUserProfileID,
        therapistId:item.id,
        therapistName:item.name,
        serviceID: item.serviceID,
        services :item.services,
    })
    }

    const getFamilyMyTeam = (id) => {
        setChildName(id.label)
       
        setTeam({
            ...Team,
            ChildName : id.label,
            familyMemberId :id.value,
        })
        // getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamilyDetailByChildID + '?familyMemberId=' + id.value, 'GET')
        //     .then(response => {
        //         if (response.code >= 200 && response.code <= 299) {
                  
        //             if (!unmounted) {
                      
        //                 // StoreMyTeamData(response.data)
        //                  console.log('My Team Response :',response.data)
        //             }
        //         } else {

        //             ShowAlert(response.message)
        //         }
        //     })
    }
    function empty() {
        //empty your array
        therapistTeam.length = 0;
        interpreterTeam.length = 0 ;
    }
    const StoreMyTeamData = (data) =>{
        var team = data
       
        empty()
        var therapist = team.therapists
        var interpreter = team.interpreter
        therapist.map((item, index) => {
            therapistTeam.push({ id: item.userProfile.id,
                name:item.userProfile.firstName +' ' +item.userProfile.lastName,
                email:item.userProfile.email,
                phone:item.userProfile.phone, 
                profilePicUrl:item.userProfile.profilePicUrl, 
                serviceID:item.therapistServices[0].therapy.id, 
                services : item.therapistServices,
                description:item.therapistServices[0].therapy.description })
        })
        // for(i=0; i < therapist.length; i++){
        //     if (therapistTeam.length == 0){
        //     //console.log("lenghth -------= ",therapist)
        //     therapistTeam.push({id: therapist[i].userProfile.id,
        //         name :therapist[i].userProfile.firstName +' ' +therapist[i].userProfile.lastName,
        //         email:therapist[i].userProfile.email,
        //         phone:therapist[i].userProfile.phone,
        //         //image :require('../../../assets/images/sampleProfilePic.png'),
        //         profilePicUrl :therapist[i].userProfile.profilePicUrl,
        //         serviceID : therapist[i].therapistServices[0].therapy.id,
        //         description:therapist[i].therapistServices[0].therapy.description})
        //     }else {
        //        if(therapistTeam[i-1].id != therapist[i].userProfile.id )
        //        therapistTeam.push({id: therapist[i].userProfile.id,
        //         name :therapist[i].userProfile.firstName +' ' + therapist[i].userProfile.lastName,
        //         email:therapist[i].userProfile.email,
        //         phone:therapist[i].userProfile.phone,
        //         //image :require('../../../assets/images/sampleProfilePic.png'),
        //         profilePicUrl :therapist[i].userProfile.profilePicUrl,
        //         serviceID : therapist[i].therapistServices[0].therapy.id,
        //         description:therapist[i].therapistServices[0].therapy.description})
        //     }

        // }
        settherapistTeam(therapistTeam)
        console.log('interpreter------>',therapistTeam)
        // interpreter.map((item, index) => {
        //     interpreterTeam.push({ id: item.userProfile.id,
        //         name:item.userProfile.firstName +' ' +item.userProfile.lastName,
        //         email:item.userProfile.email,
        //         phone:item.userProfile.phone, 
        //         profilePicUrl:item.userProfile.profilePicUrl, 
        //         //serviceID:item.therapistServices[0].therapy.id, 
        //         services : item.therapistServices[0],
        //         description:"Interpreter" })
        // })
        //     if (interpreterTeam.length == 0  ){
            if (interpreter != null){
            interpreterTeam.push({id: interpreter.userProfile.id,
                name :interpreter.userProfile.firstName +' ' + interpreter.userProfile.lastName,
                email:interpreter.userProfile.email,
                phone:interpreter.userProfile.phone,
                profilePicUrl :interpreter.userProfile.profilePicUrl,
                services:[],
                //image :require('../../../assets/images/sampleProfilePic.png'),
                description : "Interpreter"})
            }
        
        //     else {
        //        if(interpreterTeam[0].id != interpreter.userProfile.id )
        //        interpreterTeam.push({id: interpreter.userProfile.id,
        //         name :interpreter.userProfile.firstName +' ' + interpreter.userProfile.lastName,
        //         email:interpreter.userProfile.email,
        //         phone:interpreter.userProfile.phone,
        //         //image :require('../../../assets/images/sampleProfilePic.png'),
        //         profilePicUrl :interpreter.userProfile.profilePicUrl,
        //         description : "Interpreter"})
        //     }

        
        setInterpreterTeam(interpreterTeam)
        ////console.log('Interpreter------>',therapistTeam[0].image)
        const interest = [...therapistTeam, ...interpreterTeam];
        setTeamArray(interest)
        console.log('TeamArray ------>',TeamArray.services)
    }
    return (
        <View style={styles.container}>

        <View style = {{padding : 20}}>
        <Text style = {{ fontFamily :'Roboto-Bold',fontSize : 20,color : colors.BLACK,marginTop :10,}}>Select Child </Text>
        <DropDownPicker
            items={familyMember}
                   placeholder = {FirstChild}
                     placeholderStyle = {{color :colors.BLACK,fontSize :18}}
                     defaultIndex={0}
                     containerStyle={{height: 40,marginTop :20}}
                     labelStyle = {{color :colors.BLACK}}
                     arrowStyle = {{backgroundColor :colors.TEXT_BLUE,height :40,width :40,alignItems :'center',justifyContent :'center',borderRadius:5,marginRight:-10}}
                     arrowColor = {colors.WHITE}
                     itemStyle = {{justifyContent : 'flex-start'}}
                     onChangeItem={item => 
                    { 
                     setChildTeamArray(item.Team)   
                     setChildName(item.label)
       
                     setTeam({
                     ...Team,
                        ChildName : item.label,
                        familyMemberId :item.value,
                    })}
       }
                    />
        <FlatList
                    //horizontal={true}
                    nestedScrollEnabled = {true}
                    style={styles.FlatListStyle}
                    data={ChildTeam}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item +index}
                    ItemSeparatorComponent = {ItemSeparatorView}
                /> 
        </View>
  
            {/* <View>
                <Text> My Team </Text>
            </View> */}
        </View>
    );
   }
   const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        
    },
   
  FlatListStyle: {
    backgroundColor: 'white',
    
    //height:150,
    },
    text1 :{
        fontFamily :'Roboto',
        fontSize : 20,
        color : colors.BLACK,
        marginTop :10,
    },
    text2 :{
        fontFamily :'Roboto-Bold',
        fontSize : 20,
        color : colors.BLACK,
        marginTop :10,
        flex :1,
    },
    text3 :{
        fontFamily :'Roboto',
        fontSize : 16,
        color : colors.GREY,
    },
    profileImageTop :{
        width : 80,
        height :80,
        borderRadius: 110 / 2,
        borderColor: colors.LIGHT_GRAY,
        borderWidth: 3,
        marginTop:20
        
    }
   
})
   export default MyTeamFamily