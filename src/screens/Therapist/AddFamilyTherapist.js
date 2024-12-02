import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
//import { SearchBar } from 'react-native-elements';
import SearchBar from 'react-native-search-bar';
import GreenButton from '../../components/GreenButton'
import { ApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { calculateAge } from '../../Common/Utility'
import colors from '../../Common/Colors';

const AddFamilyTherapist = ({navigation}) => {

    const [data, setData] = useState({
        content: [],
        isLoading: false,
        selectButtonColor: 'gray',
        selectGradientColor:'gray',
        buttonDisable: true,
        family:null
    })

    const updateSearch = (val) => {
           getFamilyBySearch(val)
    };
    
    const onPressSearch = (val) => {
        //console.log('onPress',val)
    };
    
    const onPressCancel = () => {
        //console.log('onCancel')
    };

    // getFamily = () => {
    //     setData({
    //         ...data,
    //         isLoading:true
    //     })
    //     getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamily, 'GET') 
    //         .then(response => {
    //             if (response.code >= 200 && response.code <= 299) {
    //                 setData({
    //                     ...data,
    //                     content: response.data.content,
    //                     isLoading:false
    //                 })
    //                 let arr = data.content.map((item, index) => {
    //                     item.isSelected = false
    //                     return {...item}
    //                 })
    //             } else {
    //                 ShowAlert(response.message)
    //             }
    //         })
    // }

    const getFamilyBySearch = (name) => {
        setData({
            ...data,
            isLoading:true
        })
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamily + '?firstName='+name, 'GET') 
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        ...data,
                        content: response.data.content,
                        isLoading:false
                    })
                    let arr = data.content.map((item, index) => {
                        item.isSelected = false
                        return {...item}
                    })
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    const selectFamily = (item) => {

        //console.log('item ----->>>',item)

        data.content.map((item, index) => {
            item.isSelected = false
        })

        item.isSelected = !item.isSelected
        
        if (item.isSelected) {
            setData({
                ...data,
                selectButtonColor: '#0fd683',
                selectGradientColor: '#10c177',
                buttonDisable: false,
                family:item
            })
        } else {
            setData({
                ...data,
                selectButtonColor: 'gray',
                selectGradientColor: 'gray',
                buttonDisable: true,
                family:null
            })
        }
    }

    useEffect(() => {
        getFamilyBySearch('')
        return () => {
            
        }
    }, [])
    
    const renderItem = ({ item }) => (
        <TouchableOpacity style={ styles.ListViewContainer} onPress={() => selectFamily(item)}>
            <View style={ item.isSelected ? styles.selectedCellViewStyle : styles.cellViewStyle}>
                <Image source={{uri: item.familyMember.profileUrl}} style={styles.profileImage}></Image>
                <View style={{marginLeft:10, paddingRight:35}}>
                    <Text style={item.isSelected ? {color:'white', fontFamily:'Roboto-Regular', fontSize: 20} : {color:'black', fontFamily:'Roboto-Regular', fontSize: 20}}>{item.familyMember.firstName} {item.familyMember.lastName}</Text>
                    <Text style={item.isSelected ? { fontFamily: 'Roboto-Light', fontSize: 18, paddingTop: 5, color: 'white' } : { fontFamily: 'Roboto-Light', fontSize: 18, paddingTop: 5, color: 'black' }}>{ calculateAge(item.familyMember.dob) }</Text>
                </View>
            </View>
        </TouchableOpacity>  
    );
    
    const onSelect = () => {
        ////console.log('ddd  ----- >>>  ',data.family)
        navigation.navigate('Add Session',{'family':data.family, 'isFamilySelected':true});
    }
    
    return (
        <View style={styles.container}>
                <SearchBar
                style={{backgroundColor:'white'}}
                textColor = {colors.BLACK}
                placeholder="Search"
                onChangeText={(val) => updateSearch(val)}
                onSearchButtonPress={(val) => onPressSearch(val)}
                onCancelButtonPress={() => onPressCancel()}
                barTintColor={colors.WHITE}
                />
            <Text style={styles.textStyle}> Recently Added </Text>
            <FlatList
                style={styles.FlatListStyle}
                data={data.content}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'index' + index}
            />
            <GreenButton text='Select' onMethod={onSelect} disable={data.buttonDisable} color={data.selectButtonColor} gradient={data.selectGradientColor} />
            {
                    data.isLoading ? ShowLoader() : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical:20
    },
    textStyle: {
        fontFamily:'Roboto-Regular',
        fontSize: 18,
        textAlign: 'left',
        marginTop: 5,
        color: '#292929',
        paddingVertical:20,
    },

    FlatListStyle: {
        marginBottom:20
    },

    ListViewContainer: {
        borderRadius: 30,
        height: 90,
        backgroundColor: '#D3D3D3',
        marginVertical:10
    },

    cellViewStyle:{ 
                height: 95, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                 paddingHorizontal: 20, flexDirection:'row', alignItems:'center', backgroundColor:'white'
    },
    
    selectedCellViewStyle:{ 
                height: 95, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                 paddingHorizontal: 20, flexDirection:'row', alignItems:'center', backgroundColor:'#387af6'
    },
    
    profileImage :{
        width : 52,
        height :52,
        borderRadius:25,
    },
})

export default AddFamilyTherapist
