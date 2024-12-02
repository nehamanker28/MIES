import React, { useState, useRef, useEffect } from 'react';

//Import all required component
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Button,
    Platform,
    PermissionsAndroid,
    Dimensions
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from "../../Common/Colors";
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import GreenButton from '../../components/GreenButton';
import Modal from 'react-native-modal';
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes';
import moment from 'moment'
import DocumentPicker from 'react-native-document-picker';
//import { uploadFiles } from 'react-native-fs';
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { ApiHelper, FormApiHelper, getApiHelper } from '../../Service/Fetch'
// import { SafeAreaProvider, } from 'react-native-safe-area-context';
// import { BottomSheet, ListItem } from 'react-native-elements'
import RBSheet from "react-native-raw-bottom-sheet"
import ImageCropPicker from 'react-native-image-crop-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import PDFView from 'react-native-view-pdf';
import {openFile} from '../../components/fileViewer';
import { useIsFocused } from "@react-navigation/native";
import * as mime from 'react-native-mime-types';

const ItemSeparatorView = () => {
        return (
          // FlatList Item Separator
          <View
              style={{
                  height: 10,
                  width: 15,
                  //backgroundColor: '#ffff'
              }}
          />
        );
      };

const ViewSharedCaseNote = ({ navigation, route }) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('')
  const refRBSheet = useRef();
  const [attachment, setAttachment] = useState([])
  const [caseNoteId, setCaseNoteId] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState(null);
  const [signature, setSignature] = useState(route.params.session.caseNoteDTO.therapistSignatureKey)
  const [icd, setICD] = useState([]);
  const [cpt, setCPT] = useState([]);
  const [selectedCpt, setSelectedCpt] = useState(0)
  const [selectedICD, setSelectedICD] = useState(0)
  const [duration, setDuration] = useState(0)
  const [fee, setFee] = useState(0)
  const [unit, setUnit] = useState(0)
  const [isAttach, setIsAttach] = useState(false)
  const [fileURL, setFileURL] = useState('')

  const [driveName, setDriveName] = useState('')
  const [billingDetail, setBillingDetail] = useState()
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      try {
        const value = await AsyncStorage.getItem(AsyncStorageKey.billingCompany);
        
        if (value !== null) {
          // We have data!!
          
          let obj = JSON.parse(value)
          setBillingDetail(obj)
        }
      } catch (error) {
        // Error retrieving data
        console.log('err0r ----->>>',error)
      }
    }
    fetchData();
  }, [isFocused]);

  const selectICDId = (item) => {
    ////console.log('item icd --->>',item)
    setSelectedICD(item.value)
  }

  const selectCPTId = (item) => {
    ////console.log('item cpt --->>',item)
    setSelectedCpt(item.value)
    setFee(item.fee)
    setDuration(item.duration)
  }

  const getICDCodes = () => {
    setIsLoading(true)
    //route.params.session.caseNoteDTO.sessionId
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getICDCodes + route.params.session.caseNoteDTO.sessionId, 'GET')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          setIsLoading(false)
          var arr = []
          response.data.map((item, index) => {
            //console.log('ICD-------------->>>',item)
            if (item.description != null && item.id != null) {
              arr.push({ label: item.description, value: item.id })
            }
          })
          setICD(arr)
        } else {
          ShowAlert(response.message)
        }
      })
  }

  const getCPTCodes = () => {
    setIsLoading(true)
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getCPTCodes + route.params.session.caseNoteDTO.sessionId, 'GET')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          setIsLoading(false)
          var arr = []
          response.data.map((item, index) => {
            ////console.log('cpt-------------->>>',item)
            if (item.description != null && item.id != null) {
              arr.push({ label: item.description, value: item.id, fee: item.maxFee, duration: item.duration })
            }
          })
          setCPT(arr)
        } else {
          ShowAlert(response.message)
        }
      })
  }

  const enterUnit = (text) => {

    let unit = parseInt(text)
    setFee(fee * unit)
    //setDuration( )
    setUnit(unit)
  }

  const renderItem = ({ item }) => (
    <View style={{ borderRadius: 20 }}>
      <Image source={item.image} style={{ width: 120, height: 80 }}></Image>
    </View>
  );


  const toggleModal = (item) => {
    //console.log(item)
    setFileURL(item)
    setModalVisible(!isModalVisible);
  };
  const onTypeDescription = (text) => {
    setDescription(text)
  }

  const openGallery = () => {

    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      //cropping: true,
    }).then((image) => {
      refRBSheet.current.close()
      addAttachmentApi(image, false)
    });
  }

  const openDocumentPicker = async () => {

    try {
      let res ;
      if(Platform.OS == 'android'){
        res = await DocumentPicker.pick({
          type: ['image/*','application/pdf','application/msword']
        });
      }
      else{
        res = await DocumentPicker.pick({
          type: ['public.image','com.adobe.pdf','com.microsoft.word.doc']
        });
      }
      refRBSheet.current.close()
      addAttachmentApiForFiles(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }


  const uploadFiles = () => {
    refRBSheet.current.open()
  }

  const addAttachmentApiForFiles = (file) => {
    // setIsAttach(true)
    setIsLoading(true)

    var data = new FormData();
    const fileObj = {
      uri: file.uri,
      type: file.type,
      name: file.name
    };
    //console.log(' fileObj ---->>',fileObj)

    data.append('profileImage', fileObj);

    FormApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.addAttachmentForCaseNote,
      data,
      'POST',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        let AttachData = response.data
        setAttachment([...attachment, AttachData])
        setIsAttach(true)
        setIsLoading(false)
      } else {
        ShowAlert(response.message);
      }
    });
  }

  const addAttachmentApi = (file, isFile) => {
    // setIsAttach(true)
    setIsLoading(true)
    var name
    if (isFile) {
      name = file.name
    } else {
      name = 'profileImg'
    }

    var data = new FormData();
    const fileObj = {
      uri: file.path,
      type: file.mime,
      name: name
    };
    ////console.log(' fileObj ---->>',fileObj)

    data.append('profileImage', fileObj);

    FormApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.addAttachmentForCaseNote,
      data,
      'POST',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        let AttachData = response.data
        setAttachment([...attachment, AttachData])
        //console.log('attach --->>>' ,attachment)
        setIsAttach(true)
        setIsLoading(false)
      } else {
        ShowAlert(response.message);
      }
    });
  }

  const uploadSignature = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      //console.log("image ---------->>>",image);
      let fileSize = image.size/(1024*1024)
      if(fileSize > 2){
        ShowAlert("Please upload file having size MAX 2MB")
      }
      else
        UpdateSignatureImage(image);
    });
  }

  const UpdateSignatureImage = (image) => {

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
      if (response.code >= 200 && response.code <= 299) {
        ////console.log('Response ==>', response);
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
    setSignature(userProfile.signatureUrl)
  };

  
  const downloadImage = (imageURL) => {
    //console.log(imageURL)
    let date = new Date();
    let ext = 'jpg';
    const { config, fs } = RNFetchBlob;
    let options = {
      fileCache: true,
      appendExt: ext,
    };
    config(options)
      .fetch('GET', imageURL.key)
      .then(res => {
        // Showing alert after successful downloading
        //console.log('res -> ', JSON.stringify(res));
        CameraRoll.save(res.path())
          .then(alert('File Downloaded Successfully.'))
      });
    //}
  };
  const downloadVideo = async (videoURL) => {
    const granted = await getPermissionAndroid();
    if (!granted) {
      return;
    }
    const { config, fs } = RNFetchBlob;
    let ext = 'mov';
    let options = {
      fileCache: true,
      appendExt: ext,
    }
    config(options)
      .fetch('GET', videoURL.key)
      .then(res => {
        //console.log('path',res.path())
        CameraRoll.save(res.path())
          .then(alert('File Downloaded Successfully.'))
      });
  };
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
          //console.log('path',res)
           alert('File Downloaded Successfully.')
          //   CameraRoll.save(res.path())
          // .then(alert('Document Downloaded Successfully.'))
          }
      });
  };
  const AttachRenderItem = ({ item }) => (
    <View style={{ backgroundColor: colors.GRAY_LIGHT_BG, padding: 20, flexDirection: 'row' }}>
      <View style={{ backgroundColor: '#387af6', borderRadius: 20, width: 15, height: 15 }} />
      <View style={{ marginStart: 20 }}>
        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 18, color: colors.BLACK, marginTop: 0, padding: 0 }}>{item.postedBy.firstName}</Text>
        {/* <Text style = {{  fontFamily :'Roboto',fontSize : 16,color : colors.BLACK}}>{moment(Queries.queryDate).format('DD MMMM, YYYY ')}</Text> */}
        <Text style={styles.text2}>{item.reply}</Text>
        {item.attachments == 0 ? <View></View> :
          <FlatList
            horizontal={true}
            style={styles.FlatListStyle}
            data={item.attachments}
            renderItem={renderItem1}
            keyExtractor={(item, index) => 'index' + index}
            ItemSeparatorComponent={ItemSeparatorView}
          />
        }
        {item.translatedReply ?
          <View style={{ backgroundColor: '#e8f1ff', paddingHorizontal: 40, marginTop: 20 }}>

            <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: colors.BLACK, }}>{route.params.session.interpreterName} - Translator</Text>
            <Text style={styles.text1}>{item.translatedReply}</Text>
          </View>
          :
          <View></View>
        }
      </View>
    </View>
  );
  const renderItem1 = ({ item }) => (
    <View style={{ marginTop: 20 }}>
      {(item.fileType.includes('video')) ? (
        <TouchableOpacity
          style={{ marginVertical: 20, marginRight: 5 }}
          onPress={() => toggleModal(item)}>
          <Image
            source={require('../../../assets/images/youtube.png')}
            style={{
              width: 120,
              height: 80,
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 5,
            }}></Image>
        </TouchableOpacity>
      ) : item.fileType == 'application/pdf' ? (
        Platform.OS == 'ios' ? (
          <TouchableOpacity onPress={() => downloadPdf(item)}>
            <PDFView
              fadeInDuration={250.0}
              style={{ width: 120, height: 120, padding: 10 }}
              resource={item.key}
              resourceType="url"
              onLoad={() => console.log('pdf rendered')}
              onError={(error) => console.log('Cannot render PDF', error)}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => toggleModal(item)}>
            <PDFView
              fadeInDuration={250.0}
              style={{ width: 120, height: 120, padding: 10 }}
              resource={item.key}
              resourceType="url"
              onLoad={() => console.log('pdf rendered')}
              onError={(error) => console.log('Cannot render PDF', error)}
            />
          </TouchableOpacity>
        )
      ) :
        (item.fileType.includes('image')) ?
          <TouchableOpacity
            style={{ marginVertical: 0, marginRight: 5 }}
            onPress={() => toggleModal(item)}>
            <Image
              source={{ uri: item.key }}
              style={{
                width: 120,
                height: 80,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 5,
              }}></Image>
          </TouchableOpacity>
          :
          <View>
            <TouchableOpacity
              style={{ marginVertical: 0, marginRight: 5 }}
              onPress={() => openFile(item)}>
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
          </View>}
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollViewStyle}>
        <View style={styles.ListViewContainer}>
          {
            billingDetail != null ?
              <View>
                <Text style={styles.text1}>Billing Details</Text>
                <Image source={{ uri: billingDetail.logoUrl }} style={{ width: 250, height: 80, resizeMode: 'contain' }} ></Image>
                <Text style={{
                  fontFamily: 'Roboto-Bold',
                  fontSize: 16,
                  color: colors.BLACK,
                  marginTop: 10,
                }}>{billingDetail.name}</Text>
                <Text style={styles.text2}>{billingDetail.address1}, {billingDetail.address2}, {billingDetail.city}, {billingDetail.state}, {billingDetail.country}, {billingDetail.zipCode}</Text>
              </View>
              :
              null
          }
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.text1}>Therapy</Text>
              <Text style={styles.text2}>{route.params.session.therapy}</Text>
              <Text style={styles.text1}>Date </Text>
              <Text style={styles.text2}>{moment(route.params.session.startDateTime).format('yyyy-MM-DD')}</Text>
              <Text style={styles.text1}>Child</Text>
              <Text style={styles.text2}>{route.params.session.childName}</Text>
            </View>
            <View>
              <Text style={styles.text11}>Status</Text>
              <Text style={styles.text21}>Draft</Text>
              <Text style={styles.text11}>Duration</Text>
              <Text style={styles.text21}>{route.params.session.duration}</Text>

              <Text style={styles.text11}>Interpreter</Text>
              {route.params.session.interpreterName == null ?
                <Text style={styles.text21}>None</Text> :
                <Text style={styles.text21}>{route.params.session.interpreterName.length < 10 ? route.params.session.interpreterName
                  : route.params.session.interpreterName.substring(0, 12)}</Text>}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.text1}>Case Note</Text>
            <View>
              <Text
                style={{ backgroundColor: colors.WHITE, marginTop: 10, height: 140, borderRadius: 10, borderWidth: 0.5, paddingLeft: 10, fontSize: 16, textAlignVertical: 'top' }}>
                {route.params.session.caseNoteDTO.description}
              </Text>
            </View>
          </View>
          {route.params.session.caseNoteDTO.attachmentsList == null ? <View></View> :
            <View>

              <FlatList
                horizontal={true}
                style={styles.FlatListStyle}
                data={attachment}
                renderItem={renderItem1}
                keyExtractor={(item, index) => 'index' + index}
                ItemSeparatorComponent={ItemSeparatorView}
              />
            </View>
            }
        </View>
        {
          isLoading ? ShowLoader() : null
        }
        <Modal isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.box2}>
          {(fileURL.fileType == 'video/quicktime') || (fileURL.fileType == 'video/mp4') ?
            <View>
              <VideoPlayer
                hideControlsOnStart={false}
                video={{ uri: fileURL.key }}
                videoWidth={1600}
                videoHeight={900}
              />
              <View style={{ height: 38, padding: 10, marginBottom: 20 }}>
                <GreenButton text="Download" onMethod={() => downloadVideo(fileURL)} />
              </View>
            </View>
            :
            (fileURL.fileType == 'application/pdf') ?
              <View>
                <PDFView
                  fadeInDuration={250.0}
                  style={{
                    width: 300,
                    height: 295, padding: 10,
                  }}
                  resource={fileURL.key}
                  resourceType='url'
                  onLoad={() => console.log('PDF rendered')}
                  onError={(error) => console.log('Cannot render PDF', error)}
                />
                <View style={{ height: 38, padding: 10, marginBottom: 20 }}>
                  <GreenButton text="Download" onMethod={() => downloadPdf(fileURL)} />
                </View>
              </View>
              :
              (fileURL.fileType == 'image/png' || fileURL.fileType == 'image/jpeg') ?
                <View>
                  <Image source={{ uri: fileURL.key }}
                    style={{
                      width: 300,
                      height: 295,
                      borderColor: '#d8e4f1',
                      borderWidth: 2,
                      borderRadius: 10,
                      padding: 10,
                    }}></Image>
                  {/* <View style={{height: 38, padding: 10,marginBottom:20}}>
            <GreenButton text="Download" onMethod={() => downloadImage(fileURL)} />
          </View> */}
                </View>
                :
                null
          }
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding:20
        
    },
    FlatListStyle: {
        backgroundColor:'white'
    },
    ListViewContainer: {
        borderRadius: 15,
       // backgroundColor: '#D3D3D3',
        // marginVertical: 10,
        padding :20
    },
    text1 :{
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop :30,
       
    },
    text2 :{
        fontFamily :'Roboto',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :20,
        flex:1,
    },
    text11 :{
        textAlign : 'right',
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop :30,
    },
    text21 :{
        textAlign : 'right',
        fontFamily :'Roboto',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :20,
    },
    text3 :{
        fontFamily :'Roboto',
        fontSize : 16,
        color : colors.GREY,
        marginTop :20,
        
    },
    scrollViewStyle: {
          backgroundColor: 'white',
          flex: 1 ,
          //flexGrow :0.05,  
    },
    box2: {
        opacity: 0.9,
        marginVertical: 150,
        backgroundColor: 'white',
        borderRadius: 20,
        flex :1,
        padding :20,
        //marginBottom:40,
        //right:90
      },
      pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
})
export default ViewSharedCaseNote
