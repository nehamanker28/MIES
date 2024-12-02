import React, {useState,useContext} from 'react'
import { Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native'
import GreenButton from '../../components/GreenButton';
import { AuthContext } from '../../components/context';
import {strings, AlertMessage} from '../../Common/String';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { ApiHelper , getApiHelper} from '../../Service/Fetch'
import { ServiceUrl } from '../../Common/String'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { da } from 'date-fns/locale';


const ForgotPassword = ({navigation, route}) => {

    const [data, setData] = useState({
        email: '',
        confirmPassword: '',
        isLoading:false
    })
    const { signIn } = React.useContext(AuthContext);

    const changePassword = async() => {
        console.log('forgot ',data)
        if (data.email.trim().length == 0) {
            console.log('failed')
            return
        }

        // if (data.confirmPassword.trim().length == 0) {
        //     console.log('failed 2')
        //     return
        // }
        if (isNaN(data.email)){
            ////console.log("Its Email ID")
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(data.email) === false) {
                ShowAlert(AlertMessage.valid_email_address)
            return false;
            }
       }
        setData({
            ...data,
            isLoading:true
        })

        
        let dataObj = {'email':data.email}
        console.log(dataObj)
        getApiHelper(ServiceUrl.base_url + ServiceUrl.forgotPassword + data.email, 'GET') 
            .then(response => {
                setData({
                    ...data,
                    isLoading:false
                })
                if (response.code >= 200 && response.code <= 299) {
                    ShowAlert(response.message)
                    navigation.pop()
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    setUserAsLoginMode = async () => {
        try {
            await AsyncStorage.setItem(route.params.uniqueId, 'false')
            //console.log('reset role----->>>', route.params.role)
            signIn(route.params.uniqueId, route.params.role)
       } catch (e) {
        // saving error
       }
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.topView}>
                <Image
                source={require('../../../assets/images/LoginImg.png')}
                style={styles.image} />
            </View>
            <View style={styles.bottomView}>
                {/* <Text style={styles.LoginText}>Forget Password</Text> */}
                
                <Text style={styles.textFieldText}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Email'
                    placeholderTextColor='gray'
                    returnKeyType="next"
                    blurOnSubmit={false}
                    autoCapitalize='none'
                    onChangeText={(value) => {
                        setData({
                            ...data,
                            email:value
                        })
                    }}
                />
                
                <GreenButton text='Submit' onMethod={() => {changePassword()}} />
                
            </View>
            {
                    data.isLoading ? ShowLoader() : null
                }
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff' ,
    },

    topView: {
        flex:0.8,
        backgroundColor:'#eaf1fe'
    },

    bottomView: {
        flex:1.2,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingVertical:40,
        paddingHorizontal: 25,
    },

    LoginText: {
        fontFamily: 'Roboto-Bold',
        fontWeight:'bold',
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom:40
    },

    textFieldText: {
        fontFamily:'Roboto-Light',
        fontSize: 20,
        textAlign: 'left',
        marginTop: 5,
        color:'#292929',
    },

    forgotPasswordText: {
        fontFamily:'Roboto-Regular',
        fontSize: 15,
        textAlign: 'right',
        marginTop: 20,
        marginBottom: 32,
        color:'#292929',
    },

    input: {
        fontFamily:'Roboto-Medium',
        width: '100%',
        fontSize: 19,
        height :50,
        backgroundColor :'#e8f1ff',
        color: 'black',
        marginTop: 10,
        borderRadius: 8,
        paddingHorizontal:15,
        marginBottom:30
    },

    image: {
        width: '100%',
        height:300,
        resizeMode: 'contain',
        marginTop: 50,
    },
    
    viewRow: {
        flexDirection: 'row',
        marginTop: 40,
        marginBottom: 30,
        justifyContent:'center'
    },

    newUserText: {
        fontFamily:'Roboto-Regular',
        fontSize: 15,
        color:'#292929',
    },

    signupText: {
        fontFamily:'Roboto-Medium',
        fontSize: 15,
        color:'#387af6',
    },
})

export default ForgotPassword
