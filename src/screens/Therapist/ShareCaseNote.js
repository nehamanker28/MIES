import React, { useState, useEffect, useRef } from 'react';

//Import all required component
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Button,
    Platform,
    PermissionsAndroid,
    Dimensions
} from 'react-native';

import SearchBar from 'react-native-search-bar';
import colors from "../../Common/Colors";
import GreenButton from '../../components/GreenButton';

import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import moment from 'moment';



const ShareCaseNote = ({ navigation, route }) => {
    const refSearchBar = useRef();
    const [description, setDescription] = useState('')
    const [data, setData] = useState({
        isLoading:false,
        therapistList:[],
        selectButtonColor: 'green',
        selectGradientColor:'green',
        //buttonDisable: true,
    })
    const [therapist, SetTherapist] = useState([])
    const [isCall, setIsCall] = useState(false)

    useEffect(() => {
        console.log('share case note-------->>>')
        setDescription(route.params.session.caseNoteDTO.description)
        var idArr = []
        route.params.session.caseNoteDTO.sharedTherapist.map((item, index) => {
            item.isSelected = true
            idArr.push(item)
        }) 
        SetTherapist(idArr)
        
        setIsCall(true)
    }, []) 
    
    useEffect(() => {
        //console.log('use')
        if(isCall){
            //console.log('use ind--')
            setIsCall(false)
            searchTherapistByName('')
        }
    }, [isCall]) 
    

    // useEffect( () => {
    //      console.log('therapist.length-------->>>',therapist.length)
    //     if(therapist.length == 0){
    //         console.log('button disable true------->>>')
    //         setData({
    //             ...data,
    //             selectButtonColor: 'gray',
    //             selectGradientColor: 'gray',
    //             buttonDisable: true
    //         })
    //     }else {
    //         console.log('button disable false------->>>')
    //         setData({
    //             ...data,
    //             selectButtonColor: '#0fd683',
    //             selectGradientColor: '#10c177',
    //             buttonDisable: false
    //         })
    //     }

    // }, [therapist])

    const selectTherapist = (item) => {
            console.log('item issel--->>',item.isSelected)
            item.isSelected = !item.isSelected

            if (item.isSelected) {
                SetTherapist([...therapist, item])
            } else {
                SetTherapist(therapist.filter((obj) => obj.id !== item.id))
            } 
    }

    const therapistListRenderItem = ({ item }) => (
        <TouchableOpacity style={{ flex: 1 }} onPress={ () => selectTherapist(item)}>
            <View style={{ padding: 10}}>
                <View style={ item.isSelected ? styles.selectedCellViewStyle : styles.cellViewStyle}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Image source={{uri:item.userProfile.profilePicUrl}} style={styles.profileImage} resizeMode='contain'></Image>
                        <View style={{ justifyContent:'center', paddingLeft:10}}>
                            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 18 }, item.isSelected ? styles.selectTextStyle : styles.nonSelectTextStyle}>{item.userProfile.firstName}</Text>
                            {
                                item.therapistServices.length > 0 ?
                                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }, item.isSelected ? styles.selectTextStyle : styles.nonSelectTextStyle}>{item.therapistServices[0].therapy.name}</Text>
                                :
                                null
                            }
                        </View>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', alignContent:'space-between'}}>
                        <Image source={require('../../../assets/images/arrow.png')} style={{width:20, height:20, marginLeft:10}} resizeMode='contain'></Image>
                    </View>
                </View>
            </View>
            {/* <View style={{height:1, backgroundColor:'gray'}}></View> */}
        </TouchableOpacity>
    )

    const updateSearch = (val) => {
        console.log('on update search')
        searchTherapistByName(val)
    };
    
    const onPressSearch = (val) => {
        console.log('on press search')
        refSearchBar.current.unFocus();
        searchTherapistByName(val)
    };
    
    const onPressCancel = (val) => {
        console.log('onCancel')
        refSearchBar.current.unFocus();
        searchTherapistByName('')
    };

    const shareCaseNote = () => {
        //console.log('button clicked ------------->>>', therapist.length)

        var idArr = []
        therapist.map((item, index) => {
            idArr.push(item.id)
        })
       
       // let dataObj = {'therapistIds':idArr}

        setData({
            ...data,
            isLoading:true
        })

        ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.shareCaseNote + route.params.session.caseNoteDTO.id + '/share', idArr, 'PUT') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        ...data,
                        isLoading:false
                    })
                    refSearchBar.current.unFocus();
                    navigation.pop() 

                } else {
                    ShowAlert(response.message)
                }
        })
    }

    const searchTherapistByName = (text) => {
        setData({
            ...data,
            isLoading:true
        })
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getTherapistSearch + '?name='+text, 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                   
                    var tempArr = response.data.content

                    tempArr.map((itemObj, index) => {
                        itemObj.isSelected = false
                        therapist.map((item, index) => {
                            if(itemObj.id == item.id){
                                if(item.isSelected == true) {
                                    itemObj.isSelected = true
                                }
                            }
                        })
                    })

                    setData({
                        ...data,
                        isLoading:false,
                        therapistList: tempArr
                    })

                    
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    return (
        <ScrollView style={{ flex: 1}}>
            {
                data.isLoading ? ShowLoader() : null
            }
            <View style={{ flex: 1, padding: 20, backgroundColor: '#ffffff', flexDirection:'column' }}>
                <View style={{ flex: 1, marginBottom:20 }}>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: '#191919', fontFamily: 'Roboto-Light', fontSize: 18 }}>{moment(route.params.session.caseNoteDTO.startDateTime).format('Do MMMM, YYYY')}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: '#191919', fontFamily: 'Roboto-Medium', fontSize: 18 }}>SOAP Notes</Text>
                        <Text style={{ color: '#191919', fontFamily: 'Roboto-Light', fontSize: 18, marginTop: 10 }}>{description}</Text>
                    </View>
                    <SearchBar
                        style={{height: 70, flex: 1, marginRight: 5 }}
                        ref={refSearchBar}
                        //hideBackground={true}
                        placeholder="Search"
                        onChangeText={(val) => updateSearch(val)}
                        onSearchButtonPress={(val) => onPressSearch(val)}
                        onCancelButtonPress={(val) => onPressCancel(val)}
                        textColor={colors.BLACK}
                        textFieldBackgroundColor = {colors.GRAY_LIGHT_BG}
                        barTintColor={colors.WHITE}
                        tintColor = {colors.BLUE}
                    />
                    <FlatList
                        style={styles.FlatListStyle}
                        data={data.therapistList}
                        renderItem={therapistListRenderItem}
                        keyExtractor={(item, index) => 'index' + index}
                    />
                </View>
                <View style={{flex:0.2}}>
                    {/* <GreenButton text='Share Now' onMethod={() => shareCaseNote()} disable={data.buttonDisable} color={data.selectButtonColor} gradient={data.selectGradientColor} /> */}
                    <GreenButton text='Share Now' onMethod={() => shareCaseNote()}  color={data.selectButtonColor} gradient={data.selectGradientColor} />
                </View>
            </View>
        </ScrollView>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        
    },
    FlatListStyle: {
        backgroundColor:'white'
    },
    profileImage :{
        width : 50,
        height: 50,
        borderRadius: 140,
    },
    cellViewStyle:{
        borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
         padding: 10, flexDirection:'row', alignItems:'center', backgroundColor:'white'
    },

    selectedCellViewStyle:{  borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
        padding: 10, flexDirection:'row', alignItems:'center', backgroundColor:'#387af6'
    },
    selectTextStyle:{ color: 'white' },
    nonSelectTextStyle:{ color: 'black' }
})

export default ShareCaseNote
