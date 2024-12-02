import React, {useState, useEffect} from 'react';

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
import {TextInput} from 'react-native-gesture-handler';
import colors from '../../Common/Colors';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import GreenButton from '../../components/GreenButton';
import Modal from 'react-native-modal';
import moment from 'moment';
import { ApiHelper, FormApiHelper,getApiHelper } from '../../Service/Fetch';
import ImageCropPicker from 'react-native-image-crop-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { useIsFocused } from "@react-navigation/native";
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import PDFView from 'react-native-view-pdf';
import {openFile} from '../../components/fileViewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as mime from 'react-native-mime-types';


const CaseNotesQueriesInterpreter = ({ route }) => {
  const [fileURL, setFileURL] = useState('')
  const [Queries, setQueries] = useState([route.params.session.queryDTO]);
  const [Attached, setAttached] = useState([])
  const [queryAttached,setqueryAttached] = useState([])
  const [attachment, setAttachment] = useState([]);
  const [translateText, setTranslateText] = useState('')
  const [Familylanuages, setFamlanuages] = useState(route.params.session.caseNoteDTO.familyLanguages)
  const [LanuageID, setLanuageID] = useState(0)
  const [queryReplies, setqueryReplies] = useState([])
  const [driveName, setDriveName] = useState('')
  const [ICDvalue, setICDvalue] = useState(null);
  const [CPTvalue, setCPTvalue] = useState(null);
  const [duration, setDuration] = useState(0)
  const [fee, setFee] = useState(0)
  const [unit, setUnit] = useState(0)
  const [data, setData] = useState({
    isLoading: false,
    queries: '',
    queriesReply: [],
    queryDate: '',
    translatedDetail: '',
    QueryID: 0,
    QueryAttachment:[],

  })
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
  const ItemSeparatorView = () => {
    return (
      // FlatList Item Separator
      <View
        style={{
          height: 100,
          width: 15,
          //backgroundColor: '#ffff',
        }}
      />
    );
  };

  useEffect(() => {
    //console.log("Attach =",Queries)
    if (route.params.session.caseNoteDTO != null) {
      ////console.log('attach --->>>',route.params.session.caseNoteDTO.attachmentsList)
      setAttached(route.params.session.caseNoteDTO.attachmentsList)
    }
    if (route.params.session.queryDTO != null) {
      setqueryAttached(route.params.session.queryDTO.attachmentsList)
        console.log('QUERYATTCHED+===',route.params.session.queryDTO.attachmentsList)
      // setAttached(route.params.session.queryDTO.attachmentsList)
      if (route.params.session.queryDTO.queryReplies != null) {
        var queryReplies = route.params.session.queryDTO.queryReplies
        setqueryReplies(queryReplies)
        //console.log("queryReplies",queryReplies)

      }
      if (isFocused) {
        ////console.log('is focusedd --------->>>')
        getAllQueries()
      }
    }
    getCPTCodes();
    getICDCodes();
  }, []);
  const getAllQueries = () => {
    setData({
      ...data,
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
          queries: response.data.detail,
          queriesReply: response.data.queryReplies,
          queryDate: response.data.queryDate,
          translatedDetail: response.data.translatedDetail,
          QueryID: response.data.id,
          QueryAttachment :response.data.attachmentList,


        })

        //console.log(response.data.content)

      } else {
        // ShowAlert(response.message);
      }
    });
  }
  const renderItem = ({ item }) => (
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

  const renderItem1 = ({ item }) => (
    <View style={{ backgroundColor: colors.TEXTBOX_BLUE, padding: 20, flexDirection: 'row' }}>
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
            renderItem={renderItem}
            keyExtractor={(item, index) => 'index' + index}
            ItemSeparatorComponent={ItemSeparatorView}
          />
        }
        {item.translatedReply ?
          <View style={{ backgroundColor: '#e8f1ff', padding: 20, marginTop: 20 }}>

            <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: colors.BLACK, }}>{route.params.session.interpreterName} - Translator</Text>
            <Text style={styles.text1}>{item.translatedReply}</Text>

          </View>
          :
          <View></View>
        }
      </View>
    </View>
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');

  const toggleModal = (item) => {
    setFileURL(item)
    setModalVisible(!isModalVisible);
  };
  const onTypeDescription = (text) => {
    setTranslateText(text)
  };
  const translate = () => {
    //console.log('is api calling',translateText)
    if (translateText.trim().length == 0) {
      ShowAlert("Please translate first")
      setData({
        ...data,
        isLoading: false,

      });
      return
    }
    setData({
      ...data,
      isLoading: true,

    });
    if (Queries != 0) {
      if (queryReplies == 0) {
        let data = {
          'translatedNote': translateText,
          'languageId': LanuageID
        }
        //console.log(data)
        ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.translateQueries + route.params.session.queryDTO.id + '/translation', data, 'PUT')
          .then(response => {
            setData({
              ...data,
              isLoading: false,

            });
            getAllQueries()
            if (response.code >= 200 && response.code <= 299) {
              setTranslateText('')


            } else {
              ShowAlert(response.message)
            }
          })
      }
      else {
        let data = {
          'translatedNote': translateText,
          'languageId': LanuageID
        }
        //console.log(data)
        ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.translateQueriesReplies + queryReplies[queryReplies.length - 1].id + '/translation', data, 'PUT')
          .then(response => {
            setData({
              ...data,
              isLoading: false,

            });
            getAllQueries()
            if (response.code >= 200 && response.code <= 299) {
              setTranslateText('')


            } else {
              ShowAlert(response.message)
            }
          })
      }
    }

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
         // console.log('path',res)
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
            <View style={{ flex:1 }}>
              <Text style={styles.text11}>Date</Text>
              <Text style={styles.text21}>
                {moment(route.params.session.startDateTime).format(
                  'yyyy-MM-DD',
                )}{' '}
              </Text>
              <Text style={styles.text11}>Duration</Text>
              <Text style={styles.text21}>{route.params.session.duration}</Text>
              <Text style={styles.text11}>Interpreter</Text>
              {route.params.session.interpreterName == null ? (
                <Text style={styles.text21}>None</Text>
              ) : (
                <Text style={styles.text21}>
                  {route.params.session.interpreterName.length < 10 ? route.params.session.interpreterName
                  : route.params.session.interpreterName.substring(0, 12)}
                </Text>
              )}
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
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 20 }}>Therapist Signature</Text>
            <Image source={{ uri: route.params.session.caseNoteDTO.therapistSignatureKey }} style={{ width: 100, height: 100, marginTop: 10, borderRadius: 50 }} ></Image>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 18, marginBottom: 20 }}>Family Signature</Text>
            <Image source={{ uri: route.params.session.caseNoteDTO.familySignatureKey }} style={{ width: 100, height: 100, marginTop: 10, borderRadius: 50 }} ></Image>
          </View>
          <View style={{ marginTop: 50 }}>
            <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: colors.BLACK, marginTop: 10, }}>
              {moment(route.params.session.startDateTime).format(
                'DD MMMM, YYYY',
              )}{' '}
            </Text>

            <Text style={styles.text1}>SOAP Notes</Text>
            <Text style={styles.text2}>Therapist - {route.params.session.therapist}</Text>
            <Text style={styles.text3}>
              {route.params.session.caseNoteDTO.description}
            </Text>
            {route.params.session.caseNoteDTO.translatedDescription == null ? <View></View> :
              <View>
                <Text style={styles.text2}>Interpreter - {route.params.session.interpreterName}</Text>
                <Text style={styles.text3}>
                  {route.params.session.caseNoteDTO.translatedDescription}
                </Text>
                <FlatList
                  horizontal={true}
                  style={styles.FlatListStyle}
                  data={Attached}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => 'index' + index}
                  ItemSeparatorComponent={ItemSeparatorView}

                />
              </View>
            }
            {/* <TouchableOpacity 
                onPress = {toggleModal}>
            <Text style = {{color :'#387af6'}}>Read More</Text>      
            </TouchableOpacity> */}
          </View>

          {data.queries == 0 ? (
            <View></View>
          ) : (

            <View>
              <Text style={styles.text1}>Queries</Text>
              <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 18, color: colors.BLACK, marginTop: 20, padding: 0 }}>{route.params.session.childName}</Text>
              {data.queryDate?<Text style={{ fontFamily: 'Roboto', fontSize: 16, color: colors.BLACK }}>{moment(data.queryDate).format('DD MMMM, YYYY ')}</Text>:null}
              <Text style={styles.text2}>{data.queries}</Text>
              {data.QueryAttachment == 0 ? (
                <View></View>
              ) : (
                <View>
                <FlatList
                horizontal={true}
                style={styles.FlatListStyle}
                data={queryAttached}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'index' + index}
                ItemSeparatorComponent={ItemSeparatorView}
              />
                </View>
              )}
              {data.translatedDetail ?
                <View style={{ backgroundColor: '#e8f1ff', padding: 20, marginTop: 20 }}>
                  {/* <Image source={item.image} style = {{width:120,height:80}}></Image>            */}
                  <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: colors.BLACK, }}>{route.params.session.interpreterName} - Translator</Text>
                  <Text style={styles.text1}>{data.translatedDetail}</Text>

                </View>
                :
                <View></View>}
              {data.queriesReply == 0 ? <View></View> :
                <View>
                  <Text style={styles.text1}>Replies</Text>
                  <FlatList

                    style={styles.FlatListStyle}
                    data={data.queriesReply}
                    renderItem={renderItem1}
                    keyExtractor={(item, index) => 'index' + index}
                  //ItemSeparatorComponent = {ItemSeparatorView}

                  />
                </View>}




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
              <View style={{ marginTop: 20 }}>
                <TextInput
                  multiline={true}
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
                  placeholder="Translate"
                  multiline={true}
                  value={translateText}
                  onChangeText={(text) => onTypeDescription(text)}></TextInput>


                <View style={{ height: 38, marginTop: 30 }}>
                  <GreenButton text="Submit" onMethod={() => translate()} />
                </View>
              </View>
            </View>
          )}
        </View>
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
                  <View style={{ height: 38, padding: 10, marginBottom: 20 }}>
                    <GreenButton text="Download" onMethod={() => downloadImage(fileURL)} />
                  </View>
                </View>
                :
                <View>

                </View>}
          {/* <Image source = {{uri : fileURL}} style={{ width: 300, height: 500,borderColor:'black', borderWidth:1, borderRadius:5}}></Image> */}
          {/* <View style={{flex :1, padding :20, justifyContent:'center', alignItems:'center'}}>
                            <Image source = {{uri : fileURL}} style={{ width: 300, height: 500,borderColor:'black', borderWidth:1, borderRadius:5}}></Image>
                        </View> */}
          {/* <View style={{height: 38, padding: 10,marginBottom:20}}>
            <GreenButton text="Download" onMethod={() => downloadImage(fileURL)} />
          </View> */}
        </Modal>
      </ScrollView>
      {
        data.isLoading ? ShowLoader() : null
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  FlatListStyle: {
    //backgroundColor: 'white',
  },
  ListViewContainer: {
    borderRadius: 15,
    // backgroundColor: '#D3D3D3',
    // marginVertical: 10,
    padding: 20,
  },
  text1: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 20,
  },
  text2: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.BLACK,
    marginTop: 10,
  },
  text11: {
    textAlign: 'right',
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 20,
  },
  text21: {
    textAlign: 'right',
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.BLACK,
    marginTop: 10,
  },
  text3: {
    fontFamily: 'Roboto-Light',
    fontSize: 16,
    color: colors.GREY,
    marginTop: 10,
  },
  scrollViewStyle: {
    backgroundColor: 'white',
    flex: 1,
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
});
export default CaseNotesQueriesInterpreter;
