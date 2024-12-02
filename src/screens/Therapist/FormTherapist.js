import React, {useState, useEffect,useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,KeyboardAvoidingView,
} from 'react-native';
import SearchBar from 'react-native-search-bar';
import {ApiHelper, getApiHelper} from '../../Service/Fetch';
import {ServiceUrl} from '../../Common/String';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import colors from '../../Common/Colors';
import GreenButton from '../../components/GreenButton';
import RBSheet from "react-native-raw-bottom-sheet"
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';

const FormTherapist = (props) => {
    const isFocused = useIsFocused();
    const [therapistId,settherapistId] = useState(0)
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];
  const [data, setData] = useState({
    content: [],
    isLoading: false,
  });

  const viewFamilyDetail = (item) => {
    //props.navigation.push('FamilySession', {'family':item})
     props.navigation.push('formsByFamilymemberID', {'family':item,'Tid':therapistId})
    
}

  const downloadPdf = async(pdfURL) => {
    
    const { config, fs } = RNFetchBlob;
    let ext = 'pdf';
    let date = new Date();
    let DocumentDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      appendExt : ext,
      addAndroidDownloads: {
      //Related to the Android only
        useDownloadManager: true,
        // notification: true,
        path:
        DocumentDir +
      '/pdf' +
        Math.floor(date.getTime() +
        date.getSeconds() / 2),
      description: 'Pdffile',
    },
    }
    //console.log(options)
    config(options)
    .fetch('GET', pdfURL.key)
    .then(res => {
        //console.log('path',res)
        if(Platform.OS == 'ios'){
          RNFetchBlob.ios.previewDocument(res.path())
        }
        else
         alert('File Downloaded Successfully.')
        //   CameraRoll.save(res.path())
        // .then(alert('Document Downloaded Successfully.'))
    });
};
  const getTherapistProfile = () => {
    ////console.log('get therapisst profile api call ---->>>');
    // setData({
    //   ...data,
    //   isLoading: true,
    // });
    getApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.getTherapistProfile,
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
          console.log('THEARPSIT ID ++++++',response.data.userProfile.id)
          settherapistId(response.data.userProfile.id)
        
      } else {
        if (result.code != 403 || result.code != 401 ) {
          ShowAlert(response.message);
        }
      }
    });
  };
 
  const getFamily = () => {
    setData({
      ...data,
      isLoading: true,
    });
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamily , 'GET').then(
      (response) => {
        if (response.code >= 200 && response.code <= 299) {
          setData({
            ...data,
            content: response.data.content,
            isLoading: false,
          });
          //console.log('FAMILY === ',response.data)
        } else {
          ShowAlert(response.message);
        }
      },
    );
  };



  useEffect(() => {
    if (isFocused) {
        getTherapistProfile();
        getFamily();
      }
    return () => {};
  }, [isFocused]);
 
  const renderItem = ({item}) => (
    <TouchableOpacity style={{ flex: 1 }} onPress={ () => viewFamilyDetail(item) }>
    <View style={{ flexDirection: 'row', padding: 20}}>
        
        <View style={{flex:1, flexDirection:'row'}}>
            <Image source={{uri: item.familyMember.profileUrl}} style={styles.profileImage}></Image>
            <View style={{ justifyContent:'center', paddingLeft:10}}>
                <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 18 }}>{item.familyMember.firstName}</Text>
            </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', alignContent:'space-between'}}>
            <Image source={require('../../../assets/images/arrow.png')} style={{width:20, height:20, marginLeft:10}} resizeMode='contain'></Image>
        </View>

    </View>
    <View style={{height:1, backgroundColor:'gray'}}></View>
</TouchableOpacity>

  );
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <FlatList
          style={{backgroundColor: 'white'}}
          data={data.content}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'item' + index}
        />
        </View>
      {data.isLoading ? ShowLoader() : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 3,
  },
  UploadButton: {
    borderRadius: 20,
    borderColor: '#e2e2e2',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
   
    borderColor: '#0e84d2',
    borderWidth: 1,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
   // marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    borderRadius: 20,
    marginStart: 20,
    borderColor: '#e2e2e2',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
    // marginStart :20,
    backgroundColor: '#0fd683',
    borderWidth: 1,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
   // marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box2: {
    //opacity: 0.9,
    marginVertical:100,
    backgroundColor: 'white',
    borderRadius: 20,
    //flex :1,
    //padding :20,
    //marginBottom:40,
    //right:90
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
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
}
});

export default FormTherapist;
