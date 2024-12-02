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
import { ar, el } from 'date-fns/locale';
import * as mime from 'react-native-mime-types';

const ItemSeparatorView = () => {
        return (
          // FlatList Item Separator
          <View
              style={{
                  height: 10,
                  width: 15,
                  backgroundColor: '#ffff'
              }}
          />
        );
      };

const SubmitCaseNote = ({ navigation, route }) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('')
  const refRBSheet = useRef();
  const refICDValue = useRef();
  const refPCDValue = useRef();
  const [attachment, setAttachment] = useState([])
  const [caseNoteId, setCaseNoteId] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [value,setValue] = useState(null)
  const [ICDvalue, setICDvalue] = useState(null);
  const [CPTvalue, setCPTvalue] = useState(null);
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
  const [item,setItem] = useState({})
  const [driveName, setDriveName] = useState('')
  const [billingDetail, setBillingDetail] = useState()
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      try {
        const value = await AsyncStorage.getItem(AsyncStorageKey.billingCompany);
        if (value!= null) {
          // We have data!!
          //console.log('Valuee',value)
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

  useEffect(() => {
    //console.log('sessions ------>',route.params.session)
    if (Platform.OS == 'android') {
      setDriveName('Drive')
    } else {
      setDriveName('iCloud')
    }

    setDescription(route.params.session.caseNoteDTO.description)
    setCaseNoteId(route.params.session.caseNoteDTO.id)
    if (route.params.session.caseNoteDTO != null) {
    //console.log('attach --->>>',route.params.session.caseNoteDTO)
      setAttachment(route.params.session.caseNoteDTO.attachmentsList)
    }
    getICDCodes()
    getCPTCodes()
    return () => {

    }
  }, [])

  const selectICDId = (item) => {
   console.log('item icd --->>',item.label.substring(0,7))
    setSelectedICD(item.value)
   // setICDvalue(item.label.substring(0,7))
  }

  const selectCPTId = (item) => {
    console.log('item cpt --->>',item)
    setItem(item)
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
              arr.push({ label: item.id + ' - ' +item.description, value: item.id })
            }
          })
          setICD(arr)
          
          const filteredData = arr.filter(item => item.value == (route.params.session.caseNoteDTO.diagnosisId ?? 0))
          

          if(filteredData[0] != null){
            
            setICDvalue(filteredData[0].label)
            setSelectedICD(filteredData[0].value)
          }
          
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
          // console.log('arrr CPTvalue = ',arr)
          // console.log('arrr length = ',route.params.session.caseNoteDTO.cptId)
         const filteredData = arr.filter(item => item.value == (route.params.session.caseNoteDTO.cptId ?? 0))
         //console.log('label of CPTvalue = ',filteredData[0].label)

         if(filteredData[0] != null){
          setCPTvalue(filteredData[0].label)
          setSelectedCpt(filteredData[0].value)
          setFee(filteredData[0].fee)
          setDuration(filteredData[0].duration)
         }
         
        } else {
          ShowAlert(response.message)
        }
      })
  }

  const enterUnit = (text) => {
    console.log(text)
    if(text) {
      let unit = parseInt(text)
     // setFee(fee * unit)
      //setDuration( )
      setUnit(unit)
    }
   else{
    setFee(item.fee)
    //setDuration( )
    setUnit(0)
   }
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
      ////console.log("image ---------->>>",image);
      //console.log('types mime ------>>>', image.mime);
      //console.log('types path ------>>>', image.path);
      //console.log('types type ------>>>', image.type);
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
    console.log('types00 ------>>>', res.uri, res.type, res.name, res.size);
      //console.log('types mime ------>>>', res.mime);
      //console.log('types path ------>>>', res.path);
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
    setIsLoading(true)
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
      setIsLoading(false)
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

  const SaveCaseNoteDraftApi = () => {

    console.log('SaveCaseNoteDraftApi calling',selectedCpt,selectedICD)

    setIsLoading(true)
  
    let data = {
      "description": description, 'sessionId': route.params.session.caseNoteDTO.sessionId,
      "attachmentsList": attachment, 'id': caseNoteId, 'cptId': selectedCpt, 'diagnosisId': selectedICD,
      'unit': unit, 'cptId': selectedCpt
    }
   // setIsLoading(false)
    ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.addCaseNote, data, 'PUT')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          setIsLoading(false)
          navigation.pop()
        } else {
          setIsLoading(false)
          ShowAlert(response.message)
        }
      })
  }
  const submitCaseNoteApi = () => {
    console.log('addCaseNoteApi calling',selectedCpt,selectedICD)
    setIsLoading(true)
    if (selectedICD == 0 && selectedCpt == 0) {
      setIsLoading(false)
      ShowAlert("Please select ICD Code and CPT Code")
     return
    }
    if (selectedCpt == 0) {
      setIsLoading(false)
      ShowAlert("Please Select CPT code")
  return
}
   if (selectedICD == 0) {
    setIsLoading(false)
    ShowAlert("Please Select ICD 10 code")
   return
  }
    if (signature == null) {
    setIsLoading(false)
    ShowAlert("Please upload a signature before submitting")
    return
}
  if (description.trim().length == 0) {
    setIsLoading(false)
    ShowAlert("Please Enter Soap Note ")
   return
  }
    let data = {
      "description": description, 'sessionId': route.params.session.caseNoteDTO.sessionId,
      "attachmentsList": attachment, 'id': caseNoteId, 'cptId': selectedCpt, 'diagnosisId': selectedICD,
      'units': unit, 'cptId': selectedCpt ,'billableRate' : fee
    }
    console.log('data for case NOtes =====',data)
   // setIsLoading(false)
    ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.addCaseNote, data, 'POST')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          setIsLoading(false)
          navigation.pop()
        } else {
          setIsLoading(false)
          ShowAlert(response.message)
        }
      })
  }
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
              width: 90,
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
                width: 90,
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
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => deleteAttachment(item)}>
          <Image
            style={{
              width: 15,
              height: 15,
              borderColor: 'black',
              //borderWidth: 1,
              borderRadius: 5,
            }}
            source={require('../../../assets/images/close.png')}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
  const deleteAttachment = (itemID) => {
    const filteredData = attachment.filter(item => item.id !== itemID.id)
    console.log(filteredData)
    setAttachment(filteredData)
  }

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
              <Text style={styles.text2}>{
                route.params.session.childName.length < 15 ? route.params.session.childName
                  : route.params.session.childName.substring(0, 12)}</Text>
            </View>
            <View>
              <Text style={styles.text11}>Status</Text>
              <Text style={styles.text21}>Draft</Text>
              <Text style={styles.text11}>Duration</Text>
              <Text style={styles.text21}>{route.params.session.duration}</Text>

              <Text style={styles.text11}>Interpreter</Text>
              {route.params.session.interpreterName == null ?
                <Text style={styles.text21}>None</Text> :
                <Text style={styles.text21}>{
                  route.params.session.interpreterName.length < 10 ? route.params.session.interpreterName
                  : route.params.session.interpreterName.substring(0, 12)}
                  </Text>}
            </View>
          </View>

          <View style={{ marginVertical: 20, marginTop: 30 }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>ICD 10 Code</Text>
          </View>

          <DropDownPicker
            items={icd}
            placeholder = {ICDvalue ? ICDvalue.substring(0,30)+'..':'Select ICD Code'}
           // defaultValue= {ICDvalue}
            //onChangeItem={item => selectICDId(item)}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
            style={{ backgroundColor: '#fafafa' }}
            containerStyle={{ height: 50 }}
            onChangeItem={item => selectICDId(item)}
            zIndex={99999}
            labelStyle={{
              fontFamily: 'Roboto-Light',
              fontSize: 16,
              color: '#000',
              textAlign: 'center',
              
              
            }}
            //labelLength = {35}
            selectedLabelLength = {35}
            selectedLabelStyle = {{
              textAlign: 'left',
            }}
          />

          <View style={{ marginVertical: 20, marginTop: 30 }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>CPT Code</Text>
          </View>

          <DropDownPicker
            items={cpt}
            placeholder = {CPTvalue?CPTvalue.substring(0,30)+'..':'Select CPT Code'}
            placeholderStyle = {{flex:1,}}
           // defaultValue = {CPTvalue}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
            style={{ backgroundColor: '#fafafa' }}
            containerStyle={{ height: 50 }}
            onChangeItem={item => selectCPTId(item)}
            labelStyle={{
              fontFamily: 'Roboto-Light',
              fontSize: 16,
              textAlign: 'center',
              color: '#000'
            }}
            selectedLabelLength = {35}
            selectedLabelStyle = {{
              textAlign: 'left',
            }}
          />

          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, flex: 1 }}>Billable Rate</Text>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Duration/Unit</Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18, flex: 1 }}>${fee}/unit</Text>
            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>{duration} min/unit</Text>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Units</Text>
            <TextInput
              editable={true}
              style={{ borderWidth: 1, borderColor: '#d8e4f1', backgroundColor: '#f5f6fa', borderRadius: 5, height: 50, marginTop: 20, paddingHorizontal: 10 }}
              placeholder={'Enter Units'}
              onChangeText={(text) => enterUnit(text)}>
            </TextInput>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 20 }}>Therapist Signature</Text>
            {/* <Image source={{ uri: route.params.session.caseNoteDTO.therapistSignatureKey }} style={{width:50, height:50, marginTop:20}} ></Image> */}
            {
              signature != null ?
              <View style = {{flexDirection : 'row',alignItems:'center',justifyContent:'space-around'}}>
                <Image source={{ uri: signature }} style={{ width: 100, height: 100, marginTop: 10, borderRadius: 50 }} ></Image>
                <TouchableOpacity onPress={() => uploadSignature()} style={{ backgroundColor: '#0fd683', height: 45, width: 100, borderRadius: 5, justifyContent: 'center', alignItems: 'center' ,marginStart:0}}>
                  <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 15, color: 'white' }}>Update</Text>
                </TouchableOpacity>
              </View>
                :
                <TouchableOpacity onPress={() => uploadSignature()} style={{ backgroundColor: '#0fd683', height: 45, width: 208, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 15, color: 'white' }}>Upload</Text>
                </TouchableOpacity>
            }

          </View>
          {/* <View style={{marginTop:30}}>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18 }}>Client Signature</Text>
                            <Image source={{ uri: route.params.session.caseNoteDTO.familySignatureKey }} style={{width:50, height:50, marginTop:20}} ></Image>
                        </View> */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.text1}>SOAP Notes</Text>
            <View>
              <TextInput
                multiline={true}
                style={{ backgroundColor: colors.WHITE, marginTop: 10, height: 140, borderRadius: 10, borderWidth: 0.5, paddingLeft: 10, fontSize: 16, textAlignVertical: 'top' }}
                placeholder='Enter your reply'
                onChangeText={text => onTypeDescription(text)}>
                {route.params.session.caseNoteDTO.description}
              </TextInput>
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
              {/* <TouchableOpacity>
                                <Text style={{color: '#387af6'}}>Download all</Text>
                            </TouchableOpacity> */}
            </View>}
          <View style={{ marginTop: 20 }}>

            {
              isAttach ?
                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                  <TouchableOpacity style={{}} onPress={() => uploadFiles()}>
                    <Image source={require('../../../assets/images/attachment.png')} style={{ width: 40, height: 40, marginEnd: 10, resizeMode:'contain' }}></Image>
                  </TouchableOpacity>
                  <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: colors.BLACK, }}>{attachment.length} File attached</Text>
                </View>
                :
                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                  <TouchableOpacity style={{}} onPress={() => uploadFiles()}>
                    <Image source={require('../../../assets/images/attachment.png')} style={{ width: 40, height: 40, marginEnd: 10, resizeMode:'contain' }}></Image>
                  </TouchableOpacity>
                  <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: colors.BLACK, }}>Attach audio/video/image file</Text>
                </View>
            }
            <View style={{ height: 10, marginTop: 30 }}>
              {/* <GreenButton text='Save' onMethod={() => submitCaseNoteApi()} /> */}
              <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginTop: 20, justifyContent: 'center' }} onPress={() => SaveCaseNoteDraftApi()}>
                <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#387af6' }}>Save As Draft</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 10, marginTop: 60 ,marginBottom:60}}>
              {/* <GreenButton text='Save' onMethod={() => submitCaseNoteApi()} /> */}
              <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginTop: 20, justifyContent: 'center' }} onPress={() => submitCaseNoteApi()}>
                <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#387af6' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <RBSheet
          ref={refRBSheet}
          height={180}
          openDuration={280}
          closeOnDragDown={true}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}>
          <TouchableOpacity style={{ height: 60, width: 400, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} onPress={() => openGallery()}>
            <View style={{ backgroundColor: 'gray', height: 2, left: 0, right: 0, position: 'absolute', top: 0 }}></View>
            <Text>Gallery</Text>
            <View style={{ backgroundColor: 'gray', height: 2, left: 0, right: 0, position: 'absolute', bottom: 0 }}></View>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 60, width: 400, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} onPress={() => openDocumentPicker()}>
            <Text>{driveName}</Text>
            <View style={{ backgroundColor: 'gray', height: 2, left: 0, right: 0, position: 'absolute', bottom: 0 }}></View>
          </TouchableOpacity>

        </RBSheet>
        {
          isLoading ? ShowLoader() : null
        }
        <Modal isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.box2}>
          {(fileURL.fileType == 'video/quicktime') ?
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
                <View>

                </View>}

        </Modal>
      </ScrollView>

    </SafeAreaView>
  );

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        
    },
    FlatListStyle: {
        //backgroundColor:'white'
    },
    closeButton: {
      backgroundColor: '#000000',
      borderRadius: 20,
      borderColor: '#e2e2e2',
      alignItems: 'center',
      width: 20,
      height: 20,
      justifyContent: 'center',
     // marginStart: 20,
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
export default SubmitCaseNote
