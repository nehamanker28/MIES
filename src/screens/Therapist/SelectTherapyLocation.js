import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native'
import GreenButton from '../../components/GreenButton'

const SelectTherapyLocation = ({navigation}) => {

    const [data, setData] = useState({
        content: [{name:'Teletherapy'}, {name:'Home'}, {name:'Clinic'}],
        isLoading: false,
        selectButtonColor: 'gray',
        selectGradientColor:'gray',
        buttonDisable: true,
        location: null,
        isCustom:false
    })

    const selectTherapy = (item) => {
        data.content.map((item1, index) => {
            if(item1 != item) {
                item1.isSelected = false
            }
        })

        //console.log('item ----', item)

        item.isSelected = !item.isSelected
        //console.log('item selected----', item.isSelected)
        if (item.isSelected) {
            setData({
                ...data,
                selectButtonColor: '#0fd683',
                selectGradientColor: '#10c177',
                buttonDisable: false,
                location:item.name,
                isCustom:false
            })
        } else {
            setData({
                ...data,
                selectButtonColor: 'gray',
                selectGradientColor: 'gray',
                buttonDisable: true,
                location:null,
                isCustom:false
            })
        }
    }
    
    const renderItem = ({ item }) => (
        <TouchableOpacity style={ styles.ListViewContainer} onPress={() => selectTherapy(item)}>
            <View style={ item.isSelected ? styles.selectedCellViewStyle : styles.cellViewStyle}>
                <View style={{paddingLeft:15}}>
                    <Text style={item.isSelected ? {color:'white', fontFamily:'Roboto-Regular', fontSize: 22} : {color:'black', fontFamily:'Roboto-Regular', fontSize: 22}}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>  
    );

    const onSelect = () => {
        navigation.navigate('Add Session',{'location':data.location, isLocation:true, isCustom:data.isCustom});
    }

    const locationEnter = (text) => {
        data.content.map((item, index) => {
            item.isSelected = false
        })

        setData({
            ...data,
            selectButtonColor: '#0fd683',
            selectGradientColor: '#10c177',
            buttonDisable: false,
            location: text,
            isCustom: true
        })
    }

    useEffect(() => {
        
        data.content.map((item, index) => {
            item.isSelected = false
        })
        //console.log('data ------>>>',data.content)

        return () => {
            
        }
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                style={{flex:1}}
                data={data.content}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'index' + index}
            />
            <View style={{marginTop:20, flex:1}}>
                <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>Other</Text>
                <TextInput style={{ fontFamily: 'Roboto-Regular', fontSize: 16, marginTop: 20, borderColor: '#d8e4f1', borderWidth: 1, borderRadius: 5, height: 50, backgroundColor: '#d8e4f1', paddingLeft:10 }}
                    onChangeText={(text) =>
                        locationEnter(text)
                    } 
                     placeholder='Enter other location'
                    value = {data.isCustom ? null : ''} ></TextInput>
            </View>
            <GreenButton text='Select' onMethod={onSelect} disable={data.buttonDisable} color={data.selectButtonColor} gradient={data.selectGradientColor}/>
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
        fontSize: 20,
        textAlign: 'left',
        marginTop: 5,
        color: '#292929',
        paddingVertical:20,
    },
    ListViewContainer: {
        borderRadius: 30,
        height: 70,
        backgroundColor: '#D3D3D3',
        marginVertical:10
    },

    cellViewStyle:{ 
                height: 65, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                 paddingHorizontal: 20, flexDirection:'row', alignItems:'center', backgroundColor:'white'
    },
    
    selectedCellViewStyle:{ 
                height: 65, borderRadius: 30, borderWidth: 1, borderTopColor: '#C0C0C0', borderBottomColor: '#D3D3D3', borderLeftColor: '#C0C0C0', borderRightColor: '#C0C0C0',
                 paddingHorizontal: 20, flexDirection:'row', alignItems:'center', backgroundColor:'#387af6'
    },
    
    profileImage :{
        width : 52,
        height :52,
    },
})

export default SelectTherapyLocation