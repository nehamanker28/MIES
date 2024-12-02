import React, { Component, useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
    View,
    StyleSheet,
  Dimensions,
  Image,
  TextInput,
  Keyboard,
  BackHandler,
  SafeAreaView,
  FlatList
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import moment from 'moment'

import requestCameraAndAudioPermission from '../../components/Permission';
import { useIsFocused } from "@react-navigation/native";
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import { ApiHelper, FormApiHelper, getApiHelper } from '../../Service/Fetch'
import { ServiceUrl,AsyncStorageKey } from '../../Common/String'
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeepAwake from 'react-native-keep-awake'
import ImageCropPicker from 'react-native-image-crop-picker';
import Emoji from '../../components/Emoji';
import animatedEmoji from '../../../assets/images/emoji/gif'
import  {AppSocket} from '../../Common/AppSocket';

const VideoCallInterpreter = ({ navigation, route }) => {
  var _engine

  const [isParticipantVisible, setIsParticipantVisible] = useState(false);

  const [isMuteVideo, setIsMuteVideo] = useState(false)
  const [isMuteAudio, setIsMuteAudio] = useState(false)

  const isFocused = useIsFocused();
  //const [isFirst, setIsFirst] = useState(true)

  // const [state, setState] = useState({
  //   appId: '038b9af66c92421e9eca4b9ded8eafa2',
  //   token: '006038b9af66c92421e9eca4b9ded8eafa2IAAvwDk5UTtC38qcsca8f+HMeHF+kzx1rJwlILql2xAKyxwBjaJCsDk/IgDtQQazmdc4YAQAAQAEnDtgAgAEnDtgAwAEnDtgBAAEnDtg',
  //   channelName: 'f14a8e88-4f62-416f-a123-c5610c7a3b0a'
  // })

  const [state, setState] = useState({
    appId: '038b9af66c92421e9eca4b9ded8eafa2',
    token: '',
    channelName: ''
  })

  const [joinSucceed, setJoinSucceed] = useState(false)
  const [isToken, setIsToken] = useState(false)

  const [idArr, setIdArr] = useState([])
  const [muteIdArr, setMuteIdArr] = useState([])
  const [muteIdAudioArr, setMuteIdAudioArr] = useState([])
  //const [remoteUserMuteAudio, setRemoteUserMuteAudio] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [hour, setHour] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(60)
  const [isRecord, setIsRecord] = useState(false)
  const [resourceId, setResourceId] = useState('')
  const [sid, setSid] = useState('')
  const [recordId, setRecordId] = useState('')
  const [isScreenShare, setIsScreenShare] = useState('')
  const [isSessionTime, setSessionTime] = useState(false)

  const [maxScreenId, setMaxScreenId] = useState(0)
  const [isMaxScreen, setIsMaxScreen] = useState(false)

  const [isMaxLocalView, setIsMaxLocalView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userDetail, setUserDetail] = useState([])
  const [isTherapistJoin, setIsTherapistJoin] = useState(false)
  //const SwiftComponent = requireNativeComponent('SwiftComponent');

  var timer;
  var tempTimer;
  var users = []
  var aMuteUsers = []
  var vMuteUsers = []
  var tempU = []

  const [sessionStartByTime, setSessionStartByTime] = useState({
    hour: 0,
    minutes: 0
  })

  const [isAttach, setIsAttach] = useState(false)
  const [attachment, setAttachment] = useState([])
  const [description, setDescription] = useState('')
  const [caseNoteId, setCaseNoteId] = useState(0)
  const [myID, setmyId] = useState(null)

  const [isEmojiModel, setIsEmojiModel] = useState(false);
  const socketRef = React.useRef(null)
  const [myName, setMyName] = useState('')
  const [sessionDetail, setSessionDetail] = useState({})
  const [myUid, setMyUid] = useState(null)
  const [animated, setAnimated] = useState({
    bool: false,
    img: null,
    name: ''
  })

  useEffect(() => {

    (async () => {
      let tempId = await AsyncStorage.getItem(AsyncStorageKey.userID)
      setmyId(tempId)
      let name = await AsyncStorage.getItem(AsyncStorageKey.userName)
      setMyName(name)
    })();

    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    //console.log('use Effect params ----->>',route.params.item)
    if (isFocused) {
      let therapist = route.params.item.therapist
      let interpreter = route.params.item.interpreter
      let familyMember = route.params.item.familyMember
      setSessionDetail({ therapist, interpreter, familyMember })
    }

  }, [isFocused])

  useEffect(() => {
    if (animated.bool) {
      var timeCount = 0
      const timerId = setInterval(() => {
        timeCount = timeCount + 1
        if (timeCount == 3) {
          setAnimated({
            ...animated,
            bool:false,
            img:null,
            name:''
          })
          clearInterval(timerId);
        }

      }, 1000)
    }else {
      setAnimated({
        ...animated,
        bool:false,
        img:null,
        name:''
      })
    }

    return () => {
      //clearInterval(timerId);
    }
  }, [animated.bool])

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        //console.log('requested!');
      });
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height)
        //console.log('keyboard height ----->>>',e.endCoordinates.height)
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    if (isFocused) {
      calculateSessionDuration()
      callTokenApi()
      startTimer()
    }

    return () => {
      clearTimeout(tempTimer)
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove();
    }
  }, [isFocused])

  useEffect(() => {
    ////console.log('setIsToken ----->>>',isToken)
    if (isToken) {
      //addCaseNoteApi()
      init()
    }
    return () => {

    }
  }, [isToken])

  useEffect(() => {

    if (isSessionTime) {
      showCallDuration()
    }

    return () => {
      clearTimeout(timer)
      //clearTimeout(tempTimer)
    }
  }, [seconds, minutes, setSessionTime])


  const startTimer = () => {
    //console.log('start timer')
    let startStr = route.params.startTime + 'Z'
    let sessionTime = new Date(startStr)


    tempTimer = setInterval(
      () => {
        //  var hours = new Date().getHours(); //To get the Current Hours
        //  var min = new Date().getMinutes();
        let currentTime = new Date()
        let ms = moment(sessionTime).diff(moment(currentTime))
        var d = moment.duration(ms);

        setSessionStartByTime({
          hour: d.hours(),
          minutes: d.minutes()
        })
        // //console.log('d hour ---->>>', d.hours())
        // //console.log('d minutes ---->>>',d.minutes())

        if (d.hours() <= 0 && d.minutes() <= 0) {
          //console.log('d clear ---->>>')
          setSessionTime(true)
          showCallDuration()
          clearTimeout(tempTimer)
        }

      }, 1000);
  }

  const calculateSessionDuration = () => {
    ////console.log('duration ----->>>')
    let startStr = route.params.startTime + 'Z'
    let endStr = route.params.endTime + 'Z'

    let sessionStartDate = new Date(startStr)
    let sessionEndDate = new Date(endStr)
    //  //console.log('start time ------>>>', sessionStartDate)
    //  //console.log('end time ------>>>',sessionEndDate)
    // let hourObj = moment(sessionEndDate).diff(moment(sessionStartDate), 'hours')
    // let minutesObj = moment(sessionEndDate).diff(moment(sessionStartDate), 'minutes')

    let ms = moment(sessionEndDate).diff(moment(sessionStartDate))
    var d = moment.duration(ms);

    //console.log('hour ----->>>', d.hours())
    //console.log('min ----->>>',d.minutes())
    setHour(d.hours())
    setMinutes(d.minutes())
  }

  const showCallDuration = () => {
    timer = setTimeout(
      () => {

        if (hour == 0 && minutes == 0 && seconds == 0) {
          clearTimeout(timer)
        } else if (minutes == 0 && hour != 0) {
          setHour(hour - 1)
          setMinutes(59)
        } else if (seconds == 0 && minutes != 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          setSeconds(seconds - 1)
        }

      }, 1000);
  }

  const _keyboardDidShow = () => {
    ////console.log('Keyboard Shown');
  }

  const _keyboardDidHide = () => {
    ////console.log('Keyboard Hidden');
  }

  const callTokenApi = () => {
    ////console.log('is api calling')
    let data = {}
    ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getAgoraToken + route.params.sessionId, data, 'POST')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          setState({
            appId: response.data.appId,
            token: response.data.token,
            channelName: response.data.channelName
          })

          // setState({
          //   ...state,
          //   token: '006038b9af66c92421e9eca4b9ded8eafa2IAD9yGSuvJVaZrVbpuv+NEWKODWOZwyl42wv8UAZRrRI/Czax3wAAAAAEADqgOQ9beo5YAEAAQBt6jlg',
          //   channelName:'video'
          // })
          ////console.log('api response ----->>')

          setIsToken(true)

        } else {
          ShowAlert(response.message)
        }
      })
  }

  const addAttachmentApi = (image) => {
    setIsLoading(true)

    var data = new FormData();
    const photo = {
      uri: image.path,
      type: image.mime,
      name: 'profileImg',
    };
    data.append('profileImage', photo);

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

  const getUserDetailbyId = (id) => {
    getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getUserDetail + id, 'GET')
      .then(response => {
        if (response.code >= 200 && response.code <= 299) {
          if (tempU.indexOf(response.data) === -1) {
            //console.log('user data response-------->>>')
            tempU.push(response.data)
            setUserDetail(tempU)
          }
        } else {
          ShowAlert(response.message)
        }
      })
  }

  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  const init = async () => {

    const { appId } = state
    _engine = await RtcEngine.create(appId);
    await _engine.enableVideo();
    ////console.log('init engine ----->>>', _engine)

    _engine.addListener('Warning', (warn) => {
      //console.log('Warning', warn);
    });

    _engine.addListener('Error', (err) => {
      //console.log('Error', err);
    });

    _engine.addListener('UserJoined', (uid, elapsed) => {
      //console.log('UserJoined', uid, elapsed);
      getUserDetailbyId(uid)
      if (users.indexOf(uid) === -1) {
        users.push(uid)
        setIdArr(users)
      }
    });

    _engine.addListener('UserMuteVideo', (uid, isMute) => {
      //console.log('UserMuteVideo uid', uid + 'is mute' + isMute);
      if (isMute) {
        if (vMuteUsers.indexOf(uid) === -1) {
          vMuteUsers.push(uid)
          setMuteIdArr(vMuteUsers)
        }
      } else {
        vMuteUsers = vMuteUsers.filter((id) => id !== uid)
        setMuteIdArr(vMuteUsers)
      }
    });

    _engine.addListener('UserMuteAudio', (uid, isMute) => {
      //console.log('UserMuteAudio uid', uid + 'is mute' + isMute);
      if (isMute) {
        aMuteUsers.push(uid)
        setMuteIdAudioArr(aMuteUsers)
        //setMuteIdAudioArr([...muteIdAudioArr, uid])
      } else {
        aMuteUsers = aMuteUsers.filter((id) => id !== uid)
        setMuteIdAudioArr(aMuteUsers)
        //setMuteIdAudioArr(muteIdAudioArr.filter((id) => id !== uid))
      }
    });

    _engine.addListener('UserOffline', (uid, reason) => {
      //console.log('UserOffline', uid, reason);
      users = users.filter((id) => id !== uid)
      setIdArr(users)

      tempU = tempU.filter((user) => user.id !== uid)
      setUserDetail(tempU)
      // setIdArr(idArr.filter((id) => id !== uid))
    });

    // If Local user joins RTC channel
    _engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      //console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true 
      if (joinSucceed == false) {
        getUserDetailbyId(uid)
        setJoinSucceed(true)
        setMyUid(uid)
      }
    });

    startCall()
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  const startCall = async () => {
    // Join Channel using null token and channel name
    //console.log('start call --------->>')
    //console.log('state.token-------->>>',state.token)
    //console.log('state.channelName-------->>>', state.channelName)
    KeepAwake.activate();

    let id = await AsyncStorage.getItem(AsyncStorageKey.userID)
    let userId = parseInt(id)
    //console.log('userId-------->>>',userId)
    try {

      await _engine?.joinChannel(
        state.token,
        state.channelName,
        null,
        userId
      ).then(() => {
        //console.log('then -->>')
      }).catch((error) => {
        //console.log('e -->>',error)
      })

    } catch (e) {
      //console.log('err -->>',error)
    }
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  const endCall = async () => {
    _engine = await RtcEngine.create(state.appId);
    await _engine?.leaveChannel();
    setJoinSucceed(false)
    navigation.pop()
  };

  // const recordCall = async () => {
  //   let userId = await AsyncStorage.getItem(AsyncStorageKey.userID)
  //   //let userId = parseInt(id) 
  //    //console.log('acquire api call ---------------->>')
  //   let data = {
  //           'cname': state.channelName, 'uid': userId
  //           }
  //     ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.acquireVideoCall, data, 'POST')
  //       .then(response => {
  //           if (response.code >= 200 && response.code <= 299) {
  //             ShowAlert('you have start recording')
  //             startRecordCall(response.data.resourceId)
  //           } else {
  //               ShowAlert(response.message)
  //           }
  //       })
  // }

  // const screenShare = () => {
  //   return (
  //     <View style={styles.container}>
  //       <this.mySwiftComponent
  //           myText={'Initial Value'}
  //           ref={(component) => this.mySwiftComponentInstance = component } />
  //     </View>
  //   )
  // }

  // const startRecordCall = async (resourceId) => {
  //   //console.log('start api call ---------------->>')
  //   let userId = await AsyncStorage.getItem(AsyncStorageKey.userID)
  //   //let userId = parseInt(id) 
  //   var clientRequest = { 'token': state.token }
  //   let data = {
  //           "clientRequest": clientRequest, 'cname': state.channelName, 'uid': userId, 'resourceId': resourceId
  //           }
  //     ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.startRecordSession + route.params.sessionId + '/start-recording', data, 'POST')
  //       .then(response => {
  //         if (response.code >= 200 && response.code <= 299) {
  //               setIsRecord(true)
  //               setResourceId(response.data.resourceId)
  //               setSid(response.data.sid)
  //               setRecordId(response.data.sessionRecordingId)
  //               //stopRecordCall(response.data.resourceId,response.data.sid, response.data.sessionRecordingId)
  //           } else {
  //               ShowAlert(response.message)
  //           }
  //       })
  // }

  // const stopRecordCall = async () => {
  //   //console.log('stop api call ---------------->>')
  //   let userId = await AsyncStorage.getItem(AsyncStorageKey.userID)
  //   //let userId = parseInt(id) 
  //   var clientRequest = { 'token': state.token }
  //   let data = {
  //           'cname': state.channelName, 'uid': userId, 'resourceId': resourceId, 'sid':sid
  //           }
  //     ApiHelper(ServiceUrl.base_url_91 + ServiceUrl.stopRecordSession + recordId + '/stop', data, 'POST')
  //       .then(response => {
  //           if (response.code >= 200 && response.code <= 299) {
  //                 setIsRecord(false)
  //           } else {
  //               ShowAlert(response.message)
  //           }
  //       })
  // }

  const maximizeRemoteView = (value) => {
    if (isMaxScreen) {
      setIsMaxScreen(false)
      setMaxScreenId(0)
    } else {
      setIsMaxScreen(true)
      setMaxScreenId(value)
    }

  }

  const maximizeLocalView = (value) => {
    if (isMaxLocalView) {
      setIsMaxLocalView(false)
    } else {
      setIsMaxLocalView(true)
    }
  }

  const openEmojiModel = () => {
    setIsEmojiModel(true)
  }

  const closeEmojiModel = () => {
    setIsEmojiModel(false)
  }

  const sendEmoji = (img) => {
    closeEmojiModel()
    setAnimated({
      ...animated,
      bool: true,
      img: animatedEmoji[img],
      name: myName
    })

    socketRef.current(img, myUid, myName)
  }

  const receiveEmoji = (msg) => {
    setAnimated({
      ...animated,
      bool: true,
      img: animatedEmoji[msg.data.content],
      name: msg.data.sender.name
    })
  }

  const _renderRemoteVideos = () => {
    //const { peerIds } = state;

    return (
      <View
        style={{ flex: 1 }}
      >
        {idArr.map((value) => {
          ////console.log(' id arr ---->', idArr)
          if (isMaxScreen && maxScreenId == value) {
            return (
              <View style={{ flex: 1 }} key={value}>
                {
                  muteIdArr.includes(value) ? <View style={{ flex: 1, backgroundColor: 'black' }}></View>
                    :
                    <RtcRemoteView.SurfaceView
                      key={value}
                      style={{ flex: 1 }}
                      uid={value}
                      channelId={state.channelName}
                      renderMode={VideoRenderMode.Hidden}
                    />
                }
                {
                  idArr.length == 1 ?
                    <View>
                    </View>
                    :
                    <TouchableOpacity onPress={() => maximizeRemoteView(value)} style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 40, right: 0 }}>
                      <Image source={require('../../../assets/images/expand_video.png')} style={{ width: 30, height: 30 }}></Image>
                    </TouchableOpacity>
                }
                <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 5, right: 0 }}>
                  {
                    muteIdAudioArr.includes(value) ? <Image source={require('../../../assets/images/voice_mute.png')} style={{ width: 30, height: 30 }}></Image>
                      :
                      <Image source={require('../../../assets/images/voice_unmute.png')} style={{ width: 30, height: 30 }}></Image>
                  }
                </View>
              </View>
            );

          } else if (isMaxScreen == false) {
            return (
              <View style={{ flex: 1, marginHorizontal: 2 }} key={value}>
                {
                  muteIdArr.includes(value) ? <View style={{ flex: 1, backgroundColor: 'black' }}></View>
                    :
                    <RtcRemoteView.SurfaceView
                      key={value}
                      style={{ flex: 1 }}
                      uid={value}
                      channelId={state.channelName}
                      renderMode={VideoRenderMode.Hidden}
                    />
                }
                {
                  idArr.length == 1 ?
                    <View>
                    </View>
                    :
                    <TouchableOpacity onPress={() => maximizeRemoteView(value)} style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 40, right: 0 }}>
                      <Image source={require('../../../assets/images/expand_video.png')} style={{ width: 30, height: 30 }}></Image>
                    </TouchableOpacity>
                }
                <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 5, right: 0 }}>
                  {
                    muteIdAudioArr.includes(value) ? <Image source={require('../../../assets/images/voice_mute.png')} style={{ width: 30, height: 30 }}></Image>
                      :
                      <Image source={require('../../../assets/images/voice_unmute.png')} style={{ width: 30, height: 30 }}></Image>
                  }
                </View>
              </View>
            );
          }

        })}
      </View>
    );
  };

  const renderLocalVideo = () => {
    if (isMaxLocalView) {
      return (
        <View style={{ position: 'absolute', bottom: 0, right: 0, top: 0, left: 0 }}>
          {
            isMuteVideo ? <View style={{ flex: 1, backgroundColor: 'black' }}></View>
              :
              <RtcLocalView.SurfaceView
                style={styles.max}
                channelId={state.channelName}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
          }
          <TouchableOpacity onPress={() => maximizeLocalView()} style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 5, left: 0 }}>
            <Image source={require('../../../assets/images/expand_video.png')} style={{ width: 30, height: 30 }}></Image>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={{ position: 'absolute', width: 150, height: 150, top: 0, left: 0 }}>
          {
            isMuteVideo ? <View style={{ flex: 1, backgroundColor: 'black' }}></View>
              :
              <RtcLocalView.SurfaceView
                style={styles.max}
                channelId={state.channelName}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
          }
          <TouchableOpacity onPress={() => maximizeLocalView()} style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 5, left: 0 }}>
            <Image source={require('../../../assets/images/expand_video.png')} style={{ width: 30, height: 30 }}></Image>
          </TouchableOpacity>
        </View>
      )
    }

  }

  const videoToggle = async () => {
    _engine = await RtcEngine.create(state.appId);
    var isMute = false
    if (isMuteVideo) {
      setIsMuteVideo(false)
      isMute = false
    } else {
      setIsMuteVideo(true)
      isMute = true
    }
    //console.log('isEnableVideo---->>>',isMuteVideo)
    await _engine.muteLocalVideoStream(isMute)
  }

  const audioToggle = async () => {
    _engine = await RtcEngine.create(state.appId);
    var isMute = false
    if (isMuteAudio) {
      setIsMuteAudio(false)
      isMute = false
    } else {
      isMute = true
      setIsMuteAudio(true)
    }
    ////console.log('isEnableAudio---->>>',isMuteAudio)
    await _engine.muteLocalAudioStream(isMute)

  }

  const topBar = () => {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'black', height: 25, marginVertical: 5 }}>
        <TouchableOpacity onPress={() => showParticipantList()} style={{ flexDirection: 'row', flex: 1, marginHorizontal: 20 }}>
          <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18, color: 'white' }}>participants</Text>
          <Image source={require('../../../assets/images/arrow_down.png')} style={{ marginLeft: 5, width: 20, height: 20, marginTop: 5, resizeMode: 'contain' }}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openEmojiModel()} style={{ marginRight: 30 }}>
          <Image source={require('../../../assets/images/smaile.png')} style={{ width: 20, height: 20 }}></Image>
        </TouchableOpacity>
      </View>
    )
  }

  const showParticipantList = () => {
    setIsParticipantVisible(true)
  }

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row' }}>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image source={{ uri: item.profilePicUrl }} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
          {
            ////console.log('item id to show----->>>',item.id + ' ====' + myID),
            item.id == myID ?
              <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16, color: 'black', marginLeft: 10 }}>
                {item.firstName + ' (You)'}
              </Text>
              :
              <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16, color: 'black', marginLeft: 10 }}>
                {item.firstName}
              </Text>
          }
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {
              muteIdAudioArr.includes(item.id) ? <Image source={require('../../../assets/images/voice_mute.png')} style={{ width: 20, height: 20 }}></Image>
                :
                <Image source={require('../../../assets/images/voice_unmute.png')} style={{ width: 20, height: 20 }}></Image>
            }
          </View>
        </View>
      </View>
    </View>
  );

  const closeParticipantView = () => {
    setIsParticipantVisible(false)
  }

  const showAniEmoji = () => {
    return (
      animated.bool ?
        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', top: '50%' }}>
          <Image source={animated.img} style={{ width: 80, height: 80, resizeMode: 'contain', margin: 5 }}></Image>
          <View style={{ backgroundColor: '#1667C9', padding: 5 }}>
            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 13, color: 'white', textAlign: 'center' }}>Send By</Text>
            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: 'white', marginTop: 2 }}>{animated.name}</Text>
          </View>
        </View>
        :
        null
    )
  }

  return joinSucceed ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <AppSocket sessionDetail={sessionDetail} id={route.params.sessionId} ref={socketRef} receive={receiveEmoji}></AppSocket>
      {topBar()}
      <View style={styles.videoBaseView}>
        {_renderRemoteVideos()}
        {renderLocalVideo()}
        <View style={styles.durationTimer}>
          {
            isSessionTime ?
              <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: 'white' }}>Remaining {hour} : {minutes} : {seconds} Sec</Text>
              :
              <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: 'white' }}>Session start after {sessionStartByTime.hour} : {sessionStartByTime.minutes} Min</Text>
          }

        </View>

        <TouchableOpacity style={styles.recordTouchStyle} onPress={() => endCall()}>
          <Image source={require('../../../assets/images/end_call.png')} style={styles.recordButtonStyle}></Image>
        </TouchableOpacity>


        <TouchableOpacity style={styles.videoMuteTouchStyle} onPress={() => videoToggle()}>
          {
            isMuteVideo ?
              <Image source={require('../../../assets/images/video_mute.png')} style={styles.videoMuteStyle}></Image>
              :
              <Image source={require('../../../assets/images/video_unmute.png')} style={styles.videoMuteStyle}></Image>
          }
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.recordTouchStyle} onPress={() => {
          isRecord ? stopRecordCall() : recordCall()
          //screenShare()
      }}>
        {
          isRecord ?
            <Image source={require('../../../assets/images/record_stop.png')} style={styles.recordButtonStyle}></Image>
            :
            <Image source={require('../../../assets/images/call_stop.png')} style={styles.recordButtonStyle}></Image>
        }
            
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.audioMuteTouchStyle} onPress={() => audioToggle()}>
          {
            isMuteAudio ?
              <Image source={require('../../../assets/images/voice_mute.png')} style={styles.audioMuteStyle}></Image>
              :
              <Image source={require('../../../assets/images/voice_unmute.png')} style={styles.audioMuteStyle}></Image>
          }
        </TouchableOpacity>

        {/* {modalViewPresenter()} */}
        {showAniEmoji()}
      </View>
      {
        isEmojiModel ? <Emoji isOpen={isEmojiModel} selectMethod={sendEmoji} closeEmojiMethod={closeEmojiModel}></Emoji> : null
      }
      <Modal isVisible={isParticipantVisible}
        onBackdropPress={() => setIsParticipantVisible(false)}
        style={styles.box2}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20, backgroundColor: 'white' }}>

          <View style={{ backgroundColor: 'black', justifyContent: 'flex-end', alignItems: 'flex-end' }} >
            <TouchableOpacity onPress={() => closeParticipantView()}>
              <Image source={require('../../../assets/images/close.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }}></Image>
            </TouchableOpacity>
          </View>

          <FlatList
            data={userDetail}
            renderItem={renderItem}
            keyExtractor={(item, index) => 'index' + index}
          />
        </View>
      </Modal>
      {
        isLoading ? ShowLoader() : null
      }
    </SafeAreaView>
  ) : (<View style={styles.max}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18, textAlign: 'center' }}>Connecting...</Text>
    </View>
  </View>)
}

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  max: {
    flex: 1
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  videoBaseView: {
    flex: 1,
    backgroundColor: 'black'
  },
  remoteContainer: {
    width: dimensions.width,
    height: dimensions.height/2,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  videoMuteStyle: {
        width: 50,
        height: 50
  },
  videoMuteTouchStyle: {
        width: 50,
        height: 50,
        left: 30,
        bottom: 55,
        position: 'absolute',
  },
  box2: {
    opacity: 0.9,
    borderRadius: 20,
    flex :1,
    padding :20,
    paddingVertical:40
  },
  audioMuteStyle: {
        width: 50,
        height: 50
  },

  audioMuteTouchStyle: {
        width: 50,
        height: 50,
        right: 30,
        bottom: 55,
        position: 'absolute',
  },
   endCallStyle: {
        width: 50,
        height: 50
  },

  endTouchCallStyle: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        bottom: 130,
        position: 'absolute',
  },

   recordButtonStyle: {
        width: 50,
        height: 50,
  },

  recordTouchStyle: {
        width: 50,
        height: 50,
        alignSelf:'center',
        bottom: 55,
        position: 'absolute'
  },

  caseNoteBox: {
    left: 0,
    right: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius:15,
    height: 280,
    bottom: 5,
    position: 'absolute',
    backgroundColor: 'black'    
  },
  caseNoteBoxKeyboard: {
    left: 0,
    right: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius:15,
    height: 280,
    bottom:0,
    position: 'absolute',
    backgroundColor: 'black'    
  },
  caseNoteSmallBox: {
    left: 0,
    right: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius:15,
    height: 50,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'black'    
  },

  durationTimer: {
    borderTopRightRadius: 15,
    borderTopLeftRadius:15,
    height: 50,
    top:20,
    position: 'absolute',
    alignSelf: 'center'
  },

 
});

export default VideoCallInterpreter
