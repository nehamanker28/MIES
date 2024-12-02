import React from 'react'
import { Alert , ActivityIndicator, View, StyleSheet} from 'react-native'


const ShowAlert = (msg) => {
    return (
        Alert.alert('Alert', msg)
    )
}

const ShowLoader = () => {
    return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color='#387af6' />
            </View>
    )
}


const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'gray',
        opacity:0.2,
        zIndex:9999999
  }
})

export {ShowAlert , ShowLoader}
