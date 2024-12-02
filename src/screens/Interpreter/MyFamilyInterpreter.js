
import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity ,TextInput,Platform} from 'react-native'
import SearchBar from 'react-native-search-bar';
import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import colors from '../../Common/Colors';
import Icon from "react-native-vector-icons/MaterialIcons";

const MyFamilyInterpreter = (props) => {

    const arr = [1, 2, 3, 4, 5, 6, 7, 8]
    const [data, setData] = useState({
        content: [],
        isLoading: false,
        search : '',
    })
    const [interpreterId,setinterpreterId] = useState(0)
    const [interpreterName,setinterpreterName] = useState('')
    const [search ,setSearch] = useState('')

    const updateSearch = (val) => {
        //console.log('update', val)
       searchFamilyByName(val)
    
    };
    
    const onPressSearch = (val) => {
        ////console.log('onPress',val)
    };
    
    const onPressCancel = () => {
        //console.log('onCancel')
    };

    const searchFamilyByName = (text) => {
        setData({
            ...data,
            isLoading:true
        })
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getInterpreterFamily + '?name='+text, 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        ...data,
                        content: response.data.content,
                        isLoading:false
                    })
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    const getFamily = () => {
        setData({
            ...data,
            isLoading:true
        })
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getInterpreterFamily, 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        ...data,
                        content: response.data.content,
                        isLoading:false,
                        search :false,
                    })
                } else {
                    ShowAlert(response.message)
                }
            })
    }
    const getInterpreterProfile = () => {
        
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getInterpreterProfile, 'GET')
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setinterpreterId(response.data.userProfile.id)
                    setinterpreterName(response.data.userProfile.firstName)

                } else {
                    ShowAlert(response.message)
                }
            })
    }
    const viewFamilySessions = (item) => {
        props.navigation.push('FamilySession', {'family':item,interpreterId:interpreterId,name :interpreterName})
    }

    const viewFamilyDetail = (item) => {
        props.navigation.push('FamilyDetailInterpreter', {'family':item,interpreterId:interpreterId,name :interpreterName})
    }

    useEffect(() => {
        getFamily()
        getInterpreterProfile()
        return () => {
            
        }
    }, [data.search])
    
    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ flex: 1 }} onPress={ () => viewFamilyDetail(item) }>
            <View style={{ flexDirection: 'row', padding: 20}}>
                
                <View style={{flex:1, flexDirection:'row'}}>
                    <Image source={{uri: item.familyMember.profileUrl}} style={styles.profileImage}></Image>
                    <View style={{ justifyContent:'center', paddingLeft:10,flex:1}}>
                        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 18  }}>{item.familyMember.firstName}</Text>
                        {
                            item.familyMember.isActive ?
                                <Text style={{ fontFamily: 'Roboto-Regular', color: '#0fc67a', fontSize: 16 }}>Active</Text>
                                :
                                <Text style={{ fontFamily: 'Roboto-Regular', color: '#f5463f', fontSize: 16 }}>Inactive</Text>
                        }
                    </View>
                </View>

                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', alignContent:'space-between'}}>
                    <TouchableOpacity onPress={ () => viewFamilySessions(item)}>
                        <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#387af6'}}>Sessions</Text>
                        <View style={{height:1, backgroundColor:'#387af6'}}></View>
                    </TouchableOpacity>
                    <Image source={require('../../../assets/images/arrow.png')} style={{width:20, height:20, marginLeft:10}} resizeMode='contain'></Image>
                </View>

            </View>
            <View style={{height:1, backgroundColor:'gray'}}></View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <View style={styles.container}>
                {/* <Text>My Family list</Text> */}
                <View style = {{flexDirection :'row',justifyContent:'space-around',paddingVertical:10,margin:10}}>

              
<View style={styles.input}>
              {/* <Image source={require('../../../assets/images/search.png')}
                  style={styles.searchStyle}
                  tintColor={colors.GREY} /> */}
   <TextInput
                  style={{flex:1, marginStart:10, fontSize: 16,color:colors.BLACK }}
                 // underlineColorAndroid={'#00000000'}
                  placeholder= 'Search Here ...'
                  onChangeText={(value) => setSearch(value)}
                  value={search}
                  onSubmitEditing={() =>
                      updateSearch(search)
                  }
              />
              {search != null && <Icon
                  style={styles.icon}
                  name="clear"
                  size={20}
                  color={colors.GREY}
                  onPress={() => {
                      console.log('searchingggg')
                      setSearch('') 
                      updateSearch('')
                 }
                 }
              />}
             <TouchableOpacity onPress={() => updateSearch(search)} style={{flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6,padding:10}}>
                        <Image source={require('../../../assets/images/search.png')} style={{width:20, height:20, resizeMode:'contain',tintColor:colors.BLACK}}></Image>
                       
                    </TouchableOpacity>
          </View>
          </View>
                <FlatList style={{backgroundColor:'white'}} data={data.content} renderItem={renderItem} keyExtractor={(item,index) => 'item'+index} />
            </View>
            {
                    data.isLoading ? ShowLoader() : null
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    profileImage :{
        width : 65,
        height: 65,
        borderRadius: 40,
        borderColor: 'white',
        borderWidth: 3,
    },
    input: {
        backgroundColor: '#f8f8f8',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
       // padding:20,
        marginTop:5,
        flex:1,
        justifyContent :'space-between'
        
    },
    icon: {
        zIndex: 999,
        margin:5,
    },
    searchStyle: {
        resizeMode: 'contain',
        height: 20,
     //  width: 100,
       // marginStart: -20
    },
})



export default MyFamilyInterpreter