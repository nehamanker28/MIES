import React, {useState, useEffect} from 'react'
import { View, Text, ScrollView, SafeAreaView, FlatList, StyleSheet , Image} from 'react-native'
import {useIsFocused} from '@react-navigation/native';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import {getApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BillingInfoTherapist = () => {

    const isFocused = useIsFocused();

    const [data, setData] = useState({
        sessions: [],
        isLoading: false,
    })

    const [billing, setBilling] = useState({
        paymentDone:0,   // Recieved
        paymentPending:0, // Pending
        pendingSubmissionToFederalOffice:null
      })

    useEffect(() => {

        if(isFocused){
            getBillingDetails()
            getBilling()
        }

        return () => {
        };
    }, [isFocused]);


      const getBillingDetails = () => {

        let sTime = moment(Date()).utc().format('YYYY-MM-DD'+'T'+'HH:mm:ss')
    
        setData({
            ...data,
            isLoading:true
        })
        getApiHelper(
          ServiceUrl.base_url_91 + ServiceUrl.getTherapistBillings + '?sort=session.startDateTime,DESC',
          'GET',
        ).then((response) => {
          if (response.code >= 200 && response.code <= 299) {
              setData({
                sessions:response.data.content,
                isLoading:false
              })
          } else {
            if (result.code != 403 || result.code != 401 ) {
              ShowAlert(response.message);
            }
          }
        });
      }; 

      const getBilling = () => {

        setData({
            ...data,
            isLoading:true
        })
    
        getApiHelper(
          ServiceUrl.base_url_91 + ServiceUrl.getBillingDetails,
          'GET',
        ).then((response) => {
          if (response.code >= 200 && response.code <= 299) {
              setBilling({
                paymentDone: response.data.paymentDone != null ? response.data.paymentDone : 0 ,
                paymentPending:response.data.paymentPending != null ? response.data.paymentPending : 0,
                pendingSubmissionToFederalOffice:response.data.pendingSubmissionToFederalOffice
              })
              setData({
                ...data,
                isLoading:false
            })
          } else {
            if (result.code != 403 || result.code != 401 ) {
              ShowAlert(response.message);
            }
          }
        });
      };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{}} onPress={() => {
            //navigation.push('TherapyDetail', {'therapy':item})
        }}>
            <View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <Text style={{fontFamily:'Roboto-Medium', fontSize:16}}>{moment(item.sessionDateTime).format('MMM DD, YYYY')}</Text>
                    </View>
                    <View style={{flex:0.5}}>
                        <Text style={{fontFamily:'Roboto-Medium', fontSize:16}}>{item.totalBilling}</Text>
                    </View>
                    {
                        item.billingStatus == 'PENDING_SUBMISSION' ? 
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:'#f69577', height:30, borderRadius:10}}>
                            <Image source={require('../../../assets/images/Fail.png')} style={{width:15,height:15, marginLeft:10}}></Image>
                            <Text style={{fontFamily:'Roboto-Light', fontSize:18, color:'white', marginHorizontal:10}}>Pending</Text>
                        </View>
                        :
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:'#0fd07f', height:30, borderRadius:10}}>
                            <Image source={require('../../../assets/images/successTick.png')} style={{width:15,height:15,marginLeft:10}}></Image>
                            <Text style={{fontFamily:'Roboto-Light', fontSize:18, color:'white', marginHorizontal:10}}>Paid</Text>
                        </View>
                    }
                </View>
                <View style={{flexDirection:'row', marginTop:5}}>
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 18 }}>{item.therapyDto.name}</Text>
                    {/* <View>
                        <Text style={{fontFamily:'Roboto-Light', fontSize:16, color:'#387af6', marginHorizontal:20}}>View More</Text>
                        <View style={{backgroundColor:'#387af6', height:1, width:77, marginLeft:20, marginTop:-2}}></View>
                    </View> */}
                </View>
                <View style={{height:1, backgroundColor:'gray', marginVertical:20}}></View>
            </View>
        </TouchableOpacity>  
    );

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor:'white',paddingHorizontal:20}}>
                <View style={{flexDirection:'row', paddingTop:20}}>
                    <View style={{flex:1}}>
                        <Text style={{fontFamily:'Roboto-Light', fontSize:14}}>Billing Till Date</Text>
                        <Text style={{fontFamily:'Roboto-Bold', fontSize:20}}>
                        {'$'+(billing.paymentDone + billing.paymentPending).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={{flex:0.7}}>
                        <Text style={{fontFamily:'Roboto-Light', fontSize:14}}>Received</Text>
                        <Text style={{fontFamily:'Roboto-Bold', fontSize:20}}>${billing.paymentDone.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                    </View>
                    <View>
                        <Text style={{fontFamily:'Roboto-Light', fontSize:14}}>Pending</Text>
                        <Text style={{fontFamily:'Roboto-Bold', fontSize:20}}>${billing.paymentPending.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                    </View>
                </View>
                <Text style={{fontFamily:'Roboto-Medium', fontSize:18, marginVertical:25}}>Payment Details and Billing Records</Text>
                <FlatList
                    style={styles.FlatListStyle}
                    data={data.sessions}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => 'index'+index}
                />
                {
                    data.isLoading ? ShowLoader() : null
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    ListViewContainer: {
        borderRadius: 15,
        justifyContent:'center'
    },
    FlatListStyle: {
        backgroundColor:'white'
    },
})

export default BillingInfoTherapist