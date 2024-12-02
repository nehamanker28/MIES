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
  Platform,
  ScrollView,KeyboardAvoidingView,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
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
import PDFView from 'react-native-view-pdf';
import FileViewer, { open } from 'react-native-file-viewer';
// import OpenFile from 'react-native-doc-viewer';
import RNFS from 'react-native-fs';
import {openFile} from '../../components/fileViewer';

const formsByFamilymemberID = ({ navigation , route}) => {
    const isFocused = useIsFocused();
    const [therapistId,settherapistId] = useState(0)
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];
  const [data, setData] = useState({
    content: [],
    isLoading: false,
  });

  const [formID,setFormID] = useState(0);

  const toggleModal = (item) => {
    console.log("fileurl ",item.key,item.fileType)
    setFileURL(item)
    //openFile(item)
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [fileURL, setFileURL] = useState('')
  
  const DownloadingPlatform = (item) =>{
    Platform.OS == 'ios' ? downloadPdf(item) : openFile(item)
  }

  const downloadPdf = async(item) => {
  //  setData({
  //    isLoading:true
  //  })
  console.log("downloading")
    const { config, fs } = RNFetchBlob;
    let ext = item.fileType;
    let ext1 = mime.extension(item.fileType)
    let date = new Date();
    let DocumentDir = fs.dirs.DocumentDir;
    let options = {
      fileCache: true,
      appendExt : ext,
      //mediaScannable : true,
      path : DocumentDir + '/miesdoc.' + ext1
    }
    console.log(options)
    config(options)
    .fetch('GET', item.key)
    .then(res => {
        if(Platform.OS == 'ios'){
          console.log(res.path())
          RNFetchBlob.ios.previewDocument(res.path())
        }
        else{
        RNFetchBlob.android.actionViewIntent(res.path(),item.fileType)
        console.log('path',res.path())
         alert('File Downloaded Successfully.')
        //   CameraRoll.save(res.path())
        // .then(alert('Document Downloaded Successfully.'))
        }
    });
};

 
  const getFamily = () => {
    setData({
      ...data,
      isLoading: true,
    });
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getformsDetailbyFamilyID + route.params.family.familyMember.id , 'GET').then(
      (response) => {
        if (response.code >= 200 && response.code <= 299) {
          setData({
            ...data,
            content: response.data,
            isLoading: false,
          });
          ////console.log('FAMILY === ',response.data[0].fileFormDto.fileType)
        } else {
          ShowAlert(response.message);
        }
      },
    );
  };


  useEffect(() => {
    if (isFocused) {
        //getTherapistProfile();
        getFamily();
      }
    return () => {};
  }, [isFocused]);
 
  const renderItem = ({item}) => (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{justifyContent: 'center', paddingLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Roboto-Bold', fontSize: 18}}>
                {item.fileName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-around',
              }}>
              <View>
                {Platform.OS == 'ios' ? (
                  <TouchableOpacity onPress={() => downloadPdf(item)}>
                    <Image
                      source={require('../../../assets/images/defaulFile.png')}
                      style={{
                        width: 80,
                        height: 80,
                        borderColor: 'black',
                        //borderWidth: 1,
                        borderRadius: 5,
                      }}></Image>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => openFile(item)}>
                    <Image
                      source={require('../../../assets/images/defaulFile.png')}
                      style={{
                        width: 80,
                        height: 80,
                        borderColor: 'black',
                        //borderWidth: 1,
                        borderRadius: 5,
                      }}></Image>
                  </TouchableOpacity>
                )}
              </View>
              {/* view for family uploaded form */}
              <View>
                {item.fileFormDto == null ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      width: 90,
                      backgroundColor: '#e8f1ff',
                      borderRadius: 10,
                      height: 80,
                    }}>
                    <Text>Not Uploaded</Text>
                  </View>
                ) : 
                Platform.OS == 'ios' ? (
                  <TouchableOpacity
                    onPress={() => downloadPdf(item.fileFormDto)}>
                    <Image
                      source={require('../../../assets/images/defaulFile.png')}
                      style={{
                        width: 80,
                        height: 80,
                        borderColor: 'black',
                        //borderWidth: 1,
                        borderRadius: 5,
                      }}></Image>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => openFile(item.fileFormDto)}>
                    <Image
                      source={require('../../../assets/images/defaulFile.png')}
                      style={{
                        width: 80,
                        height: 80,
                        borderColor: 'black',
                        //borderWidth: 1,
                        borderRadius: 5,
                      }}></Image>
                  </TouchableOpacity>
                )
                }
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableOpacity
                style={styles.UploadButton}
                onPress={() =>
                  navigation.navigate('uploadForm', {
                    Title: 'Update',
                    familyMemberId: route.params.family.familyMember.id,
                    sender: 'ROLE_THERAPIST',
                    therapistId: therapistId,
                    formID: item.id,
                  })
                }>
                <Image
                  source={require('../../../assets/images/upload.png')}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    // color :  '#0e84d2',
                    // tintColor: '#0e84d2',
                  }}></Image>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 14,
                    color: '#387af6',
                    marginStart: 10,
                  }}>
                  Update Form
                </Text>
              </TouchableOpacity>
              {item.fileFormDto == null ? (
                <View style={{width: 150}}></View>
              ) : (
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => DownloadingPlatform(item.fileFormDto)}>
                  <Image
                    source={require('../../../assets/images/forms.png')}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      tintColor: '#fff',
                    }}></Image>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Medium',
                      fontSize: 14,
                      color: '#fff',
                      marginStart: 10,
                    }}>
                    Download Form
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={{height: 1, backgroundColor: 'gray'}}></View>
    </View>
    // </TouchableOpacity>
  );
  const ItemSeparatorView = () => {
    return (
      // FlatList Item Separator
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#C8C8C8',
          marginBottom:10
        }}
      />
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <FlatList
          style={{backgroundColor: 'white',marginBottom:20}}
          data={data.content}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'item' + index}
        />
        <ItemSeparatorView/>
        <View style={{height :20,margin:20}}>
             <GreenButton text='Upload Form' onMethod={() => navigation.navigate('uploadForm', {Title : 'Upload',familyMemberId:route.params.family.familyMember.id,sender:'ROLE_THERAPIST',therapistId:route.params.Tid})} />
         </View> 
         <Modal isVisible={isModalVisible}
                        onBackdropPress={() => setModalVisible(false)}
                        style = {styles.box2}>
                        {(fileURL.fileType == 'video/quicktime')|| (fileURL.fileType == 'video/mp4')?  
                        <View>
                        <VideoPlayer
                        hideControlsOnStart = {false}
                        video={{ uri: fileURL.key }}
                        videoWidth={1600}
                        videoHeight={900}
                          />
                          <View style={{height: 38, padding: 10,marginBottom:20}}>
            <GreenButton text="Download" onMethod={() => downloadVideo(fileURL)} />
          </View>
                          </View>
          :
          (fileURL.fileType == 'application/pdf') ?
          <View>
          <PDFView
          fadeInDuration={250.0}
          style={{ width: 300,
            height: 295, padding:10, }}
          resource={fileURL.key}
          resourceType= 'url'
          onLoad={() => console.log('PDF rendered')}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
         
          </View>
          :
          (fileURL.fileType == 'image/png' || fileURL.fileType == 'image/jpeg')  ?
          <View>
          <Image source={{uri: fileURL.key}}
          style={{
             width: 300,
            height: 295,
            borderColor: '#d8e4f1',
            borderWidth: 2,
            borderRadius: 10,
            padding:10,
          }}></Image>
           
          </View>
          :
          <View></View>}
                       
                    </Modal>
        </View>
      {data.isLoading ? ShowLoader() : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom:20,
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
    paddingHorizontal:15,
    paddingVertical:5,
   // padding: 15,
    justifyContent: 'center',
   
    //borderColor: '#0e84d2',
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
    backgroundColor: '#0fd683',
   
    marginStart: 20,
    borderRadius: 20,
    borderColor: '#e2e2e2',
    alignItems: 'center',
    paddingHorizontal:15,
    paddingVertical:5,
   // padding: 15,
    justifyContent: 'center',
   
    //borderColor: '#0e84d2',
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

export default formsByFamilymemberID;
