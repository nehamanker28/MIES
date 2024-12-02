import React, { useState ,useEffect ,useRef} from 'react';

//Import all required component
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Button,
    Image,
    Platform,
    PermissionsAndroid,
    Dimensions
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from "../../Common/Colors";
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import GreenButton from '../../components/GreenButton';
import Modal from 'react-native-modal';
import moment from 'moment';
import { add } from 'date-fns';
import { ApiHelper, FormApiHelper,getApiHelper } from '../../Service/Fetch';
import { useIsFocused } from "@react-navigation/native";
import ImageCropPicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import RBSheet from "react-native-raw-bottom-sheet"
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import PDFView from 'react-native-view-pdf';
import {openFile} from '../../components/fileViewer';
import * as mime from 'react-native-mime-types';

const CaseNotesQueriesFamily = ({ route }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState([]);
  const [Queries, setQueries] = useState([route.params.session.queryDTO])
  const [queryReplies, setqueryReplies] = useState([])
  const [placeholder, setPlaceholder] = useState('')
  const [isAttach, setIsAttach] = useState(false)
  const [ICDvalue, setICDvalue] = useState(null);
  const [CPTvalue, setCPTvalue] = useState(null);
  const [duration, setDuration] = useState(0)
  const [fee, setFee] = useState(0)
  const [unit, setUnit] = useState(0)
  const [data, setData] = useState({
    QueryAttachment: [0],
    isLoading: false,
    queries: '',
    userUniqueId: '',
    firstName: '',
    queriesReply: [],
    queryDate: '',
    translatedDetail: '',
    QueryID: 0,
   
  })
  
  const refRBSheet = useRef();
  const [fileURL, setFileURL] = useState('')
  const [signature, setSignature] = useState(route.params.session.caseNoteDTO.familySignatureKey)
  const [accept, SetAccept] = useState(route.params.session.caseNoteDTO.acceptCaseNotes)
  const [translated,setTranslate] = useState()
  const [Attached, setAttached] = useState([])
  const [driveName, setDriveName] = useState('')
  const [billingDetail, setBillingDetail] = useState()
  const isFocused = useIsFocused();
  const [queryAttached,setqueryAttached] = useState([])

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
    //console.log(signature)
    fetchData();
    // getCPTCodes();
    // getICDCodes();

  }, [isFocused]);

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
  const InterpreterDetail = () => {
    if(route.params.session.interpreterName == ""){
      setTranslate(true)
    }
    else{
      setTranslate(route.params.session.caseNoteDTO.translated)
    }
    
  }
  const getICDCodes = () => {
    // setData({
    //   ...data,
    //   isLoading: true,
    //  })
    //route.params.session.caseNoteDTO.sessionId
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getICDCodes + route.params.session.caseNoteDTO.sessionId, 'GET')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          // setData({
          //   ...data,
          //   isLoading: false,
          //  })
          var arr = []
          response.data.map((item, index) => {
            //console.log('ICD-------------->>>',item)
            if (item.description != null && item.id != null) {
              arr.push({ label: item.description, value: item.id })
            }
          })
          //setICD(arr)
          const filteredData = arr.filter(item => item.value == route.params.session.caseNoteDTO.diagnosisId)
          //console.log('label of ICDvalue = ',route.params.session.caseNoteDTO.diagnosisId)
          if(filteredData[0] != null){
            setICDvalue(filteredData[0].label)
          }
          
        } else {
          ShowAlert(response.message)
        }
      })
  }

  const getCPTCodes = () => {
    // setData({
    //   ...data,
    //   isLoading: true,
    //  })
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getCPTCodes + route.params.session.caseNoteDTO.sessionId, 'GET')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          // setData({
          //   ...data,
          //   isLoading: false,
          //  })
          var arr = []
          response.data.map((item, index) => {
          //console.log('cpt-------------->>>',item)
            if (item.description != null && item.id != null) {
              arr.push({ label: item.description, value: item.id, fee: item.maxFee, duration: item.duration })
            }
          })
         // setCPT(arr)
            
         const filteredData = arr.filter(item => item.value == route.params.session.caseNoteDTO.cptId)
         //console.log('label of CPTvalue = ',filteredData[0].duration)

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
  const deleteAttachment = (itemID) => {
    const filteredData = attachment.filter(item => item.id !== itemID.id)
    console.log(filteredData)
    setAttachment(filteredData)
  }
  const renderattachment = ({ item }) => (
    <View style={{ marginTop: 20 }}>
      {/* <Text style={{height:100}} multiline = {true} >{item.key}</Text> */}
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

            <TouchableOpacity onPress={() => openFile(item)}>
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
              style={{ marginVertical: 0, marginRight: 5 }}
              onPress={() => toggleModal(item)}>
              <Image
                source={{ uri: item.key }}
                style={{
                  width: 80,
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
                    width: 90,
                    height: 90,
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
  const renderItem = ({ item }) => (
    <View style={{ padding: 20, flexDirection: 'row' }}>
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
    <View style={{ marginTop: 10}}>
    {/* <Text>{item.fileName}</Text> */}
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

            <TouchableOpacity onPress={() => openFile(item)}>
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

  const download = () => {
    //console.log('downlaod')
  }
  const toggleModal = (item) => {
    console.log(item)
    setFileURL(item)
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    //console.log('attach --->>>',route.params.session.queryDTO)

    if (Platform.OS == 'android') {
      setDriveName('Drive')
    } else {
      setDriveName('iCloud')
    }
    console.log('Translate =====',route.params.session.interpreterName)
    InterpreterDetail()
    if (route.params.session.caseNoteDTO != null) {
      ////console.log('attach --->>>',route.params.session.caseNoteDTO.attachmentsList)
      //setAttachment(route.params.session.caseNoteDTO.attachmentsList)
      setAttached(route.params.session.caseNoteDTO.attachmentsList)
    }

    if (route.params.session.queryDTO != null) {
      setPlaceholder("Enter your reply")
      if (isFocused) {
        console.log('is focusedd --------->>>',route.params.session.queryDTO )
       // setqueryAttached(route.params.session.queryDTO.attachmentsList)
       // console.log('QUERYATTCHED+===',route.params.session.queryDTO.attachmentsList)
         getAllQueries()

      }
      //  setAttached(route.params.session.queryDTO.attachmentsList)
      if (route.params.session.queryDTO.queryReplies != null) {
        var queryReplies = route.params.session.queryDTO.queryReplies
        setqueryReplies(queryReplies)
        // console.log("queryReplies",route.params.session.queryDTO.queryReplies)

      }
    }

    else {
      setPlaceholder("Enter your query")
    }
      getCPTCodes();
    getICDCodes();
    setTimeout(async () => {
      try {
        const uniqueId = await AsyncStorage.getItem(
          AsyncStorageKey.userUniqueId,
        );
        let tempName = await AsyncStorage.getItem(AsyncStorageKey.userName);

        //console.log('uniqueid=========', uniqueId);
        setData({
          ...data,
          userUniqueId: uniqueId,
          firstName: tempName,
        });

      } catch (e) {
        // saving error
      }
    }, 100);

  }, [isFocused]);

  const addQueries = (query) => {
    //getAllQueries()
   //console.log('Queries ===',data.queries)
    setData({
      ...data,
      isLoading: true,
    });
    var dateM = moment(new Date).format('YYYY-MM-DD')
    console.log(dateM)
    if (data.QueryID == 0) {
      //console.log("logogoog =",attachment)
      let data = {
        'attachmentList': attachment,
        'detail': query,
        'sessionId': route.params.session.caseNoteDTO.sessionId,
        'queryDate': dateM,
        "signOff": true,
        "title": "queries",
        "id": route.params.session.caseNoteDTO.id,
      }

      ApiHelper(
        ServiceUrl.base_url_91 + ServiceUrl.createQueriesbyFamily,
        data,
        'POST',
      ).then((response) => {
        setData({
          ...data,
          isLoading: false,
        });
        if (response.code >= 200 && response.code <= 299) {
         
          setDescription('')
          setAttachment([])
          getAllQueries()

        } else {
           ShowAlert(response.message);
        }
      });

    }
    else {
      AddQueryReply()
    }
  }

  const AddQueryReply = () => {
    //getAllQueries()
    if (description.trim().length == 0) {
      ShowAlert("Please enter your reply")
      setData({
        ...data,
        isLoading: false,
      });
      return
    }
    const UserProfile = {
      'firstName': data.firstName,
      'userUniqueId': data.userUniqueId,
      "userType": "ROLE_FAMILY",
    }
    const attachmentDTO = {
      "attachmentDTO": attachment
    }
    var formData = {
      'queryId': data.QueryID,
      'reply': description,
      'postedBy': UserProfile,
      'attachments': attachment
    }

    setData({
      ...data,
      isLoading: true,
    });
    console.log("logogoog =",formData)
    ApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.AddQueryReply,
      formData,
      'POST',
    ).then((response) => {
      setData({
        ...data,
        isLoading: false,
      });
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Reply == >',response.data)
        ShowAlert("Reply has been Added");
        getAllQueries()
        setDescription('')
        setAttachment([])
        // let AttachData = response.data;
        // //console.log(AttachData)
        // setAttachment([...attachment, AttachData]);
      } else {
        ShowAlert(response.message);
      }
    });
  }
  const openGallery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      //cropping: true,
    }).then((image) => {
      refRBSheet.current.close()
      ////console.log("image ---------->>>",image);
      addAttachmentApi(image, false);
    });
  };

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
  };

  const uploadFiles = () => {
    refRBSheet.current.open();
  };

  const addAttachmentApi = (file, isFile) => {
    // setIsAttach(true)
    //console.log("file======",file)
    var name;
    if (isFile) {
      name = file.name;
    } else {
      name = 'profileImg';
    }

    var data = new FormData();

    const fileObj = {
      uri: file.path,
      type: file.mime,
      name: name
    };
    //console.log('image detail :',fileObj)
    data.append('profileImage', fileObj);
    setData({
      ...data,
      isLoading: true,
    });
    //console.log(fileObj)
    FormApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.addAttachmentForCaseNote,
      data,
      'POST',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        let AttachData = response.data;
        setData({
          ...data,
          isLoading: false,
        });
        //console.log(AttachData)
        setAttachment([...attachment, AttachData]);
        setIsAttach(true)
        getAllQueries()
      } else {
        ShowAlert(response.message);
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
        setData({
          ...data,
          isLoading: false,
        });
        let AttachData = response.data
        setAttachment([...attachment, AttachData])
        setIsAttach(true)
        getAllQueries()
        //setIsLoading(false)
      } else {
        ShowAlert(response.message);
      }
    });
  }
  const getAllQueries = () => {
    console.log('--coming to query')
    setData({
      ...data,
      queries :[],
      isLoading: true,
    })
    //    /{familyMemberId}/session/{sessionId}'
    getApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.getQueriesBySession + route.params.session.caseNoteDTO.sessionId,
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
      
        setData({
          ...data,
          isLoading: false,
        })
        if(response.data != null){
          // setData({
          //   ...data,
          //   isLoading: false,
          // })
         
          setqueryAttached(response.data.attachmentsList);
       
        setData({
          ...data,
          queries: response.data.detail,
          queriesReply: response.data.queryReplies,
          queryDate: response.data.queryDate,
          translatedDetail: response.data.translatedDetail,
          QueryID: response.data.id,
          QueryAttachment :response.data.attachmentsList,
        })
        
      }

      

      } else {
         ShowAlert(response.message);
      }
    });
   
  }
  const convertTime = (time) => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.toLocaleString();
    }
    let sTime = moment(time).format('DD/MM/YYYY ');
    return sTime;
  };
  const onTypeDescription = (text) => {
    setDescription(text)
  }

  const acceptSoapNote = () => {
    setData({
      ...data,
      isLoading: true
    })
    ApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.acceptSoapNote + route.params.session.caseNoteDTO.id + '/families',
      data,
      'PUT',
    ).then((response) => {
      setData({
        ...data,
        isLoading: false
      })
      if (response.code >= 200 && response.code <= 299) {
     
        SetAccept(true)
      } else {
        ShowAlert(response.message);
      }
    });

    callFamilySignOffApi()
  }

  const uploadSignature = () => {

    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      //cropping: true,
    }).then((image) => {
      console.log("image ---------->>>",image.size/(1024*1024));
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
        //callFamilySignOffApi()
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

  const callFamilySignOffApi = () => {
    setData({
      ...data,
      isLoading: true
    })
    ApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.familySignOff + route.params.session.caseNoteDTO.id + '/signed-off/family',
      data,
      'PUT',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        setData({
          ...data,
          isLoading: false
        })
      } else {
        // ShowAlert(response.message);
      }
    });
  }
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      alert(

        'Grant Me Permission to save Image',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } catch (err) {
      alert(
        'Failed to save Image: ' + err.message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    }
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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollViewStyle}>
        <View style={styles.ListViewContainer}>
          {billingDetail != null ? (
            <View>
              <Text style={styles.text1}>Billing Details</Text>
              <Image
                source={{uri: billingDetail.logoUrl}}
                style={{width: 250, height: 80, resizeMode: 'contain'}}></Image>
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontSize: 16,
                  color: colors.BLACK,
                  marginTop: 10,
                }}>
                {billingDetail.name}
              </Text>
              <Text style={styles.text2}>
                {billingDetail.address1}, {billingDetail.address2},{' '}
                {billingDetail.city}, {billingDetail.state},{' '}
                {billingDetail.country}, {billingDetail.zipCode}
              </Text>
            </View>
          ) : null}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <Text style={styles.text1}>Session Id</Text>
              <Text style={styles.text2}>
                {route.params.session.caseNoteDTO.sessionId}
              </Text>
              <Text style={styles.text1}>Therapy </Text>
              <Text style={styles.text2}>{route.params.session.therapy}</Text>
              <Text style={styles.text1}>Therapist</Text>
              <Text style={styles.text2}>{route.params.session.therapist}</Text>
              <Text style={styles.text1}>Clinician NPI No.</Text>
              <Text style={styles.text2}>
                {route.params.session.caseNoteDTO.clinicianNpiNumber}
              </Text>
              <View>
                <Text style={styles.text1}>ICD 10 Code</Text>
                {ICDvalue ? (
                  <Text style={styles.text2}>{ICDvalue}</Text>
                ) : (
                  <Text style={styles.text2}>NA</Text>
                )}
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text11}>Date</Text>
              <Text style={styles.text21}>
                {moment(route.params.session.startDateTime).format(
                  'yyyy-MM-DD',
                )}{' '}
              </Text>
              <Text style={styles.text11}>Duration</Text>
              <Text style={styles.text21}>{route.params.session.duration}</Text>
              <Text style={styles.text11}>Interpreter</Text>
              {route.params.session.interpreterName == "" ? (
                <Text style={styles.text21}>None</Text>
              ) : (
                <Text style={styles.text21}>
                  {route.params.session.interpreterName.length < 10
                    ? route.params.session.interpreterName
                    : route.params.session.interpreterName.substring(0, 12)}
                </Text>
              )}
              <Text style={styles.text11}>Clinic NPI No.</Text>
              <Text style={styles.text21}>
                {route.params.session.caseNoteDTO.clinicNpiNumber}
              </Text>

              <View>
                <Text style={styles.text11}>CPT Code</Text>
                {CPTvalue ? (
                  <Text style={styles.text21}>{CPTvalue}</Text>
                ) : (
                  <Text style={styles.text21}>NA</Text>
                )}
              </View>
            </View>
          </View>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.text1}>Billable Rate</Text>
                {route.params.session.caseNoteDTO.billableRate ? (
                  <Text style={styles.text2}>
                    ${route.params.session.caseNoteDTO.billableRate}
                  </Text>
                ) : (
                  <Text style={styles.text2}>NA</Text>
                )}
              </View>
              <View>
                <Text style={styles.text11}>Units</Text>
                {route.params.session.caseNoteDTO.units ? (
                  <Text style={styles.text21}>
                    {route.params.session.caseNoteDTO.units}
                  </Text>
                ) : (
                  <Text style={styles.text21}>NA</Text>
                )}
              </View>
            </View>
            <View>
              <Text style={styles.text1}>Duration/Unit</Text>
              {duration ? (
                <Text style={styles.text2}>{duration} min/unit</Text>
              ) : (
                <Text style={styles.text2}>NA</Text>
              )}
            </View>
          </View>
          <View style={{marginTop: 30}}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                marginBottom: 20,
              }}>
              Therapist Signature
            </Text>
            <Image
              source={{
                uri: route.params.session.caseNoteDTO.therapistSignatureKey,
              }}
              style={{
                width: 100,
                height: 100,
                marginTop: 10,
                borderRadius: 50,
              }}></Image>
          </View>
          <View style={{marginTop: 30}}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                marginBottom: 20,
              }}>
              Family Signature
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Image
                source={{uri: signature}}
                style={{
                  width: 100,
                  height: 100,
                  marginTop: 10,
                  borderRadius: 50,
                }}></Image>
              {accept ? null : (
                <TouchableOpacity
                  onPress={() => uploadSignature()}
                  style={{
                    backgroundColor: '#0fd683',
                    height: 45,
                    width: 180,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Bold',
                      fontSize: 15,
                      color: 'white',
                    }}>
                    Upload
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {accept || signature == null ? null : (
              translated == true?
              <TouchableOpacity
                onPress={() => acceptSoapNote()}
                style={{
                  backgroundColor: '#0fd683',
                  height: 45,
                  width: 180,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: 15,
                    color: 'white',
                  }}>
                  Accept SOAP notes
                </Text>
              </TouchableOpacity> :
              null
            )}
          </View>
          <View style={{marginTop: 40}}>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 18,
                color: colors.BLACK,
                marginTop: 10,
              }}>
              {moment(route.params.session.startDateTime).format(
                'DD MMMM, YYYY',
              )}{' '}
            </Text>
            <Text style={styles.text1}>SOAP Notes</Text>
            <Text style={styles.text3}>
              {route.params.session.caseNoteDTO.description}
            </Text>
            {/* <TouchableOpacity 
                onPress = {toggleModal}>
            <Text style = {{color :'#387af6'}}>Read More</Text>      
            </TouchableOpacity> */}
          </View>
          {route.params.session.caseNoteDTO.translatedDescription == null ? (
            <View></View>
          ) : (
            <View>
              <Text style={styles.text2}>
                Interpreter - {route.params.session.interpreterName}
              </Text>
              <Text style={styles.text3}>
                {route.params.session.caseNoteDTO.translatedDescription}
              </Text>
            </View>
          )}
          <FlatList
            horizontal={true}
            style={styles.FlatListStyle}
            data={Attached}
            renderItem={renderItem1}
            keyExtractor={(item, index) => 'index' + index}
            ItemSeparatorComponent={ItemSeparatorView}
          />

          {data.QueryID == 0 ? (
            <View></View>
          ) : (
            <View>
              <Text style={styles.text1}>Queries</Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontSize: 18,
                  color: colors.BLACK,
                  marginTop: 20,
                  padding: 0,
                }}>
                {route.params.session.childName}
              </Text>
              {data.queryDate ? (
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    color: colors.BLACK,
                  }}>
                  {moment(data.queryDate).format('DD MMMM, YYYY ')}
                </Text>
              ) : null}
             
              <Text style={styles.text2}>{data.queries}</Text>
              {data.QueryAttachment == null ? (
                <View></View>
              ) : (
                <View>
                <FlatList
                horizontal={true}
                style={styles.FlatListStyle}
                data={queryAttached}
                renderItem={renderItem1}
                keyExtractor={(item, index) => 'index' + index}
                ItemSeparatorComponent={ItemSeparatorView}
              />
                </View>
              )}
              {data.translatedDetail ? (
                <View
                  style={{
                    backgroundColor: '#e8f1ff',
                    padding: 20,
                    marginTop: 20,
                  }}>
                  {/* <Image source={item.image} style = {{width:120,height:80}}></Image>            */}
                  <Text
                    style={{
                      fontFamily: 'Roboto',
                      fontSize: 16,
                      color: colors.BLACK,
                    }}>
                    {route.params.session.interpreterName} - Translator
                  </Text>
                  <Text style={styles.text1}>{data.translatedDetail}</Text>
                </View>
              ) : (
                <View></View>
              )}
              {data.queriesReply == 0 ? (
                <View></View>
              ) : (
                <View>
                  <Text style={styles.text1}>Replies</Text>

                  <FlatList
                    style={styles.ReplylistStyle}
                    data={data.queriesReply}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => 'index' + index}
                    //ItemSeparatorComponent = {ItemSeparatorView}
                  />
                </View>
              )}
            </View>
          )}

          {/* <TouchableOpacity >
                <Text style = {{color :'#387af6'}}>Download all</Text>      
                </TouchableOpacity> */}
          {accept ? (
            <View>
              <TextInput
                multiline={true}
                value={description}
                style={{
                  backgroundColor: colors.WHITE,
                  marginTop: 10,
                  height: 140,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  paddingLeft: 10,
                  fontSize: 16,
                  textAlignVertical: 'top',
                }}
                placeholder={placeholder}
                multiline={true}
                onChangeText={(text) => onTypeDescription(text)}></TextInput>
              <FlatList
                horizontal={true}
                style={styles.FlatListStyle}
                data={attachment}
                renderItem={renderattachment}
                keyExtractor={(item, index) => 'index' + index}
                ItemSeparatorComponent={ItemSeparatorView}
              />
              <View style={{marginTop: 20}}>
                {isAttach ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 30,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity style={{}} onPress={() => uploadFiles()}>
                      <Image
                        source={require('../../../assets/images/attachment.png')}
                        style={{
                          width: 40,
                          height: 40,
                          marginEnd: 10,
                          resizeMode: 'contain',
                        }}></Image>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Roboto',
                        fontSize: 18,
                        color: colors.BLACK,
                      }}>
                      {attachment.length} File attached
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 30,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity style={{}} onPress={() => uploadFiles()}>
                      <Image
                        source={require('../../../assets/images/attachment.png')}
                        style={{
                          width: 40,
                          height: 40,
                          marginEnd: 10,
                          resizeMode: 'contain',
                        }}></Image>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Roboto',
                        fontSize: 18,
                        color: colors.BLACK,
                      }}>
                      Attach audio/video/image file
                    </Text>
                  </View>
                )}
                <View style={{height: 38, marginTop: 30}}>
                  <GreenButton
                    text="Reply"
                    onMethod={() => addQueries(description)}
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>
        <RBSheet
          ref={refRBSheet}
          height={180}
          openDuration={280}
          closeOnDragDown={true}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}>
          <TouchableOpacity
            style={{
              height: 60,
              width: 400,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => openGallery()}>
            <Text>Gallery</Text>
            <View
              style={{
                backgroundColor: 'gray',
                height: 2,
                left: 0,
                right: 0,
                position: 'absolute',
                bottom: 0,
              }}></View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 60,
              width: 400,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => openDocumentPicker()}>
            <Text>{driveName}</Text>
            <View
              style={{
                backgroundColor: 'gray',
                height: 2,
                left: 0,
                right: 0,
                position: 'absolute',
                bottom: 0,
              }}></View>
          </TouchableOpacity>
        </RBSheet>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.box2}>
          {fileURL.fileType == 'video/quicktime' ||
          fileURL.fileType == 'video/mp4' ? (
            <View>
              <VideoPlayer
                hideControlsOnStart={false}
                video={{uri: fileURL.key}}
                videoWidth={1600}
                videoHeight={900}
              />
              <View style={{height: 38, padding: 10, marginBottom: 20}}>
                <GreenButton
                  text="Download"
                  onMethod={() => downloadVideo(fileURL)}
                />
              </View>
            </View>
          ) : fileURL.fileType == 'application/pdf' ? (
            <View>
              <PDFView
                fadeInDuration={250.0}
                style={{
                  width: 300,
                  height: 295,
                  padding: 10,
                }}
                resource={fileURL.key}
                resourceType="url"
                onLoad={() => console.log('PDF rendered')}
                onError={(error) => console.log('Cannot render PDF', error)}
              />
              <View style={{height: 38, padding: 10, marginBottom: 20}}>
                <GreenButton
                  text="Download"
                  onMethod={() => downloadPdf(fileURL)}
                />
              </View>
            </View>
          ) : fileURL.fileType == 'image/png' ||
            fileURL.fileType == 'image/jpeg' ? (
            <View>
              <Image
                source={{uri: fileURL.key}}
                style={{
                  width: 300,
                  height: 295,
                  borderColor: '#d8e4f1',
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 10,
                }}></Image>
              <View style={{height: 38, padding: 10, marginBottom: 20}}>
                <GreenButton
                  text="Download"
                  onMethod={() => downloadImage(fileURL)}
                />
              </View>
            </View>
          ) : (
            <View></View>
          )}
        </Modal>
        {data.isLoading ? ShowLoader() : null}
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
       // backgroundColor: colors.TEXTBOX_BLUE,
        marginTop:20,
    },
    ReplylistStyle :{
      backgroundColor:colors.TEXTBOX_BLUE,
      borderRadius : 20,
      marginTop:20,
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
        marginTop :20,
    },
    text2 :{
        fontFamily :'Roboto',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :10,
    },
    text11 :{
        textAlign : 'right',
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop :20,
    },
    text21 :{
        textAlign : 'right',
        fontFamily :'Roboto',
        fontSize : 16,
        color : colors.BLACK,
        marginTop :10,
    },
    text3 :{
        fontFamily :'Roboto',
        fontSize : 16,
        color : colors.GREY,
        marginTop :10,
        padding:10,
        
    },
    scrollViewStyle: {
          backgroundColor: 'white',
          flex: 1 , 
    },
    box2: {
     // opacity: 1,
      marginVertical: 150,
      backgroundColor: 'white',
      borderRadius: 20,
      flex :1,
      padding :10,
      //marginBottom:40,
      //right:90
    },
    pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
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
})
export default CaseNotesQueriesFamily
