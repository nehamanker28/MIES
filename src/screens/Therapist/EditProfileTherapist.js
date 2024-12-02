import React, {useState, useEffect} from 'react';
import colors from '../../Common/Colors';
//import string from '../../Common/String';
import style from '../../Common/styles';
import GreenButton from '../../components/GreenButton';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import {ApiHelper, FormApiHelper} from '../../Service/Fetch';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

//import { ServiceUrl } from '../../Common/String'

//Import all required component
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import {Image} from 'react-native-elements';
import ImageCropPicker from 'react-native-image-crop-picker';

const EditProfileTherapist = () => {
  const [data, setData] = useState({
    password: '',
    confirmPassword: '',
    isLoading: false,
    uniqueId: null,
    profileImage : null,
    signature: null,
    focused : false
  });

  useEffect(() => {
    setTimeout(async () => {
      try {
        const uniqueId = await AsyncStorage.getItem(
          AsyncStorageKey.userUniqueId,
        );
        let tempImage = await AsyncStorage.getItem(AsyncStorageKey.image);
        let signImage = await AsyncStorage.getItem(AsyncStorageKey.signature);
        //console.log('uniqueid', uniqueId);
        setData({
          ...data,
          isLoading: false,
          password: '',
          confirmPassword: '',
          profileImage:tempImage,
          signature: signImage,
          uniqueId : uniqueId,
        });
      } catch (e) {
        // saving error
      }
    }, 100);
  }, [data.focused]);
  const changePassword = async () => {
    //console.log('change');
    if (data.password.trim().length == 0) {
      //console.log('failed');
      return;
    }

    if (data.confirmPassword.trim().length == 0) {
      //console.log('failed 2');
      return;
    }

    setData({
      ...data,
      isLoading: true,
    });

    let dataObj = {password: data.password};

    ApiHelper(
      ServiceUrl.base_url + ServiceUrl.setPassword + data.uniqueId,
      dataObj,
      'PUT',
    ).then((response) => {
      setData({
        ...data,
        isLoading: false,
      });
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Response ==>', response);
        ShowAlert('Your password has been changed successfully! ');
        setData({
          ...data,
          password: '',
          confirmPassword: '',
        });
      } else {
        ShowAlert(response.errorMessages[0]);
      }
    });
  };
  const openGallery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      //console.log(image);
      let fileSize = image.size/(1024*1024)
      console.log(fileSize);
      if(fileSize > 2){
        ShowAlert("Please upload file having size MAX 2MB")
      }
      else
        UpdateProfileImage(image);
    });
  };

  const UpdateProfileImage = (image) => {
    setData({
      ...data,
      isLoading: true,
    });
    var formdata = new FormData();
    const photo = {
      uri: image.path,
      type: image.mime,
      name: 'profileImg',
    };
    formdata.append('profileImage', photo);
    FormApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.UpdateProfileImage,
      formdata,
      'PUT',
    ).then((response) => {
      setData({
        ...data,
        isLoading: false,
      });
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Response ==>', response);
        setData({
          ...data,
          profileImage: response.data.profilePicUrl,
        });
        storeData(response.data);
      } else {
        ShowAlert(response.message);
      }
    });
  };
  const storeData = async (userProfile) => {
    // //console.log('storing error name --->>>',userProfile.id.toString())
    try {
      await AsyncStorage.setItem(
        AsyncStorageKey.image,
        userProfile.profilePicUrl,
      );
    } catch (e) {
      // saving error
      //console.log('storing error --->>>', e);
    }
  };

  const openGalleryForSignature = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      let fileSize = image.size/(1024*1024)
      if(fileSize > 2){
        ShowAlert("Please upload file having size MAX 2MB")
      }
      else
        UpdateSignatureImage(image);
    });
  };

  const UpdateSignatureImage = (image) => {
    setData({
      ...data,
      isLoading: true,
    });
    var formdata = new FormData();
    const photo = {
      uri: image.path,
      type: image.mime,
      name: 'profileImg',
    };
    formdata.append('signature', photo);
    FormApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.UpdateProfileImage,
      formdata,
      'PUT',
    ).then((response) => {
      setData({
        ...data,
        isLoading: false,
      });
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Response ==>', response);
        setData({
          ...data,
          signature: response.data.signatureUrl
        });
        storeDataForSignature(response.data);
      } else {
        ShowAlert(response.message);
      }
    });
  };
  const storeDataForSignature = async (userProfile) => {
    // //console.log('storing error name --->>>',userProfile.id.toString())
    try {
      await AsyncStorage.setItem(
        AsyncStorageKey.signature,
        userProfile.signatureUrl,
      );
    } catch (e) {
      // saving error
      //console.log('storing error --->>>', e);
    }
  };
  return (
    <KeyboardAwareScrollView >
    <View style={styles.container}>
    <View>
      <Text style={style.header}>Profile Picture </Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-around',
        }}>
        {/* <Image source={{uri : data.profileImage}} style = {styles.profileImage}></Image> */}
      
          {data.profileImage ?
            <Image
              source={{uri:data.profileImage}}
              style={styles.profileImage}
            />
            :
           <Image source={require('../../../assets/images/defaultprofile.png')} 
           style = {styles.profileImage}></Image>
           
            }
        <View style={{marginTop: 20, marginLeft: 20, padding: 20, flex: 1}}>
          <GreenButton
            text="Change"
            onMethod={() => {
              openGallery();
            }}
          />
        </View>
      </View>
          
      <Text style={{fontFamily:'Roboto-Medium', fontSize:22, marginTop:30}}>Signature</Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-around',
        }}>
        {/* <Image source={{uri : data.profileImage}} style = {styles.profileImage}></Image> */}
        {data.signature ?
            <Image
              source={{uri:data.signature}}
              style={styles.profileImage}
            />
            :
           <Image source={require('../../../assets/images/defaultprofile.png')} 
           style = {styles.profileImage}></Image>
           
            }
        <View style={{marginTop: 20, marginLeft: 20, padding: 20, flex: 1}}>
          <GreenButton
            text="Change"
            onMethod={() => {
              openGalleryForSignature();
            }}
          />
        </View>
      </View>

      <Text style={styles.header}>Change Password </Text>

      <TextInput
        style={styles.textInput}
        value={data.password}
        placeholder="Enter New Password"
        returnKeyType="next"
        blurOnSubmit={false}
        autoCapitalize="none"
        onChangeText={(value) => {
          setData({
            ...data,
            password: value,
          });
        }}
      />

      <TextInput
        style={styles.textInput}
        value={data.confirmPassword}
        placeholder="Confirm New Password"
        returnKeyType="next"
        blurOnSubmit={false}
        autoCapitalize="none"
       // secureTextEntry={true}
        onChangeText={(value) => {
          setData({
            ...data,
            confirmPassword: value,
          });
        }}
      />
  </View>
      <View style={{marginTop: 0,paddingVertical:80}}>
        <GreenButton
          text="Submit"
          onMethod={() => {
            changePassword();
          }}
        />
      </View>
      {data.isLoading ? ShowLoader() : null}
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
   
    //backgroundColor: '#eaf1fe',
    
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    borderColor: colors.WHITE,
    borderWidth: 3,
  },
  buttonStyle: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 40,
    width: 120,
  },
  SubmitbuttonStyle: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    height: 50,
    width: 315,
  },
  buttonText: {
    fontFamily: 'Roboto-Medium',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginTop: 40,
  },
  textInput: {
    backgroundColor: colors.GRAY_LIGHT_BG,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 0.3,
    borderColor: colors.TEXT_BLUE,
    padding: 15,
    fontSize: 18,
  },
});
export default EditProfileTherapist;
