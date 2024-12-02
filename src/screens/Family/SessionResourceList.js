import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TouchableWithoutFeedback,
} from 'react-native';
import colors from "../../Common/Colors";
import string, { ServiceUrl, AsyncStorageKey } from '../../Common/String';
import { useIsFocused } from "@react-navigation/native";
import moment from 'moment'
import { LogBox } from 'react-native'
import { getApiHelper } from '../../Service/Fetch'
import FloatingButton from '../../components/FloatingButton'
import { ShowAlert, ShowLoader } from '../../Common/Helper'
import Moment from 'moment';

import GreenButton from '../../components/GreenButton'
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreAllLogs()



const SessionResourceList = ({navigation}) => {
    const isFocused = useIsFocused();
    const today = new Date()
    const [date, setdateValue] = useState([])
    const [data, setData] = useState({
        isLoading: false,
        sessions:[],
        dateResources:[],
    })
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
     
   
    
       const actionOnRow = (item) => {
          // let Name = item.therapist.userProfile.firstName + item.therapist.userProfile.lastName
           console.log(data.dateResources[item])
            navigation.navigate('MyResources',{resources : data.dateResources[item]})
        }
      const renderItem = ({item,index}) => (
        
                <TouchableWithoutFeedback onPress={ () => actionOnRow(index)} >
                <View style={styles.ListViewContainer}>
                <View>
                <Text style={styles.text1}>{ moment(item).format('MMMM DD, YYYY') }</Text>
                  
                </View>
                    {/* <View style = {{backgroundColor:colors.CHARCOAL_GRAY,width : 60,height :1,marginTop :10,marginStart :10}}></View> */}
                    <TouchableOpacity>
                    <Image source={require('../../../assets/images/arrow.png')} style = {{tintColor : colors.BLUE,marginTop:15}}></Image>            
                    </TouchableOpacity>
                </View>  
                
                </TouchableWithoutFeedback>
        
        
      );
 
    const getResources = () => {
        setData({
          ...data,
          isLoading: true,
        });
       // let dataURL = {'sessionId':route.params.sessionId,
       var arr = []
        getApiHelper(
          ServiceUrl.base_url_91 + ServiceUrl.getResources,
          'GET',
        ).then((response) => {
         
          if (response.code >= 200 && response.code <= 299) {
            setdateValue((Object.keys(response.data.dateMap)).sort((a,b) => new Moment(b).format('YYYYMMDD') - new Moment(a).format('YYYYMMDD')))
            //console.log('sort =',sortedArray)
            setData({
                ...data,
                isLoading: false,
                dateResources :  Object.values(response.data.dateMap)
              });
           
          } else {
            ShowAlert(response.message);
          }
        });

      };
    
    useEffect(() => {
    if (isFocused) {
        getResources()
    }
    
    return () => {
        
    }
    }, [isFocused])
  
    return (
        <SafeAreaView style={styles.container}>
        <View>
        <FlatList
                        //horizontal={true}
                        style={styles.FlatListStyle}
                        data = {date}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => 'index'+index}
                        ItemSeparatorComponent = {ItemSeparatorView}
                    />  
                     
          
                {/* <Text>History</Text> */}
           </View>
           {
                    data.isLoading ? ShowLoader() : null
            }
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
       flexDirection :'row',
       marginTop:20,
       marginBottom:20,
       justifyContent :'space-between',
        margin:30
    },
    text1 :{
        fontFamily :'Roboto-Medium',
        fontSize : 20,
        color : colors.BLACK,
        marginTop:5,
        marginStart:5
    },
    text2 :{
        fontFamily :'Roboto-Bold',
        fontSize : 18,
        color : colors.BLACK,
        marginTop:10
    },
    text3 :{
        fontFamily :'Roboto',
        fontSize : 20,
        color : colors.BLACK,
        marginTop :20
    },
})

export default SessionResourceList