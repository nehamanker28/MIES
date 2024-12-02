import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, Button } from 'react-native'
//import { TouchableOpacity} from 'react-native-gesture-handler'

const FloatingButton = (props) =>  {
    return (
        <TouchableOpacity style={styles.touchableOpacityStyle} onPress={props.press}>
            <Image source={require('../../assets/images/Add.png')} style={styles.touchableOpacityStyle}></Image>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    // viewStyle: {
    //     width: 60,
    //     height: 60,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     right: 30,
    //     bottom: 30,
    //     position: 'absolute',
    //     borderRadius: 50,
    //     borderWidth: 1,
    //     backgroundColor:'#407bff'
    // },

    touchableOpacityStyle: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        left: 20,
        bottom: 20,
        position: 'absolute'
    }
})

export default FloatingButton


//hitSlop={{top: 75, bottom: -25, left: -330, right: -30,}}
//{/* <Button title= 'ADD' onPress={() => //console.log('pressed')}></Button> */}