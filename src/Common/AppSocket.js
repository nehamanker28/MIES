import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SockJsClient from 'react-stomp'
import AsyncStorage from '@react-native-async-storage/async-storage';

//import StompWS from 'react-native-st'
//import SockJsClient from "react-stomp";
//import { useDispatch, useSelector } from "react-redux";
// import WebStomp from "webstomp-client";
// import SockJs from "sockjs-client";
// import { useEventListner } from "../../hooks/eventHook";
// import agoraAction from "../../redux/actions/agoraAction";
import { ServiceUrl, AsyncStorageKey } from '../Common/String'

const AppSocket = React.forwardRef((props, fref) => {
    //   const user = useSelector((state) => state.adminUser.user);
    //   const tenantId = useSelector((state) => state.adminUser?.tenantInfo?.tenantId);
    //   const profile = useSelector((state) => state.adminUser.profile);
    // const mySocket = SockJs(SOCKET_URL);
    // const myClient = WebStomp.over(mySocket, { debug: true });
    const ref = useRef(null);
    const { familyMember, interpreter, therapist } = props.sessionDetail || {};
    const [state, setState] = useState({
        myId: null,
        tenantId: null,
        role: null
    })
    const receiverIds = [
        state.role !== "ROLE_FAMILY" && familyMember?.id && `ROLE_FAMILY-${familyMember?.id}`,
        state.role !== "ROLE_INTERPRETER" && interpreter?.userProfile?.id && `ROLE_INTERPRETER-${interpreter?.userProfile?.id}`,
        state.role !== "ROLE_THERAPIST" && therapist?.userProfile?.id && `ROLE_THERAPIST-${therapist?.userProfile?.id}`,
    ].filter((id) => id);

    useEffect(() => {
        try {
            (async () => {
                let tenantId = await AsyncStorage.getItem(AsyncStorageKey.tenantId)
                var userId = await AsyncStorage.getItem(AsyncStorageKey.userID)
                let role = await AsyncStorage.getItem(AsyncStorageKey.role)

                if (role == 'ROLE_FAMILY') {
                    userId = familyMember.id
                }
                setState({
                    ...state,
                    tenantId: tenantId,
                    myId: userId,
                    role: role
                })
            })();
        } catch (e) {
            console.log('aysnc storage err ------>>', e)
        }
    }, [])


    const sendTheEmoji = (content, uid, name) => {
        //console.log('sendTheEmoji --------->>>',content, uid, name)
        const msg = msgGenerator({
            topic: 'agoraEmoji', data: {
                uid: uid, content: content, sender: {
                    name: name
                }
            }
        })
        sendMsg(msg)
    }

    fref.current = sendTheEmoji



    //     useEffect(()=>{
    //     let myId;
    //   const { familyMember, interpreter, therapist } = props.sessionDetail || {};
    //     // alert(profile?.userType)
    //     if (profile?.userType === "ROLE_FAMILY") {
    //       myId = `${profile?.userType}-${familyMember?.id}`;
    //     } else if (profile?.userType === "ROLE_INTERPRETER") {
    //       myId = `${profile?.userType}-${interpreter?.userProfile?.id}`;
    //     } else {
    //       myId = `${profile?.userType}-${therapist?.userProfile?.id}`;
    //     }
    //     setState((state)=> ({...state, myId}))
    //   }, [profile?.userType, props.sessionDetail])

    //   const dispatch = useDispatch()
    //   const onMessageReceived = (msg) => {
    //     console.log({msg})
    //     switch (msg.topic) {
    //       case "userJoined":
    //         dispatch(agoraAction.userJoined({...msg.data, isLocal: false}))
    //         break;
    //       case "userLeave":
    //         dispatch(agoraAction.userLeave({...msg.data, isLocal: false}))
    //         break;
    //       case "screenShare":
    //         dispatch(agoraAction.screenShare(msg.data.uid, msg.data.isEnabled))
    //         break;
    //       case "agoraRecording":
    //         dispatch(agoraAction.setRecording(msg.data.isEnabled))
    //         break;
    //       default:
    //         break;
    //     }
    //   };



    const msgGenerator = ({ topic, data }) => {
        // console.log('receiver id---->>>',receiverIds)
        // console.log('tenant id---->>>',state.tenantId)
        return (
            JSON.stringify({
                receiverIds,
                data: JSON.stringify({
                    time: new Date(),
                    sender: state.role + '-' + state.myId,
                    topic,
                    data,
                }),
                tenantId: state.tenantId,
            })
        )
    }

    //   useEventListner("agorUserJoined", (user)=> {
    //     const msg = msgGenerator({topic: 'userJoined', data: user})
    //     // ref.current.sendMessage("/app/generic", JSON.stringify(msg));
    //         sendMsg(JSON.stringify(msg));
    //   })
    //   useEventListner("agoraUserLeave", (user)=> {
    //     const msg = msgGenerator({topic: 'userLeave', data: user})
    //     // ref.current.sendMessage("/app/generic", JSON.stringify(msg));
    //         sendMsg(JSON.stringify(msg));
    //   })
    //   useEventListner("agoraScreenShare", (data)=> {
    //     const msg = msgGenerator({topic: 'screenShare', data: data})
    //     // ref.current.sendMessage("/app/generic", JSON.stringify(msg));
    //         sendMsg(JSON.stringify(msg));
    //   })
    //   useEventListner("agoraRecording", (data)=> {
    //     const msg = msgGenerator({topic: 'agoraRecording', data: data})
    //     // ref.current.sendMessage("/app/generic", JSON.stringify(msg));
    //         sendMsg(JSON.stringify(msg));
    //   })

    const sendMsg = (msg) => {
        //console.log('sendmsg ---->>',msg)
        //console.log('ref.current?.client?.connected ---->>',ref.current?.client?.connected)
        if (ref.current?.client?.connected) {
            ref.current.sendMessage("/app/generic", msg);
        } else {
            console.log("__socket not connected", { msg })
        }
    }

    const onMessageReceived = (msg) => {
        //let receivedMsg = JSON.parse(msg)
        //console.log('received --------->>>',msg)
        props.receive(msg)
    }

    return (
        <View>
            {
                //console.log('role----->',state.role,state.myId,state.tenantId)
            }
            <SockJsClient
                ref={ref}
                url={ServiceUrl.SOCKET_URL}
                topics={[
                    `/topics/generic/${`${state.role}-${state.myId}`}/${state.tenantId}`,
                ]}
                onConnect={() => {
                    console.log("connected!")
                }}
                onDisconnect={(ee) => {
                    console.log("Disconnected!", ee)
                }}
                onMessage={(msg) => onMessageReceived(msg)}
            />
        </View>
    );
})


export  {AppSocket}