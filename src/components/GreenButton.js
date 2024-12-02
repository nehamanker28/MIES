import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

const GreenButton = ({ text, onMethod, disable = false, color= '#0fd683', gradient = '#10c177' }) => {
    return(
        <TouchableOpacity onPress={() => onMethod()} disabled={disable}>
            <LinearGradient colors={[color, gradient]} style={styles.linearGradient, styles.buttonStyle}>
                <Text style={styles.buttonText}>{text}</Text>
             </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    buttonStyle:{
        borderRadius:10,
        height: 50,
        justifyContent:'center'
    },

    buttonText: {
        fontFamily: 'Roboto-Medium',
        fontWeight:'bold',
        color:'white',
        fontSize:19,
        textAlign:"center",
        
    }
})

export default GreenButton