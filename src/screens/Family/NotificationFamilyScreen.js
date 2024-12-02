import React, {useEffect, useState} from 'react';
import {getApiHelper, getApi, ApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Image} from 'react-native-elements';

//Import all required component
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import colors from '../../Common/Colors';
import {useIsFocused} from '@react-navigation/native';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import {da} from 'date-fns/locale';

const NotificationFamilyScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState({
    notification: [],
    isLoading: false,
    userID: '',
  });
  let unmounted = false;

  const ItemSeparatorView = (item) => {
    return (
      // FlatList Item Separator
      item.header ? (
        <View></View>
      ) : (
        <View
          style={{
            height: 2,
            margin: 10,
            backgroundColor: '#d8e4f1',
          }}
        />
      )
    );
  };

  useEffect(() => {
    getNotificationList();
    return () => {};
  }, []);

  const onPressAccept = (item) => {
    //console.log('Accept');
  };
  const onPressCancel = (item) => {
    //console.log('cancel');
  };
  const getNotificationList = () => {
    setData({
      ...data,
      isLoading: true,
    });
    // AsyncStorage.getItem(AsyncStorageKey.userID, (err, value) => {
    //console.log(route.params.userID); // boolean false
    //console.log('UserID :', data.userID);
    getApi(
      ServiceUrl.base_notification + ServiceUrl.getNotificatioListforFamily + route.params.userID,'GET',
    ).then((response) => {
      if (response.code >= 200 && response.code <= 299) {
        //console.log('Response====>', response);
        if (!unmounted) {
          setData({
            ...data,
            notification: response.data,
            isLoading: false,
          });
          //console.log('Data ==>', data);

          // setUserProfile(response.data.userProfile)
          //storeData(response.data.userProfile)
        }
      } else {
        
        ShowAlert(response.message);
      }
    });
    // })
  };
  const convertTime = (item) => {
    let time;
    // let sessionStartDate = moment.utc(item);
    // let sTime = moment(sessionStartDate).format('DD MMMM YYYY , hh:mm a');
    // return sTime;
    let sessionEndDate = moment.utc(item).local();
    if (Platform.OS === 'android') {
      time = moment(sessionEndDate).format('DD MMMM YYYY , hh:mm a');
    } else {
      if (Platform.Version <= 14) {
        time = moment(sessionEndDate).format('DD MMMM YYYY , hh:mm a');
      } else {
        time = moment(sessionEndDate).format('DD MMMM YYYY , hh:mm a');
      }
    }
    return time;
  };

  const renderItem = ({item}) => (
    //  item.header ? <Text style = {{ fontFamily :'Roboto',fontSize : 18,color : '#414141',padding :20}}>{item.name}</Text> :
    <View style = {{margin:0}}>
      <Text
        style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 14,
          color: colors.BLACK,
          marginBottom: 10,
        }}>
        {convertTime(item.notificationDateTime)}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View style = {{flex:0.5}}>
            <Image
          source={{uri: item.icon}}
          style={{width: 50, height: 50, borderRadius: 40}}></Image>  
          </View>
        <View style={{paddingHorizontal: 8,justifyContent:'center',flex:2}}>
          {item.notificationType == 'Therapy Session for family' ? (
            <View>
              <Text style={styles.text2}>
                {item.body}
              </Text>
            </View>
          )
           :
           (item.notificationType == 'Session created for Family by Therapist') ||  (item.notificationType == 'Session created for Family') ?
           <View>
              <Text style={styles.text2}>
                {item.body}
              </Text>
              <View style = {{flexDirection : 'row',flex :1,marginTop:10}}>
              <Text style = {styles.text2}>Time :</Text>
              <Text style = {styles.text4}>{convertTime(item.startDateTime)}</Text>
              </View>
            </View>
           :
            (
            <View>
              <Text style={styles.text2}>{item.body}</Text>
              <View style={{flexDirection: 'row', flex: 1}}></View>
            </View>
          )}
        
          {item.clickable ? (
            <View style={{flexDirection: 'row', marginTop: 10, flex: 1}}>
              <TouchableOpacity
                style={styles.AcceptButton}
                onPress={() => onPressAccept(item)}>
                <Text
                  style={{
                    color: '#191919',
                    fontSize: 16,
                    fontFamily: 'Roboto-Bold',
                    margin: 10,
                  }}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onPressCancel(item)}>
                <Image
                  source={require('../../../assets/images/close.png')}
                  style={{width: 10, height: 10}}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View></View>
          )}
        </View>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: '#d8e4f1',
          marginTop: 30,
          marginBottom: 30,
        }}></View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
        <View style={{padding: 20}}>
          {data.notification == null ? (
            <Text> No Notification </Text>
          ) : (
            <View>
            <FlatList
              //horizontal={true}
              style={styles.FlatListStyle}
              data={data.notification}
              renderItem={renderItem}
              keyExtractor={(item, index) => 'index' + index}
            />
            </View>
          )}
        </View>
        {data.isLoading ? ShowLoader() : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  text1: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.BLACK,
    margin: 10,
  },
  text2: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: colors.BLACK,
    marginTop: 0,
    paddingHorizontal: 0,
    //backgroundColor:colors.GREEN,
    
  },
  text3: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.BLACK,
    marginTop: 5,
    padding: 5,
  },
  text4:{
   
      fontFamily :'Roboto',
      fontSize : 14,
      color : colors.BLACK,
      //marginTop :5,
      //padding :5,
     

  },
  FlatListStyle: {
   // flex:1,
    backgroundColor: 'white',
  },
  closeButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    borderColor: '#e2e2e2',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
    marginStart: 20,
  },
  AcceptButton: {
    backgroundColor: '#ffd629',
    borderRadius: 6,
    borderColor: '#e2e2e2',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default NotificationFamilyScreen;
