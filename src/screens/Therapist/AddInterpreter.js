import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import GreenButton from '../../components/GreenButton'

const AddInterpreter = ({navigation,  route }) => {

    const [data, setData] = useState({
        content: [{'name':route.params.interpreter}, {'name':'None Needed'}],
        isLoading: false,
        selectButtonColor: 'gray',
        selectGradientColor:'gray',
        buttonDisable: true,
        interpreter:null
    })

    useEffect(() => {
        
       // console.log('data ------>>>',data.content)
        data.content.map((item, index) => {
            item.isSelected = false
        })
        
        return () => {
            
        }
    }, [])

    const selectTherapy = (item) => {
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
                interpreter:item
            })
        } else {
            setData({
                ...data,
                selectButtonColor: 'gray',
                selectGradientColor: 'gray',
                buttonDisable: true,
                interpreter:null
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
        navigation.navigate('Add Session',{'interpreter':data.interpreter});
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.FlatListStyle}
                data={data.content}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'index' + index}
            />
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

    FlatListStyle: {
        marginBottom:20
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

export default AddInterpreter