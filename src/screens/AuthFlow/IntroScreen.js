
import React, {useState, useEffect} from 'react'
import { View, StyleSheet, Image,Text ,ScrollView, BackHandler} from 'react-native'
import GreenButton from '../../components/GreenButton'
import { AuthContext } from '../../components/context';
import colors from '../../Common/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { Platform } from 'react-native';
import {getWithOutAuthrization , postApiHelper} from '../../Service/Fetch'
import { ShowLoader, ShowAlert } from '../../Common/Helper'
import String, { AlertMessage, ServiceUrl } from '../../Common/String'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from '../../Common/String'
import {useIsFocused} from '@react-navigation/native';

const IntroScreen = (props) => {
    const { signIn } = React.useContext(AuthContext);
    const isFocused = useIsFocused();
    const [tenantValue, setTenantValue] = useState([])
    const [selectedtenantValue, setselectedtenantValue] = useState()
    const [data, setData] = useState({
        isLoading: false
    })
    const [value, setValue] = useState(null);
    const [logo, setLogo] = useState('')
    useEffect(() => {
        if(isFocused){
            getTenantValues()
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        }
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    },[isFocused]);

    const handleBackButtonClick = () => {
        //console.log('handler ------------------>>>')
        props.navigation.goBack(null);
        return false;
    };

    const getTenantValues = () => {
        setData({
            ...data,
            isLoading:true
        })

        getWithOutAuthrization(ServiceUrl.base_url_91 + ServiceUrl.getTenant, 'GET')
            .then(response => {
                setData({
                    ...data,
                    isLoading:false
                })
                if (response.code == 200) {

                    var arr = []
                    response.data.map((item, index) => {
                        arr.push({ label: item.tenantName, value: item.tenantId, largeLogoUrl:item.largeLogoUrl, primaryColor:item.primaryColor, secondaryColor:item.secondaryColor, smallLogoUrl:item.smallLogoUrl, tenantUrl:item.tenantUrl })
                    })
                    //console.log('tenant value ----->>',arr)
                    setTenantValue(arr)
                } else {
                    //ShowAlert(response.message)
                }
            })
    }

    const selectTenet = async (item) => {
        //console.log('item value err ------>>',item.value)
        setselectedtenantValue(item.value)
        try {
            await AsyncStorage.setItem(AsyncStorageKey.tenantId, item.value)
        } catch (e) {
            //console.log('accessToken save err ------>>',e)
         }
         setLogo(item.largeLogoUrl)
    }
    // doSignUp = () => {
    //     props.navigation.navigate('SignUp')
    // }
    const navigateToLogin = () => {
        if(selectedtenantValue != null){
            props.navigation.navigate('Login', {'logo':logo})
        }
        else
        ShowAlert('Please Select Tenant')
    }

    return (
        <View style={{flex :1, backgroundColor:'#eaf1fe', padding:30 }}>
                <View style = {{padding :10,flex :1}}>
                    <Image source={require('../../../assets/images/MIS.png')} style = {styles.imageStyle} ></Image>
                </View>
                <View style = {{padding :20,...(Platform.OS !== 'android' && {zIndex: 10})}}>
                    <Text style={styles.textFieldText}>Select provider company</Text>
                    <DropDownPicker
                                items={tenantValue}
                                placeholder = 'Select Tenant'
                                placeholderStyle = {{fontFamily:'Roboto-Bold',fontSize: 16,color:colors.BLUE}}
                                defaultValue={value}
                                // dropDownStyle={{  backgroundColor :'#e8f1ff',}}
                               // style={{ backgroundColor :'#e8f1ff'}}
                                itemStyle = {{justifyContent : 'flex-start'}}
                                containerStyle={{height:50,marginTop:10,marginBottom:25,}}
                                dropDownStyle = {styles.input1}
                                onChangeItem={item => selectTenet(item)}
                            //zIndex={99999}
                            labelStyle={{
                                fontFamily:'Roboto-Medium',
                                fontSize: 16,
                                textAlign: 'left',
                                color: '#000',
                            }}
                    />
                    <GreenButton text='Proceed' onMethod={() => {navigateToLogin()}} />
                 </View>
                 {
                     data.isLoading ? ShowLoader() : null
                 }
        </View>
    )
}

const styles = StyleSheet.create({
  
    imageStyle: { 
        width: null,
        height: null,
        backgroundColor:'#ffffff' ,
        flex :1,
        borderRadius: 15,
    },
    textFieldText: {
        fontFamily:'Roboto-Light',
        fontSize: 20,
        textAlign: 'left',
        marginTop: 5,
        color:'#292929',
    },
    input1: {
        fontFamily:'Roboto-Medium',
        fontSize: 19,
       // height :50,
       // backgroundColor :'#e8f1ff',
        color: 'black',
       // marginTop: 10,
        borderRadius: 8,
        //paddingHorizontal:15,
       

    },
    
})

export default IntroScreen
