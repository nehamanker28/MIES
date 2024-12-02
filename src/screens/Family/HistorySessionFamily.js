import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import colors from "../../Common/Colors";
import string, { ServiceUrl, AsyncStorageKey } from '../../Common/String';
import { useIsFocused } from "@react-navigation/native";
import moment from 'moment'
import momentTz from 'moment-timezone'
import { LogBox } from 'react-native'
import { getApiHelper } from '../../Service/Fetch'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import VideoPlayer from 'react-native-video-player';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";

import GreenButton from '../../components/GreenButton'
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreAllLogs()


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const HistorySessionFamily = ({ navigation }) => {
    const isFocused = useIsFocused();
    const today = new Date()
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({
        isLoading: false,
        sessions: [],
        maxPage: 0
    })
    const [isModalVisible, setModalVisible] = useState(false);
    const [videoUrl, setVideoUrl] = useState('')
    const [pageNo, setPageNo] = useState(0)
    const [isNextVideo, setIsNextVideo] = useState(false)
    const [isPrevVideo, setIsPrevVideo] = useState(false)
    const [videoNo, setVideoNo] = useState(0)
    const [videoList, setVideoList] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setData({
            isLoading: false,
            sessions: [],
            maxPage: 0
        })
        setPageNo(0)
        getSessionsHistory()
    
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));    
    }, []);

    useEffect(() => {
        if (isFocused) {
            getSessionsHistory()
        }else if(isFocused == false){
            setData({
                isLoading: false,
                sessions: [],
                maxPage: 0
            })
            setPageNo(0)
        }

        return () => {

        }
    }, [isFocused, pageNo])

    useEffect(() => {
        if (videoNo == (videoList.length - 1)) {
            setIsNextVideo(false)
        } else if (videoNo == 0) {
            setIsPrevVideo(false)
        }

        return () => {

        }
    }, [videoNo])

    const ItemSeparatorView = () => {
        return (
            // FlatList Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                    marginTop: 5,
                    marginBottom: 5,
                }}
            />
        );
    };

    const loadMoreResults = (info) => {
        // console.log('loaddd morreee', pageNo)
        // console.log('data.maxPage', data.maxPage)
        if (pageNo < (data.maxPage - 1)) {
            setPageNo(pageNo + 1)
        }
    }

    const ViewCaseNote = () => {
        navigation.navigate('CaseNotesQueriesFamily')
    }

    const calculateDuration = (item) => {
        let sessionStartDate = new Date(item.startDateTime)
        let sessionEndTime = new Date(item.endDateTime)

        let hour = moment(sessionEndTime).diff(moment(sessionStartDate), 'hours')
        let minutes = moment(sessionEndTime).diff(moment(sessionStartDate), 'minutes')

        var returnText = ''
        if (hour < 1) {
            returnText = minutes + ' min'
        } else if (hour == 1) {
            returnText = '1 hour'
        } else {
            returnText = hour + ' hours'
        }

        return returnText
    }


    const convertTime = (item) => {

        // //console.log('tem.startDateTime -->>', item.startDateTime)
        // //console.log('tem.startDateTime -->>',typeof(item.startDateTime))
        let sessionStartDate = moment.utc(item.startDateTime).local()
        let sessionEndDate = moment.utc(item.endDateTime).local()

        // //console.log('sessionStartDate -->>',sessionStartDate)
        // //console.log('sessionStartDate -->>',typeof(sessionStartDate))

        let sTime = moment(sessionStartDate).format('hh:mm a')
        let eTime = moment(sessionEndDate).format('hh:mm a')

        // //console.log('sTime -->>',sTime)
        // //console.log('eTime -->>',typeof(sTime))

        return (sTime + " - " + eTime)
    }

    const isRecordAvailable = (item) => {
        const recordingList = (item.sessionRecordings || []).map(itemObj => itemObj.sessionRecordingFiles?.map(itx => itx?.fileUrl))?.flat()?.filter(Boolean)
        // console.log('recordingList---->>',recordingList)
        if (recordingList.length > 0) {
            return true
        } else {
            return false
        }
    }

    const watchVideo = (recordVideoObj) => {
        ////console.log('watch video')
        // setData({
        //     ...data,
        //     isLoading:true
        // })

        const recordingList = (recordVideoObj || []).map(itemObj => itemObj.sessionRecordingFiles?.map(itx => itx?.fileUrl))?.flat()?.filter(Boolean)
        if (recordingList.length > 1) {
            setIsNextVideo(true)
        }
        setVideoList(recordingList)
        setVideoUrl(recordingList[videoNo])
        setModalVisible(true)
    }

    const playNextVideo = () => {
        //console.log('videoNo------->>',videoNo)
        if (videoNo < (videoList.length - 1)) {
            setVideoNo(videoNo + 1)
            setVideoUrl(videoList[videoNo + 1])
            setIsPrevVideo(true)
        }
    }

    const playPrevVideo = () => {
        //console.log('videoNo------->>',videoNo)
        if (videoNo > 0) {
            setVideoNo(videoNo - 1)
            setVideoUrl(videoList[videoNo - 1])
            setIsNextVideo(true)
        }
    }

    const downloadVideo = async (videoURL) => {
        console.log('path', videoURL)
        setLoader(true)
        // const granted = await getPermissionAndroid();
        // if (!granted) {
        //   return;
        // }
        const { config, fs } = RNFetchBlob;
        let ext = 'mov';
        let options = {
            fileCache: true,
            appendExt: ext,
        }
        config(options)
            .fetch('GET', videoURL)
            .then(res => {
                //console.log('path',res.path())
                CameraRoll.save(res.path())
                    .then(
                        alert('File Downloaded Successfully.'),
                        setLoader(false))
            });
    };


    const getSessionsHistory = () => {
        setData({
            ...data,
            isLoading: true
        })
        ////console.log('date-------->>',today)
        let sTime = moment(today).utc().format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
        var timeZone = momentTz.tz.guess()

        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.familySessions + '?endDateTimeLessThan=' + sTime + '&timeZone=' + timeZone + '&sort=startDateTime,DESC' + '&page=' + pageNo + '&size=20', 'GET')
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    setData({
                        ...data,
                        isLoading: false,
                        sessions: data.sessions.concat(response.data.content),
                        maxPage: response.data.totalPages
                    })
                    ////console.log('session detail--->>',response.data.content)
                } else {
                    ShowAlert(response.message)
                }
            })
    }

    const renderItem = ({ item }) => (
        <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 180 }}>
                    <Text style={styles.text2}>{moment(item.startDateTime).format('MMM DD, YYYY')}</Text>
                </View>
                <View style={{ paddingRight: 185 }}>
                    <Text style={styles.text1}>{item.familyMember.firstName}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 180 }}>
                    <Text style={styles.text3}>Start Time </Text>
                    <Text style={styles.text2}>{convertTime(item)}</Text>
                </View>

                <View style={{}}>
                    <Text style={styles.text3}>Time Spend </Text>
                    <Text style={styles.text2}>{calculateDuration(item)}</Text>
                    {
                        isRecordAvailable(item) ?
                            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', alignItems: 'center', borderColor: '#387af6', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }} onPress={() => watchVideo(item.sessionRecordings)}>
                                <Image source={require('../../../assets/images/watch_video.png')} resizeMode='contain' style={{ width: 15, height: 15, marginRight: 10 }}></Image>
                                <Text style={{ fontFamily: 'Roboto-Light', fontSize: 18, color: '#387af6' }}>Watch Video</Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <FlatList
                    //horizontal={true}
                    style={styles.FlatListStyle}
                    data={data.sessions}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => 'index' + index}
                    ItemSeparatorComponent={ItemSeparatorView}
                    onEndReachedThreshold={0.01}
                    onEndReached={info => {
                        loadMoreResults(info);
                    }}
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                />
                {/* <Text>History</Text> */}
            </View>
            {
                data.isLoading ? ShowLoader() : null
            }
            <Modal isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={styles.box2}>

                <View>
                    <VideoPlayer
                        hideControlsOnStart={false}
                        video={{ uri: videoUrl }}
                        videoWidth={1600}
                        videoHeight={1200}
                        ignoreSilentSwitch="ignore"
                    />
                    <View style={{ height: 38, padding: 10, marginBottom: 20 }}>
                        <GreenButton text="Download" onMethod={() => downloadVideo(videoUrl)} />

                    </View>
                    {loader ? <ActivityIndicator size="small" color='#387af6' /> : null}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }}>
                        {
                            isPrevVideo ?
                                <TouchableOpacity onPress={() => playPrevVideo()} style={{ borderColor: '0e84d2', borderRadius: 10, borderWidth: 1, width: 150, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.text2}>prev video</Text>
                                </TouchableOpacity>
                                :
                                <View style={{ borderColor: '0e84d2', borderRadius: 10, borderWidth: 1, width: 150, height: 40, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                                    <Text style={styles.text2}>prev video</Text>
                                </View>
                        }
                        {
                            isNextVideo ?
                                <TouchableOpacity onPress={() => playNextVideo()} style={{ borderColor: '0e84d2', borderRadius: 10, borderWidth: 1, width: 150, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.text2}>next video</Text>
                                </TouchableOpacity>
                                :
                                <View style={{ borderColor: '0e84d2', borderRadius: 10, borderWidth: 1, width: 150, height: 40, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                                    <Text style={styles.text2}>next video</Text>
                                </View>
                        }
                    </View>

                </View>

            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    FlatListStyle: {
        backgroundColor:'white'
    },
    ListViewContainer: {
    //     borderRadius: 15,
    //     height: 200,
    //    // backgroundColor: '#D3D3D3',
    //     marginVertical: 10,
    //     marginRight:15,
        margin:5
    },
    text1 :{
        fontFamily :'Roboto',
        fontSize : 18,
        color : colors.BLACK,
    },
    text2 :{
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
    },
    text3 :{
        fontFamily :'Roboto',
        fontSize : 18,
        color : colors.BLACK,
    },
    box2: {
        //opacity: 0.9,
        marginVertical: 120,
        backgroundColor: 'white',
        borderRadius: 20,
        flex :1,
        padding :10,
        justifyContent:'center',
      },
})

export default HistorySessionFamily