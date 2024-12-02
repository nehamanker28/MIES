
import React, {useState, useEffect,useRef} from 'react'
import { View, Text, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity ,Platform,TextInput} from 'react-native'
//import SearchBar from 'react-native-search-bar';
import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import colors from '../../Common/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { ar, da, el } from 'date-fns/locale';
import { useIsFocused } from "@react-navigation/native";
import { SearchBar } from 'react-native-elements';
import Icon from "react-native-vector-icons/MaterialIcons";

const MyFamilyTherapist = (props) => {
    const refSearchBar = useRef();
    //const arr = [1, 2, 3, 4, 5, 6, 7, 8]

    const [data, setData] = useState({
        MyFamily :[],
        MyFiltered :[]
    })

    const [allData, setAllData] = useState({
        AllFamily: [],
        AllFiltered : [],
        maxPage:0,
        search :''
    })
    const [loader, setLoader] = useState(false)

    const [pageNo, setPageNo] = useState(0)
    const [therapistId,settherapistId] = useState(0)
    const [tId ,setTid] = useState(0)
    const [familyFilter,setFamilyFilter] = useState('All')
    const [statusFilter,setStatusFilter] = useState('All')
    const [therapistName,settherapistName] = useState('')
    const isFocused = useIsFocused();
    const [isFilter, setIsFilter] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [search ,setSearch] = useState('')

    useEffect(() => {
        //console.log('isfocu useeffect',isFocused)
        setSearch('')
        if(isFocused){
            getAllFamily()
        }else if(isFocused == false) {
            setAllData({
                AllFamily: [],
                AllFiltered: [],
                maxPage: 0
            })
            setPageNo(0)
        }
        return () => {
            
        }
    }, [isFocused, pageNo])


    useEffect(() => {
        //console.log('isfocu useeffect')
        if(isFocused){
            setSearchText('')
            getFamily()
            getTherapistProfile()
        }
        return () => {
            
        }
    }, [isFocused])

    useEffect(() => {
        doFilter()
        return () => {
            
        }
    }, [familyFilter, statusFilter])

    useEffect(() => {
        if(loader == false || isFilter){
            doFilter()
        }
        
        return () => {
            
        }
    }, [loader, isFilter])


    const updateSearch = (val) => {
        //console.log('update ----------------->>>', val)
       // refSearchBar.current.unFocus();
        // if (!val || val === '') {
        //     setPageNo(0)
        // } 
        // else {
            if(familyFilter == 'All'){
                searchAllFamilyByName(val)
            //     if(val){
            //         //const filteredData = allData.AllFamily.filter(item => item.familyMembers.map(row => console.log('row',row.firstName)));
            //         //const list = parent?.familyMembers?.map(row => row?.familyMemberTherapies)
            //         const newData = allData.AllFiltered.filter(item => {
            //          const itemData =  item.familyMembers.map(row => row.firstName.toUpperCase());
            //          const textData = val.toUpperCase();
            //          console.log('itemdata',itemData)
            //          return itemData.map(row => row.indexOf(textData) > -1)
            //        });
            //     console.log('Active', newData.length)
            //         setAllData({
            //          ...data,
            //          AllFiltered: newData,
            //          isLoading:false,
            //          search : val
            //      })
                 
            //  }
            //    else{
            //      setAllData({
            //          ...data,
            //          AllFiltered: allData.AllFiltered,
            //          isLoading:false,
            //          search :val,
            //      })
            //     }
            }else {
                searchFamilyByName(val)
            }
            //setSearch(val)
        //}
    };
    
    const onPressSearch = (val) => {
    
            if(familyFilter == 'All'){
                searchAllFamilyByName(val)
              
            }else {
                searchFamilyByName(val)
            }
       // }
        
       // refSearchBar.current.unFocus();
    };
   
    const onPressCancel = () => {
        //console.log('onCancel')
       ///  refSearchBar.current.unFocus();
    };

    const searchAllFamilyByName = (text) => {

        // var status = 'false'
        // if(statusFilter == 'All' || statusFilter == 'Active') {
        //     status = 'true'
        // }
        setLoader(true)
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getAllFamily + 'filter?status=&familyMemberName='+ text +'&sort=id,DESC', 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setAllData({
                        AllFamily :response.data.content,
                        AllFiltered: response.data.content,
                        //maxPage:response.data.totalPages,
                        
                    })
                } else {
                    ShowAlert(response.message)
                }
                setLoader(false)
        })
    }

    const searchFamilyByName = (text) => {
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamily + '?status=&familyMember='+ text +'&sort=id,DESC', 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        MyFamily :response.data.content,
                        MyFiltered :response.data.content
                    })
                } else {
                    //ShowAlert(response.message)
                }
        })
    }

    const getFamily = () => {
        setIsFilter(false)
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamily, 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        MyFamily :response.data.content,
                        MyFiltered :response.data.content
                    })
               //console.log("FamilyList ===",response.data.content[0].familyMember.familyMemberTherapies)
                } else {
                    ShowAlert(response.message)
                }
                setIsFilter(true)
            })
    }
    const getAllFamily = () => {
        setLoader(true)
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getAllFamily + 'filter?page='+pageNo + '&size=10&status=&familyMemberName=&sort=id,DESC', 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    //console.log("FamilyListByTid ===",response.data.content)
                    setAllData({
                        AllFamily: allData.AllFamily.concat(response.data.content),
                        AllFiltered :allData.AllFiltered.concat(response.data.content),
                        maxPage:response.data.totalPages,
                    })
                //console.log("FamilyListByTid ===",response.data.content[0])
                } else {
                    ShowAlert(response.message)
                }
                setLoader(false)
            })
    }
const getTherapistProfile = () => {

    getApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.getTherapistProfile,
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
         // console.log('THEARPSIT ID ++++++',response.data.userProfile.id )
          setTid (response.data.id)
          settherapistId(response.data.userProfile.id)
          settherapistName(response.data.userProfile.firstName)
        
      } else {
        if (result.code != 403 || result.code != 401 ) {
          ShowAlert(response.message);
        }
      }
    });
  };
    const viewFamilySessions = (item, parent) => {
        // props.navigation.push('FamilySession', {'family':item,therapistId:therapistId,name :therapistName})
        if (familyFilter == 'All') {
            const list = parent?.familyMembers?.map(row => row?.familyMemberTherapies)
            let isMyfamily = false;
            const id = list?.map(ids => ids.map(th => {
                console.log(th.therapist.userProfile.id)
                if (th.therapist.userProfile.id == therapistId) {
                    console.log('true')
                    isMyfamily = true
                }
            }))

           //console.log(isMyfamily)

            props.navigation.push('FamilySession', {
                MyFamily: isMyfamily,
                'family': item,
                therapistId: therapistId,
                name: therapistName,
                parent: parent
            })

        }
        else {
            props.navigation.push('FamilySession', { MyFamily: true, 'family': item.familyMember, therapistId: therapistId, name: therapistName, parent: item.parent })

        }
    }

    const viewFamilyDetail = (item,parent) => {
        //props.navigation.push('FamilySession', {'family':item})
       
        if(familyFilter == 'All'){
           // console.log('FamilyDetailTherapistALL',parent?.familyMembers?.map(row => row?.familyMemberTherapies))
            const insuranceDetailDtoList = parent?.familyMembers?.map(row => row?.insuranceDetailDtoList)

            const list = parent?.familyMembers?.map(row => row?.familyMemberTherapies)
            //console.log('therapy',list)

            let isMyfamily = false;
            const id = list?.map(ids => ids.map(th => {console.log(th.therapist.userProfile.id)
                if(th.therapist.userProfile.id == therapistId){
                    console.log('true')
                    isMyfamily = true
                }
                 }))
          
             console.log('insuranceDetailDtoList',insuranceDetailDtoList)
           
            props.navigation.push('FamilyDetailTherapist', {MyFamily : isMyfamily,filter :'All',
                'family':item,
                therapistId:therapistId,
                name :therapistName,
                parent:parent,
                therapy : list,
                insuranceDetailDtoList:insuranceDetailDtoList})

        }
        else{
           
            // const insuranceList = item?.familyMember?.map(row => row?.insuranceDetailDtoList)
            // console.log('familyMember',item.familyMember.familyMemberTherapies)
            props.navigation.push('FamilyDetailTherapist', {MyFamily: true,filter :'MyFamily',
                'family':item.familyMember,
                therapistId:therapistId,
                therapy :item.familyMember.familyMemberTherapies,
                name :therapistName,parent:item.parent,
                insuranceDetailDtoList:item.familyMember.insuranceDetailDtoList})

        }
        
    }
    const setFilterForStatus = (item) => {
        setStatusFilter(item)
    }

    const setFilterForFamily = (item) => {
        setFamilyFilter(item)
    }

    const doFilter = () => {
        if (statusFilter == 'All') {
            if (familyFilter == 'All') {
                setAllData({
                    ...allData,
                    AllFiltered: allData.AllFamily
                })
            }
            else {
                setData({
                    ...data,
                    MyFiltered: data.MyFamily
                })
            }
        }
        else if (statusFilter == 'Active') {
            if (familyFilter == 'All') {
                const filteredData = allData.AllFamily.filter(item => item.familyMembers.find(o => o.isActive === true));

                console.log('Active', filteredData)
                setAllData({
                    ...allData,
                    AllFiltered: filteredData
                })
            }
            else {
                //const filteredData = data.MyFamily.filter(item => item.familyMember.find(o => o.isActive === true));
                const filteredData = data.MyFamily.filter(item => item.familyMember.isActive == true)
                console.log('Active', filteredData)
                setData({
                    ...data,
                    MyFiltered: filteredData
                })
            }
        }
        else if (statusFilter == 'Inactive') {
            if (familyFilter == 'All') {
                // getAllFamily()
                // const filteredData = allData.AllFamily.filter(item => item.familyMember.isActive == true)
                const filteredData = allData.AllFamily.filter(item => item.familyMembers.find(o => o.isActive === false));

                console.log('NonActive', filteredData)
                setAllData({
                    ...allData,
                    AllFiltered: filteredData
                })
            }
            else {
                // getAllFamily()
                const filteredData = data.MyFamily.filter(item => item.familyMember.isActive == false)
                //const filteredData = data.MyFamily.filter(item => item.familyMember.find(o => o.isActive === false));

                console.log('NonActive', filteredData)
                setData({
                    ...data,
                    MyFiltered: filteredData
                })
            }
        }
    }

    const loadMoreResults = (info) => {
        if(pageNo < (allData.maxPage - 1)){
            setPageNo(pageNo + 1)
        }
    }
    
    const renderItemTeam = ({item}) => {
        let familyMember = [];
        if (item.familyMembers) {
          familyMember = item.familyMembers.map((row, index) => {
            return (
                <TouchableOpacity key={'item'+index} style={{ flex: 1 }} onPress={ () => viewFamilyDetail(row,item) }>
                <View style={{ flexDirection: 'row', padding: 20}}>
                    
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Image source={{uri: row.profileUrl}} style={styles.profileImage}></Image>
                        <View style={{flex:1, justifyContent:'center', paddingLeft:10}}>
                            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 18 }}>{row.firstName}</Text>
                            {row.isActive ?
                            <Text style={{ fontFamily: 'Roboto-Regular', color: '#0fc67a', fontSize: 16 }}>Active</Text>
                            :
                            <Text style={{ fontFamily: 'Roboto-Regular', color: '#f5463f', fontSize: 16 }}>Inactive</Text>
                             }
                            
                        </View>
                    </View>
    
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', alignContent:'space-between'}}>
                        <TouchableOpacity onPress={ () => viewFamilySessions(row,item)}>
                            <Text style={{fontFamily:'Roboto-Medium', fontSize:14, color:'#387af6'}}>Sessions</Text>
                            <View style={{height:1, backgroundColor:'#387af6'}}></View>
                        </TouchableOpacity>
                        <Image source={require('../../../assets/images/arrow.png')} style={{width:20, height:20, marginLeft:10}} resizeMode='contain'></Image>
                    </View>
    
                </View>
                <View style={{height:1, backgroundColor:'gray'}}></View>
            </TouchableOpacity>
            );
          });
        }
        return (
          <View>
            {familyMember}
          </View>
        );
        //   <View>
    
        //   </View>
      };
     const resetSearch = () => {
         setSearch()
         updateSearch()
    //     let newArray = allData.AllFiltered
    //     for (var i = 0; i < allData.AllFiltered.length; i++) {
    //         newArray[i] = { ...newArray[i] }
    //     }
    //     //this.setState({ serviceName: "", dataSource: newArray });
    //    // setLoader(true)
    //    // this.getSortedCaregiver();
    //     setSearch('')
    //     setAllData({
    //         ...allData,
    //         AllFiltered: newArray,
    //     })
    //    // getAllFamily()

    }
    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ flex: 1 }} onPress={ () => viewFamilyDetail(item) }>
            <View style={{ flexDirection: 'row', padding: 20}}>
                
                <View style={{flex:1, flexDirection:'row'}}>
                    <Image source={{uri: item.familyMember.profileUrl}} style={styles.profileImage} ></Image>
                    <View style={{flex:1, justifyContent:'center', paddingLeft:10}}>
                        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 18 }}>{item.familyMember.firstName}</Text>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* <Text>My Family list</Text> */}
            <View style = {{flexDirection :'row',justifyContent:'space-between',paddingVertical:10,margin:10}}>

              
              <View style={styles.input}>
                            {/* <Image source={require('../../../assets/images/search.png')}
                                style={styles.searchStyle}
                                tintColor={colors.GREY} /> */}
                 <TextInput
                                style={{flex:1,  marginStart:10, fontSize: 16,color:colors.BLACK }}
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
                    
                        </View>
                        <TouchableOpacity onPress={() => updateSearch(search)} style={{flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6,padding:10}}>
                        <Image source={require('../../../assets/images/search.png')} style={{width:20, height:20, resizeMode:'contain',tintColor:colors.BLACK}}></Image>
                       
                    </TouchableOpacity>
                {/* <Image source={require('../../../assets/images/filter.png')} resizeMode='contain' style={{width:30, height:30}}></Image> */}
            </View>
            <View style={{flex:1}}>
                <View style={{ paddingHorizontal: 20, ...(Platform.OS !== 'android' && { zIndex: 100 }), flexDirection: "row", justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text style={styles.textFieldText}>Family</Text>
                        <DropDownPicker
                            items={[
                                { label: 'All', value: 'All' },
                                { label: 'My Family', value: 'myFamily' },

                            ]}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            defaultValue='All'
                            labelStyle={{ color: colors.BLACK }}
                            containerStyle={{ height: 30, marginTop: 0, marginBottom: 5 }}
                            //containerStyle={{height: 40,margin: 20,backgroundColor:colors.GRAY_LIGHT_BG,flex:1,zIndex:60,}}
                            onChangeItem={(item) => {
                                setFilterForFamily(item.label)
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text style={styles.textFieldText}>Status</Text>
                        <DropDownPicker
                            items={[
                                { label: 'All', value: 'All' },
                                { label: 'Active', value: 'Active' },
                                { label: 'Inactive', value: 'Inactive' },
                            ]}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            placeholder="Select Reason"
                            placeholderStyle={{ color: colors.BLACK }}
                            defaultValue='All'
                            labelStyle={{ color: colors.BLACK }}
                            containerStyle={{ height: 30, marginTop: 0, marginBottom: 5, marginStart: 2 }}
                            onChangeItem={(item) => { 
                                setFilterForStatus(item.label)
                            }}
                        />
                    </View>
                </View>
                {familyFilter == 'All' ?
                    <FlatList style={{ backgroundColor: 'white', margin: 20 }}
                        data={allData.AllFiltered}
                        renderItem={renderItemTeam}
                        keyExtractor={(item, index) => 'item' + index}
                        onEndReachedThreshold={0.01}
                        onEndReached={info => {
                            loadMoreResults(info);
                        }}
                    />
                    :
                    <FlatList style={{ backgroundColor: colors.WHITE, margin: 20, }}
                        data={data.MyFiltered}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => 'item' + index}
                    />
                }

            </View>

            {
                loader ? ShowLoader() : null
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
        //borderRadius: 110 / 2,
        //resizeMode:'contain',
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
    textFieldText: {
        fontFamily:'Roboto-Bold',
        fontSize: 14,
        textAlign: 'left',
        marginTop: 5,
        marginBottom:5,
        color:'#292929',
    },
})



export default MyFamilyTherapist