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
import * as mime from 'react-native-mime-types';

const formsFamily = (props) => {
    const isFocused = useIsFocused();
    const [therapistId,settherapistId] = useState(0)
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];
  const [data, setData] = useState({
    content: [],
    isLoading: false,
  });
  const [team, setMyTeam] = useState({
    child: [],
    isLoading: true,
  });


  const downloadPdf = async(pdfURL) => {
    console.log("pd download")
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
 
  const getSessionsHistory = () => {
    setData({
        ...data,
        isLoading:true
    })
    ////console.log('date-------->>',today)
    let sTime = moment(today).utc().format('YYYY-MM-DD'+'T'+'HH:mm:ss')

    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.familySessions + '?startDateTimeLessThan=' + sTime + '&sort=startDateTime,DESC', 'GET')
    .then(response => {
            if (response.code >= 200 && response.code <= 299) {
                setData({
                    ...data,
                    isLoading: false,
                    sessions: response.data.content
                })
                ////console.log('session detail--->>',response.data.content)
            } else {
                ShowAlert(response.message)
            }
        })
}

  useEffect(() => {
    if (isFocused) {
         getFamilyProfile();
        //getFamily();
      }
    return () => {};
  }, [isFocused]);


  const getFamilyProfile = () => {
    setMyTeam({
      ...team,
      isLoading: true,
    })
    getApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.getFamilyProfile,
      'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Response', response.data.familyMember);
        
          setMyTeam({
            ...team,
            isLoading: false,
            child: response.data.familyMembers.slice(0,3),
          });
          //console.log('myteam = ', team.child);
      
          //storeMyTeamDetails(response.data.familyMembers);
        
      } else {
        ShowAlert(response.message);
      }
    });
  };
  const renderItemTeam = ({item}) => {
    let familyMemberTh = [];
    let familyMemberId = item.id; 
    //console.log('FamilyMeberID',familyMemberId)
    if (item.familyMemberTherapies) {
      familyMemberTh = item.familyMemberTherapies.map((row) => {
        console.log('id = ',item)
        return (
          <TouchableOpacity  onPress={() => props.navigation.navigate('formsDetails', {familyMemberId:familyMemberId,sender:'ROLE_FAMILY',therapistId:row.therapist.userProfile.id})}
           style={{flex:1}}>
           <View style={{ flexDirection: 'row', padding: 20}}>
              <View style={{flex:1, flexDirection:'row'}}>
                  <Image
                   source={{uri: item.profileUrl}}
                    style={styles.profileImage}></Image>

                  
                         <Text style={{fontFamily: 'Roboto-Medium', fontSize: 20,flex:1,marginTop:10,marginStart:5}}>
                {/* {row.therapist.userProfile.firstName} */}
                        {item.firstName} {item.lastName}
                    </Text>
                    
                </View>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', alignContent:'space-between'}}>
            <Image source={require('../../../assets/images/arrow.png')} style={{width:20, height:20, marginLeft:10}} resizeMode='contain'></Image>
            </View>
            </View>
          </TouchableOpacity>
          
        );
      });
    }
    return(
     <View>
      {familyMemberTh}
     </View>
    )
    
    //   <View>

    //   </View>
  };
  const renderItem = ({item}) => (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', paddingHorizontal:10,paddingVertical:20}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{justifyContent: 'center', paddingLeft: 10}}>
            <Text style={{fontFamily: 'Roboto-Bold', fontSize: 18}}>
              {item.familyMember.firstName}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableOpacity
                style={styles.downloadButton}
               onPress={() => downloadPdf(item)}
                >
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

              <TouchableOpacity
                style={styles.UploadButton}
                onPress={() => props.navigation.navigate('uploadForm', {familyMemberId:item.familyMember.id,sender:'ROLE_THERAPIST',therapistId:therapistId})}>
                <Image
                  source={require('../../../assets/images/upload.png')}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    tintColor: '#0e84d2',
                  }}></Image>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 14,
                    color: '#387af6',
                    marginStart: 10,
                  }}>
                  Upload Form
                </Text>
              </TouchableOpacity>
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
                  height: 0.5,
                  width: '100%',
                  backgroundColor: '#C8C8C8',
                   marginTop:20,
                   marginBottom :10,
              }}
      />
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
      <FlatList
            //horizontal={true}
            style={styles.FlatListStyle}
            data={team.child}
            renderItem={renderItemTeam}
            scrollEnabled={true}
            //initialNumToRender = {2}
            ItemSeparatorComponent={ItemSeparatorView}
            keyExtractor={(item, index) => 'index' + index}
          />
        </View>
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
   // backgroundColor: 'white',
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 3,
  },
  UploadButton: {
    borderColor: '#0e84d2',
    borderRadius: 20,
    padding: 15,
   
    marginStart: 20,
   
    borderWidth: 1,
    height: 30,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    backgroundColor: '#0fd683',
    borderRadius: 20,
    borderColor: '#e2e2e2',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
    // marginStart :20,
   
    borderWidth: 1,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 20,
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

export default formsFamily;
