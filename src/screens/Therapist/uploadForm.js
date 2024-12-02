import React, {useState, useEffect,useRef} from 'react';

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
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import colors from '../../Common/Colors';
import {getApiHelper,ApiHelper,FormApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import {Image} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import PDFView from 'react-native-view-pdf';
import GreenButton from '../../components/GreenButton';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment'
import RBSheet from "react-native-raw-bottom-sheet"
import ImageCropPicker from 'react-native-image-crop-picker';


const uploadForm = ({navigation, route}) => {
  const refRBSheet = useRef();
    const[pdffile,setpdffile] = useState({})
    const [title,setTitle] = useState('')
    const[fileURL,setFileURL]= useState('')
    const[attachment,setAttachment] = useState([])
    const [isAttach, setIsAttach] = useState(false)
    const [driveName, setDriveName] = useState('')
    const [Gallery,setGallery]= useState('')
    const [isModalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState({
        attachment: [],
        isLoading: false,
      });
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("dsvvd======",Platform.OS)
    if (Platform.OS == 'android') {
      setDriveName('Drive')
    } else {
      setDriveName('iCloud')
    }
    return () => {
    
    };
  }, [isFocused]);
  
  const uploadFiles = () => {
    refRBSheet.current.open();
  };
  const toggleModal = (item) => {
    //console.log("fileurl ",item)
    setFileURL(item)
    setModalVisible(!isModalVisible);
  };

  const openDocumentPicker = async () => {
    if (Platform.OS == 'android') {
      setGallery('Drive')
    } else {
      setGallery('iCloud')
    } 
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
     
        //console.log('types00 ------>>>', res);
        setpdffile(res)
        let AttachData = res;
        //console.log(AttachData)
        setAttachment([...attachment, AttachData]);
        setIsAttach(true)
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err;
        }
    }
}

const UpdateForm = () =>{
  console.log('UPDATE')
  var data = new FormData();
  let fileObj ;
  if(Platform.OS == "ios"){
    if (Gallery == 'Gallery') {
      fileObj = {
        uri: pdffile.sourceURL,
        type: pdffile.mime,
        name: pdffile.filename,
      };
    } else {
      fileObj = {
        uri: pdffile.uri,
        type: pdffile.type,
        name: pdffile.name,
      };
    }    
   }
  else if(Platform.OS == "android"){
   
    if (Gallery == 'Gallery') {
      fileObj = {
        uri: pdffile.path,
        type: pdffile.mime,
        name: 'meisImage'
       };
    } else {
      fileObj = {
        uri: pdffile.uri,
        type: pdffile.type,
        name: pdffile.name,
     
       };
    }
  }
 console.log(' fileObj Update---->>', route.params.formID)
 setData({
  isLoading:true
})
  // data.append('form', fileObj);

   if(route.params.sender == 'ROLE_FAMILY'){
    data.append('form', fileObj);
  //data.append("reply", "true");
  data.append("replyId", route.params.formID);
  data.append("title", title);
  data.append("sender", route.params.sender);
  data.append("therapistId", route.params.therapistId);
  data.append("familyMemberId", route.params.familyMemberId);
   }
   else{
    //data.append("id", route.params.formID);
    data.append('form', fileObj);
    data.append("title", title);
    data.append("reply", "true");
    
   }
   //console.log("DATA UPDATE = ",data)
  FormApiHelper(
    ServiceUrl.base_url_91 + ServiceUrl.updateForms + route.params.formID ,
    data,
    'PUT',
  ).then((response) => {
    setData({
      isLoading:false
    })
    if (response.code >= 200 && response.code <= 299) {
     //console.log('Form Updated')
    
     navigation.pop()
    } else {
      ShowAlert(response.message);
    }
  });
}

const uploadForm = () => {
    // setIsAttach(true)
     //setIsLoading(true)
         setData({
           isLoading:true
         })
     var data = new FormData();
     let fileObj;
    
     if(Platform.OS == "ios"){
       if (Gallery == 'Gallery') {
         fileObj = {
           uri: pdffile.sourceURL,
           type: pdffile.mime,
           name: pdffile.filename,
         };
       } else {
         fileObj = {
           uri: pdffile.uri,
           type: pdffile.type,
           name: pdffile.name,
         };
       }    
       console.log("dsvvd======")
     }
    else if(Platform.OS == "android"){
     
      if (Gallery == 'Gallery') {
        fileObj = {
          uri: pdffile.path,
          type: pdffile.mime,
          name: 'meisImage'
         };
      } else {
        fileObj = {
          uri: pdffile.uri,
          type: pdffile.type,
          name: pdffile.name,
       
         };
      }
   
    }
    // fileObj = {
    //   uri: pdffile.uri,
    //   type: pdffile.type,
    //   name: pdffile.name
    //  };
   
 if(route.params.sender == 'ROLE_THERAPIST'){
  data.append('form', fileObj);
  data.append("reply", "true");
  data.append("title", title);
  data.append("sender", route.params.sender);
  data.append("therapistId", route.params.therapistId);
  data.append("familyMemberId", route.params.familyMemberId);
 } 
 else{
  data.append('form', fileObj);
  data.append("reply", "true");
  data.append("replyId", route.params.formID);
  data.append("title", title);
  data.append("sender", route.params.sender);
  data.append("therapistId", route.params.therapistId);
  data.append("familyMemberId", route.params.familyMemberId);
 }
 console.log(' fileObj1 ---->>',data)  
     FormApiHelper(
       ServiceUrl.base_url_91 + ServiceUrl.uploadForms,
       data,
       'POST',
     ).then((response) => {
      setData({
        isLoading:false
      })
       if (response.code >= 200 && response.code <= 299) {
        //console.log('Form Uploaded')
       
        navigation.pop()
       } else {
         ShowAlert(response.message);
       }
     });
   }


const renderItem = ({item}) => (
    <View style= {{marginTop:20}}>
  
       { (Platform.OS == 'ios') ? 
          <TouchableOpacity onPress={() => downloadPdf(item)}>
          <View>
        <TouchableOpacity
            style={{marginVertical: 0, marginRight: 5}}
            >
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
        </View>
          </TouchableOpacity>
         : 
         <View>
        <TouchableOpacity
            style={{marginVertical: 0, marginRight: 5}}
            >
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
          <View   style = {{position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0}}>
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
  const openGallery = () => {
   
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      //cropping: true,
    }).then((image) => {
      refRBSheet.current.close()
      setGallery("Gallery")
      ////console.log("image ---------->>>",image);
      setAttachment([...attachment, image]);
      setpdffile(image)
      console.log(pdffile)
      setIsAttach(true)
    });
  };
  const deleteAttachment = (itemID) => {
    const filteredData = attachment.filter(item => item.id !== itemID.id)
    console.log(filteredData)
    setAttachment(filteredData)
  }
  return (
    <SafeAreaView style={styles.container}>
     {
                data.isLoading ? ShowLoader() : null
            }
          <View>
         
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
            <View style={{ justifyContent: 'space-between',marginTop:20,padding:30}}>
             
            <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.BLACK,}}>Enter Title</Text>
            <ScrollView keyboardShouldPersistTaps='never'>
            <TextInput
                      style={styles.input1}
                      placeholder='Enter Title'
                      //returnKeyType="next"
                    blurOnSubmit={false}
                    autoCapitalize = 'none'
                    onChangeText={(value) => {
                        setTitle(value)
                    }}
                />
               </ScrollView>
            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                <TouchableOpacity style={{}} onPress={() => uploadFiles()}>
                <Image source={require('../../../assets/images/attachment.png')} style={{ width: 40, height: 40, marginEnd: 10,resizeMode:'contain' }}></Image>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: colors.BLACK, }}>Attach document</Text>
                </View>
                <FlatList
          style={{backgroundColor: 'white'}}
          data={attachment}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'item' + index}
        />
         <Modal isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
                        style = {styles.box2}>
          <ScrollView>
          <PDFView
          fadeInDuration={250.0}
          style={{paddingVertical:230,flex:1}}
          resource={fileURL.uri}
          resourceType= 'url'
          onLoad={() => console.log('PDF rendered')}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
          </ScrollView>
          </Modal>
          {route.params.Title == 'Upload'?
          <View style={{height: 38, marginTop: 20,marginBottom:20}}>
            <GreenButton text= {route.params.Title}  onMethod={() => uploadForm()} />
          </View> :
          <View style={{height: 38, marginTop: 20,marginBottom:20}}>
            <GreenButton text= {route.params.Title} onMethod={() => UpdateForm()} />
          </View>}
            </View>
            
        
        </View>
      
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  text1: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: colors.BLACK,
    marginTop: 20,
  },
  text2: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: colors.BLACK,
    //marginTop :5,
  },
  text4: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    color: colors.WHITE,
    textAlign: 'center',
  },
  text3: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.GRY,
  },
  text5: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 15,
  },
  box2: {
    opacity: 0.9,
    marginVertical: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    
    // marginHorizontal: 30,
    // marginVertical:50
    //marginBottom:40,
    //right:90
  },
  box3: {
    opacity: 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 30,
    marginVertical:30
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

export default uploadForm;


