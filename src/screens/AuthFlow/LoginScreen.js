import React, {useState, useEffect} from 'react'
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import GreenButton from '../../components/GreenButton';
import { AuthContext } from '../../components/context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {getWithOutAuthrization , postApiHelper} from '../../Service/Fetch'
import { ShowLoader, ShowAlert } from '../../Common/Helper'
import String, { AlertMessage, ServiceUrl } from '../../Common/String'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from '../../Common/String'
import messaging from '@react-native-firebase/messaging';
import firebase from 'firebase';

const LoginScreen = ({navigation, route}) => {

    const [data, setData] = useState({
        username: '',
        password: '',
        isLoading: false
    })
    
    const { signIn } = React.useContext(AuthContext);
    
    useEffect(() => {
        var config = {
            apiKey: "AIzaSyDGE1vo2s-m35-7wI5sM-lSJ11n7FL4b5k",
            authDomain: "meis-dev.firebaseapp.com",
            databaseURL: "https://meis-dev-default-rtdb.firebaseio.com",
            projectId: "meis-dev",
            storageBucket: "meis-dev.appspot.com",
            messagingSenderId: "581868426889",
            appId: "1:581868426889:web:221da5d0b5547d04b79858",
            measurementId: "G-KJH0VZ66N1"
          };
          if (!firebase.apps.length) {
            firebase.initializeApp(config);
            //  checkPermission();
          } else {
            firebase.app(); // if already initialized, use that one
          }
    },[]);

    const doLogin = async() => {

        if (data.username.trim().length == 0) {
                ShowAlert(AlertMessage.valid_userName)
            return
        }

        if (data.password.trim().length == 0) {
            ShowAlert(AlertMessage.valid_password)
            return
        }
       if (isNaN(data.username)){
            ////console.log("Its Email ID")
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(data.username) === false) {
                ShowAlert(AlertMessage.valid_email_address)
            return false;
            }
       }
       else
       {
        ////console.log(" Its a mobile number")
        if(data.username.length != 10 ){
            ShowAlert(AlertMessage.valid_mobile_no)
           return
        }
        else
        {
            const reg = /^[0-9\b]+$/;
            if (reg.test(data.username) === false) {
                ShowAlert(AlertMessage.valid_mobile_no)
            return false;
            }
        }
       }
        setData({
            ...data,
            isLoading:true
        })
        ////console.log(' passwor --->>', data.password)
        let dataObj = {'email':data.username, 'password':data.password}
        postApiHelper(ServiceUrl.base_url + ServiceUrl.loginUrl, dataObj, 'POST')
            .then(response => {
                setData({
                    ...data,
                    isLoading:false
                })
                if (response.code == 200) {
                    global.isDisclaimerVisible = true ;
                    var role = 'ROLE_THERAPIST'
                    if (response.data.userDetails.roles.length > 0) {
                        role = response.data.userDetails.roles[0]
                        //console.log(response.data.userDetails.phone,response.data.userDetails.phone)
                        firebase.database().ref('users/' + response.data.userDetails.phone)
                        .set({ name: response.data.userDetails.email});
                    }
                    checkNewUser(response.data.userDetails.userUniqueId, response.data.accessToken, response.data.sessionId, role, response.data.userDetails.newUser)
                } else {
                    if(response.message == 'Invalid Email or Password'){
                        ShowAlert('Please enter a valid email address or mobile number')
                    }
                    else{
                        ShowAlert(response.message)
                    }
                }
            })
    }
    const Subscribed = (userUniqueId) =>{
        //console.log('topic to be subscribeToTopic =',userUniqueId)
        messaging()
        .subscribeToTopic(userUniqueId)
        .then(() => console.log('Subscribed to topic!'));
      }

   const checkNewUser = async (uniqueId, accessToken, sessionId, role, isNewUser) => {
        Subscribed(uniqueId)
       
         try {
            await AsyncStorage.setItem(AsyncStorageKey.accessToken, accessToken)
        } catch (e) {
            //console.log('accessToken save err ------>>',e)
         }

        try {
            await AsyncStorage.setItem(AsyncStorageKey.sessionId, sessionId)
            await AsyncStorage.setItem(AsyncStorageKey.password, data.password)
        } catch (e) {
            //console.log('sessionId save err ------>>',e)
         }
        
        try {
            //const isFirstTime = await AsyncStorage.getItem(uniqueId)
            if (isNewUser == false) {   
                signIn(uniqueId, role)
            } else {
                navigation.navigate('ResetPassword', { 'uniqueId': uniqueId, 'role': role})
            }
       } catch (e) {
            // saving error
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.topView}>
                        <Image
                            source={{ uri: route.params.logo }}
                            style={styles.image} />
                    </View>

                    <View style={styles.middleView}>
                        <Text style={styles.TenantText}>Login</Text>
                        <Text style={styles.textFieldText}>Email/Mobile</Text>
                        <TextInput
                            style={styles.input1}
                            placeholder='Enter Email/Mobile no'
                            placeholderTextColor='gray'
                            returnKeyType="next"
                            blurOnSubmit={false}
                            autoCapitalize='none'
                            textContentType='emailAddress'
                            onChangeText={(value) => {
                                let temp = value
                                temp = temp.replace(/[^A-Za-z0-9@.]/ig, '')
                                setData({
                                    ...data,
                                    username: temp
                                })
                            }}
                            value={data.username}
                        />
                        <Text style={styles.textFieldText}>Password</Text>
                        <TextInput
                            style={styles.input1}
                            placeholder='Enter password'
                            placeholderTextColor='gray'
                            returnKeyType="next"
                            blurOnSubmit={false}
                            autoCapitalize='none'
                            secureTextEntry={true}
                            onChangeText={(value) => {
                                setData({
                                    ...data,
                                    password: value
                                })
                            }}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        {/* <GreenButton text='Login' onMethod={() => {signIn()}} /> */}
                        <GreenButton text='Login' onMethod={() => { doLogin() }} />
                    </View>
                    <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'center' }}>
                        <Image source={require('../../../assets/images/MIS-logo.png')} style={{ width: 40, height: 20, resizeMode: 'contain' }} ></Image>
                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 12 }}>Copyright @RCE 2021</Text>
                    </View>
            </KeyboardAwareScrollView>
            {
                data.isLoading ? ShowLoader() : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff' ,
    },

    topView: {
        backgroundColor:'#eaf1fe'
    },

    middleView: {
        flex:1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingVertical:20,
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

    TenantText: {
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
       // padding:10,
        color:'#292929',
        marginBottom:32,
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
    input1: {
        fontFamily:'Roboto-Medium',
        width: '100%',
        fontSize: 19,
        height :50,
        backgroundColor :'#e8f1ff',
        color: 'black',
        marginTop: 10,
        borderRadius: 8,
        paddingHorizontal:15,
        marginBottom:14,
    },

    image: {
        width: '100%',
        height:150,
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

export default LoginScreen
