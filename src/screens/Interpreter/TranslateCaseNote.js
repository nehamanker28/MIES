import React, { useState, useEffect, useRef } from 'react';

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
    TextInput,
    Dimensions,
} from 'react-native';
import colors from "../../Common/Colors";
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import GreenButton from '../../components/GreenButton';
import Modal from 'react-native-modal';
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { ApiHelper,FormApiHelper ,getApiHelper} from '../../Service/Fetch'
import moment from 'moment'
import { setDate } from 'date-fns';
import RBSheet from "react-native-raw-bottom-sheet"
import ImageCropPicker from 'react-native-image-crop-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from "react-native-modal-dropdown-flat";
import { Value } from 'react-native-reanimated';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import PDFView from 'react-native-view-pdf';
import {openFile} from '../../components/fileViewer';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const TranslateCaseNote = ({ navigation, route }) => {

  const refRBSheet = useRef();
  const [driveName, setDriveName] = useState('')
  const [isModalVisible, setModalVisible] = useState(false);
  const [fileURL, setFileURL] = useState('')
  const [attachment, setAttachment] = useState([route.params.session.caseNoteDTO.attachmentsList])
  const [translateText, setTranslateText] = useState('')
  const [Familylanuages, setFamlanuages] = useState(route.params.session.caseNoteDTO.familyLanguages)
  const [LanuageID, setLanuageID] = useState(0)
  const [ICDvalue, setICDvalue] = useState(null);
  const [CPTvalue, setCPTvalue] = useState(null);
  const [duration, setDuration] = useState(0)
  const [fee, setFee] = useState(0)
  const [unit, setUnit] = useState(0)
  const [languageName, setlanguageName] = useState(route.params.session.caseNoteDTO.familyLanguages[0].languageName)
  const [items, setitems] = useState(
    [{
      label: '',
      value: ''
    }]
  )
  const [data, setData] = useState({
    isLoading: false,


  })
  const [billingDetail, setBillingDetail] = useState()
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('eeeeiiiiiii')
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
    getCPTCodes();
    getICDCodes();
  }, [isFocused]);

  const onSave = () => {

  }
  const getICDCodes = () => {
    setData({
      ...data,
      isLoading: true,
     })
    //route.params.session.caseNoteDTO.sessionId
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getICDCodes + route.params.session.caseNoteDTO.sessionId, 'GET')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          setData({
            ...data,
            isLoading: false,
           })
          var arr = []
          response.data.map((item, index) => {
            //console.log('ICD-------------->>>',item)
            if (item.description != null && item.id != null) {
              arr.push({ label: item.description, value: item.id })
            }
          })
          //setICD(arr)
          const filteredData = arr.filter(item => item.value == route.params.session.caseNoteDTO.diagnosisId)
          //console.log('label of ICDvalue = ',route.params.session.caseNoteDTO)
          if(filteredData[0] != null){
            setICDvalue(filteredData[0].label)
          }
          
        } else {
          ShowAlert(response.message)
        }
      })
  }

  const getCPTCodes = () => {
    setData({
      ...data,
      isLoading: true,
     })
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getCPTCodes + route.params.session.caseNoteDTO.sessionId, 'GET')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          setData({
            ...data,
            isLoading: false,
           })
          var arr = []
          response.data.map((item, index) => {
         // console.log('cpt-------------->>>',item)
            if (item.description != null && item.id != null) {
              arr.push({ label: item.description, value: item.id, fee: item.maxFee, duration: item.duration })
            }
          })
         // setCPT(arr)
            
         const filteredData = arr.filter(item => item.value == route.params.session.caseNoteDTO.cptId)
        // console.log('label of CPTvalue = ',filteredData[0].duration)
         if(filteredData[0] != null){
          setCPTvalue(filteredData[0].label)
          setFee(filteredData[0].fee)
          setDuration(filteredData[0].duration)
         }
        
        } else {
          ShowAlert(response.message)
        }
      })
  }
  const onSubmit = () => {
    CallTranslateApi()
  }
  const getLanuageid = (name) => {
    //     setlanguageName(name)
    //     for (var i = 0; i < Familylanuages.length; i++) {
    //     //console.log(name,Familylanuages[i].languageName)
    //     if(name === Familylanuages[i].languageName)
    //     {
    //         setLanuageID[Familylanuages[i].id]

    //     }
    // }
  }
  const Maplanuage = () => {
    for (var i = 0; i < Familylanuages.length; i++) {
      if (items.length >= 1) {
        items.push({
          label: Familylanuages[i].languageName,
          value: Familylanuages[i].id,
        })
      }
      // items.label = Familylanuages[i].languageName
      // items.value = Familylanuages[i].id
      // //console.log(items)
      // setitems([...items,items])
      Familylanuages.map((label, value) => (
        label => (language.languageName)
      ))

    }
  }
  const openGallery = () => {

    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      ////console.log("image ---------->>>",image);
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
      ////console.log('types00 ------>>>', res.uri, res.type, res.name, res.size);
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

  const addAttachmentApi = (file, isFile) => {
    // setIsAttach(true)
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
    data.append('profileImage', fileObj);

    FormApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.addAttachmentForCaseNote,
      data,
      'POST',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        let AttachData = response.data
        setAttachment([...attachment, AttachData])
      } else {
        ShowAlert(response.message);
      }
    });
  }

  const CallTranslateApi = () => {
    //console.log('is api calling',translateText)

    let data = {
      'translatedNote': translateText,
      'languageId': LanuageID
    }
    //console.log(data)
    ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.translateCaseNote + route.params.session.caseNoteDTO.id + '/translation', data, 'POST')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          //setDescription('')
          navigation.pop()
        } else {
          ShowAlert(response.message)
        }
      })
  }
  const downloadImage = (imageURL) => {
    setData({
      ...data,
      isLoading: true,
    });
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
        setData({
          ...data,
          isLoading: false,
        });
        // Showing alert after successful downloading
        //console.log('res -> ', JSON.stringify(res));
        CameraRoll.save(res.path())
          .then(alert('File Downloaded Successfully.'))
      });
    //}
  };
  const downloadVideo = async (videoURL) => {
    setData({
      ...data,
      isLoading: true,
    });
    const granted = await getPermissionAndroid();
    if (!granted) {
      return;
    }
    const { config, fs } = RNFetchBlob;
    let ext = 'mov';
    let options = {
      fileCache: true,
      appendExt: ext,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        // notification: true,
      }
    }
    config(options)
      .fetch('GET', videoURL.key)
      .then(res => {
        setData({
          ...data,
          isLoading: false,
        })
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
         // console.log('path',res)
           alert('File Downloaded Successfully.')
          //   CameraRoll.save(res.path())
          // .then(alert('Document Downloaded Successfully.'))
          }
      });
  };
  const addAttachmentApiForFiles = (file) => {
    // setIsAttach(true)
    setData({
      ...data,
      isLoading: true,
    });

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
        setData({
          ...data,
          isLoading: false,
        });
        //setIsLoading(false)
      } else {
        ShowAlert(response.message);
      }
    });
  }
  const toggleModal = (item) => {
    //console.log('item ---->>>',item)
    setFileURL(item)
    setModalVisible(!isModalVisible);
  };

  const AttachRenderItem = ({ item }) => (
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
      ) :
        (item.fileType == 'application/pdf') ?
          (Platform.OS == 'ios') ?
            <TouchableOpacity onPress={() => downloadPdf(item)}>
              <PDFView
                fadeInDuration={250.0}
                style={{
                  width: 120,
                  height: 120, padding: 10,
                }}
                resource={item.key}
                resourceType='url'
                onLoad={() => console.log('pdf rendered')}
                onError={(error) => console.log('Cannot render PDF', error)}
              />
            </TouchableOpacity>
            :

            <TouchableOpacity onPress={() => toggleModal(item)}>
              <PDFView
                fadeInDuration={250.0}
                style={{
                  width: 120,
                  height: 120, padding: 10,
                }}
                resource={item.key}
                resourceType='url'
                onLoad={() => console.log('pdf rendered')}
                onError={(error) => console.log('Cannot render PDF', error)}
              />
            </TouchableOpacity>
          :
          (item.fileType.includes('image')) ?
            <TouchableOpacity
              style={{ marginVertical: 20, marginRight: 5 }}
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

  useEffect(() => {
    //console.log('castnote --->>', attachment)
    if (Platform.OS == 'android') {
      setDriveName('Drive')
    } else {
      setDriveName('iCloud')
    }
    // Maplanuage()
    return () => {

    }
  }, [])
  const renderRow = (item) => {
    //console.log(item)
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.TopViewContainer}>
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
          <View style={{ flex:1 }}>
            <Text style={styles.text1}>Session Id</Text>
            <Text style={styles.text2}>
              {route.params.session.caseNoteDTO.sessionId}
            </Text>
            <Text style={styles.text1}>Therapy </Text>
            <Text style={styles.text2}>{route.params.session.therapy}</Text>
            <Text style={styles.text1}>Therapist</Text>
            <Text style={styles.text2}>{route.params.session.therapist}</Text>
            <Text style={styles.text1}>Clinician NPI No.</Text>
              <Text style={styles.text2}>{route.params.session.caseNoteDTO.clinicianNpiNumber}</Text>
              <View>
              <Text style={styles.text1}>ICD 10 Code</Text>
              {ICDvalue ? <Text style={styles.text2}>{ICDvalue}</Text>:<Text style={styles.text2}>NA</Text>}
              </View>
          </View>
          <View style = {{flex:1}}>
            <Text style={styles.text11}>Date</Text>
            <Text style={styles.text21}>
              {moment(route.params.session.startDateTime).format(
                'yyyy-MM-DD',
              )}{' '}
            </Text>
            <Text style={styles.text11}>Duration</Text>
            <Text style={styles.text21}>{route.params.session.duration}</Text>
            <Text style={styles.text11}>Child</Text>
            <Text style={styles.text21}>
              {route.params.session.childName}
            </Text>
            <Text style={styles.text11}>Clinic NPI No.</Text>
              <Text style={styles.text21}>{route.params.session.caseNoteDTO.clinicNpiNumber}</Text>
              
              <View><Text style={styles.text11}>CPT Code</Text>
               {CPTvalue ? <Text style={styles.text21}>{CPTvalue}</Text>: <Text style={styles.text21}>NA</Text>}
              </View> 
          </View>
        </View>
        <View>
          <View style = {{flexDirection:'row', justifyContent: 'space-between'}}>
              <View>
              <Text style={styles.text1}>Billable Rate</Text>
              {route.params.session.caseNoteDTO.billableRate ?
               <Text style={styles.text2}>${route.params.session.caseNoteDTO.billableRate}</Text>:
               <Text style={styles.text2}>NA</Text>}
              </View>
              <View>
              <Text style={styles.text11}>Units</Text>
              {route.params.session.caseNoteDTO.units ?<Text style={styles.text21}>{route.params.session.caseNoteDTO.units}</Text>:
              <Text style={styles.text21}>NA</Text>}
              </View>
              </View>
              <View>
              <Text style={styles.text1}>Duration/Unit</Text>
              {duration ?<Text style={styles.text2}>{duration} min/unit</Text>:<Text style={styles.text2}>NA</Text>}
              </View>
          </View>
        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 20, marginTop: 30 }}>English</Text>
        <View style={{ marginTop: 20, borderRadius: 5, borderWidth: 1, borderColor: 'gray' }}>
          <TextInput style={{ margin: 10, fontFamily: 'Roboto-Light', fontSize: 18 }} editable = {false} multiline={true} textAlignVertical={'top'}>{route.params.session.caseNoteDTO.description}</TextInput>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
          <View style={{ width: 42, height: 42, borderRadius: 20, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../../assets/images/icon_down_arrow.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>
          </View>
        </View>

        <DropDownPicker
          items={Familylanuages.map(language => ({ label: (language.languageName), value: language.id }))}
          // items = {items}
          placeholder={"Select Lanuage"}
          placeholderStyle={{ color: colors.BLACK }}
          defaultIndex={0}
          //defaultValue = {items.label}
          labelStyle={{ color: colors.BLACK, textAlign: 'left' }}
          containerStyle={{ height: 40, marginTop: 20 }}
          itemStyle={{ flex: 1, justifyContent: 'flex-start' }}
          onChangeItem={(item) => setLanuageID(item.value)}
        />

        <View style={{ marginTop: 20, borderRadius: 5, borderWidth: 1, borderColor: 'gray', height: 180 }}>
          <TextInput style={{ margin: 10, fontFamily: 'Roboto-Light', fontSize: 18, height: 160 }} multiline={true} editable={true} onChangeText={text => setTranslateText(text)}></TextInput>
        </View>

        {route.params.session.caseNoteDTO.attachmentsList == null ? <View></View> :
          <View>

            <FlatList
              horizontal={true}
              style={styles.FlatListStyle}
              data={route.params.session.caseNoteDTO.attachmentsList}
              renderItem={AttachRenderItem}
              keyExtractor={(item, index) => 'index' + index}
              ItemSeparatorComponent={ItemSeparatorView}
            />
            {/* <TouchableOpacity>
                                <Text style={{color: '#387af6'}}>Download all</Text>
                            </TouchableOpacity> */}
          </View>
        }

        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: colors.BLACK, }}>{route.params.session.caseNoteDTO.attachmentsList.length} File attached</Text>
        </View>
        {/* <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                                <TouchableOpacity style={{}} onPress={() => uploadFiles()}>
                                    <Image source={require('../../../assets/images/attachment.png')} style={{ width: 40, height: 40, marginEnd: 10 }}></Image>
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: colors.BLACK, }}>Attach audio/video/image file</Text>
                            </View> */}
        <View style={{ marginTop: 20 }}>
          {/* <GreenButton text='Save' onMethod={() => onSave()}/> */}
          <TouchableOpacity style={{ borderColor: '#0e84d2', borderWidth: 1, height: 50, borderRadius: 10, marginTop: 20, justifyContent: 'center' }} onPress={() => onSubmit()}>
            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#387af6' }}>Submit</Text>
          </TouchableOpacity>
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
            <Text>Gallery</Text>
            <View style={{ backgroundColor: 'gray', height: 2, left: 0, right: 0, position: 'absolute', bottom: 0 }}></View>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 60, width: 400, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} onPress={() => openDocumentPicker()}>
            <Text>{driveName}</Text>
            <View style={{ backgroundColor: 'gray', height: 2, left: 0, right: 0, position: 'absolute', bottom: 0 }}></View>
          </TouchableOpacity>

        </RBSheet>
        <Modal isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.box2}>
          {(fileURL.fileType == 'video/quicktime') ?
            <View>
              data.isLoading ? <ShowLoader /> : null
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
                  <View style={{ height: 38, padding: 10, marginBottom: 20 }}>
                    <GreenButton text="Download" onMethod={() => downloadImage(fileURL)} />
                  </View>
                </View>
                :
                <View>
                </View>}

        </Modal>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    TopViewContainer: {
        flex: 1,
        margin:20
    },
    FlatListStyle: {
       // backgroundColor:'white'
    },
    text1 :{
        
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop :30,
      
       
    },
    text2 :{
        fontFamily :'Roboto-Regular',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :15,
        
    },
    text11 :{
        
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop :30,
        textAlign : 'right'
    },
    text21 :{
        fontFamily :'Roboto-Regular',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :15,
        textAlign : 'right'
    },
    text3 :{
        fontFamily :'Roboto-Light',
        fontSize : 16,
        color : colors.GREY,
        marginTop :15,
        
    },
    scrollViewStyle: {
          backgroundColor: 'gray',
          flex: 1 ,
          //flexGrow :0.05,  
    },
    box2: {
        opacity: 0.9,
        marginVertical: 150,
        backgroundColor: 'white',
        borderRadius: 20,
        flex :1,
        padding :10,
        justifyContent:'center',
      
        //marginBottom:40,
        //right:90
      },
      pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
})
export default TranslateCaseNote
