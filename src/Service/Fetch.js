import react from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKey, ServiceUrl} from '../Common/String'
import NetInfo from "@react-native-community/netinfo";
import { ShowAlert } from '../Common/Helper';

export default class NetworkUtils {
    static async isNetworkAvailable() {
      const response = await NetInfo.fetch();
      return response.isConnected;
  }}

  const getWithOutAuthrization = async (url, method) => {
    console.log("url auth---->>>>", url)
    
   // console.log("method---->>>>", method)
    const isConnected = await NetworkUtils.isNetworkAvailable()
   // console.log("isConnected---->>>>", isConnected)
    if(isConnected == true){
   try {
       let response = await fetch(url, {  
           method: method,
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
               // 'X-TenantID' : 'meis-tenant-1',

           }
       }).then(res => res.json())
           .then((result) => {
                console.log('response ------->>>',result);
               return result;
           }, (error) => {
               console.log('error ------>>',error);
               error = error;
           })

           return response  
   } catch (error) {
       console.log('catch error ------>>',error);
   }
   }
   else
   {
        ShowAlert("No Internet Connection")
   }
}

const postApiHelper = async (url, data = {}, method) => {
     console.log("url auth---->>>>", url)
    // console.log("data---->>>>", data)
    // console.log("method---->>>>", method)
     const isConnected = await NetworkUtils.isNetworkAvailable()
    // console.log("isConnected---->>>>", isConnected)
     if(isConnected == true){
    try {

       const tenantId = await AsyncStorage.getItem(AsyncStorageKey.tenantId)
      
     // console.log(' tenant tenantId ----->>',tenantId)

        let response = await fetch(url, {  
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                 'X-TenantID' : tenantId
            },
            body:JSON.stringify(data)
        }).then(res => res.json())
            .then((result) => {
                 console.log('response ------->>>',result);
                return result;
            }, (error) => {
                console.log('error ------>>',error);
                error = error;
            })

            return response  
    } catch (error) {
        console.log('catch error ------>>',error);
    }
    }
    else
    {
         ShowAlert("No Internet Connection")
    }
}

const ApiHelper =  async (url, data, method) => {
       console.log("url---->>>>", url)
       console.log("data---->>>>", data)
     const isConnected = await NetworkUtils.isNetworkAvailable()
     //console.log("isConnected---->>>>", isConnected)
     if(isConnected == true){
    // console.log("method---->>>>", method)
    try {
        const accessToken = await AsyncStorage.getItem(AsyncStorageKey.accessToken)
        const sessionId = await AsyncStorage.getItem(AsyncStorageKey.sessionId)
        const tenantId = await AsyncStorage.getItem(AsyncStorageKey.tenantId)

        //console.log('access token ---->>', accessToken)
        //console.log('sessionId--- ---->>', sessionId)
        
        let response = await fetch(url, {  // Return promise
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+accessToken,
                'SessionId' : sessionId,
                'X-TenantID' : tenantId,
            },
             body:JSON.stringify(data)
           //body : data
        }).then(res => res.json())
            .then((result) => {
                console.log('res-->>',result);
                if (result.code == 403 || result.code == 401) {
                    LoginForRefresh()
                } else {
                    return result;
                }
                
            }, (error) => {
                    console.log('e--->>',error);
                error = error;
            })

            return response  
    } catch (error) {
        
    }
}
else {
    ShowAlert('No Internet Connection')
}

}
const FormApiHelper =  async (url, data, method) => {
    console.log("url---->>>>", url)
   console.log("data---->>>>", data)
  const isConnected = await NetworkUtils.isNetworkAvailable()
  //console.log("isConnected---->>>>", isConnected)
  if(isConnected == true){
  //console.log("method---->>>>", method)
 try {
     const accessToken = await AsyncStorage.getItem(AsyncStorageKey.accessToken)
     const sessionId = await AsyncStorage.getItem(AsyncStorageKey.sessionId)
     const tenantId = await AsyncStorage.getItem(AsyncStorageKey.tenantId)
     
     let response = await fetch(url, {  // Return promise
         method: method,
         body : data,
         headers: {
             Accept: 'application/json',
             'Content-Type': 'multipart/form-data',
             'Authorization': 'Bearer '+accessToken,
             'SessionId' : sessionId,
             'X-TenantID' : tenantId,
         },
          //body:JSON.stringify(data)
       
     }).then(res => res.json())
         .then((result) => {
            console.log('res-->>',result);
             if (result.code == 403 || result.code == 401) {
                 LoginForRefresh()
             } else {
                
                return result;
             }
             
         }, (error) => {
                 console.log('e--->>',error);
             error = error;
         })

         return response  
 } catch (error) {
     
 }
}
else {
 ShowAlert('No Internet Connection')
}

}
const getApi =  async (url, method) => {
    console.log("url get---->>>>", url)
   // console.log("method---->>>>", method)
   const isConnected = await NetworkUtils.isNetworkAvailable()
  // console.log("isConnected---->>>>", isConnected)
   if(isConnected == true){
   try {
       const accessToken = await AsyncStorage.getItem(AsyncStorageKey.accessToken)
       const sessionId = await AsyncStorage.getItem(AsyncStorageKey.sessionId)
       const tenantId = await AsyncStorage.getItem(AsyncStorageKey.tenantId)

    //    console.log('accessToken ----->>>', accessToken)
    //    console.log('sessionId ----->>>', sessionId)
       
       let response = await fetch(url, {  // Return promise
           method: method,
           headers: {
                 Accept: 'application/json',
               'Content-Type': 'application/json',
                'Authorization': 'Bearer '+accessToken,
            //    'SessionId' : sessionId
            'X-TenantID' : tenantId,
           }
       }).then(res => res.json())
           .then((result) => {
               if (result.code == 403) {
                   LoginForRefresh()
               }else {
                    //console.log('result --->>', result);
                    return result
               } 
           }, (error) => {
                console.log('e--->>', error);
               error = error;
           })

           return response  
   } catch (error) {
       
   }
}
else {
   ShowAlert('No Internet Connection')
}
}

const getApiHelper =  async (url, method) => {
     console.log("url get---->>>>", url)
    // console.log("method---->>>>", method)
    const isConnected = await NetworkUtils.isNetworkAvailable()
   // console.log("isConnected---->>>>", isConnected)
    if(isConnected == true){
    try {
        const accessToken = await AsyncStorage.getItem(AsyncStorageKey.accessToken)
        const sessionId = await AsyncStorage.getItem(AsyncStorageKey.sessionId)
        const tenantId = await AsyncStorage.getItem(AsyncStorageKey.tenantId)

        //console.log('accessToken ----->>>', accessToken)
        //console.log('sessionId ----->>>', sessionId)
        
        let response = await fetch(url, {  // Return promise
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+accessToken,
                'SessionId' : sessionId,
                'X-TenantID' : tenantId,
            }
        }).then(res => res.json())
            .then((result) => {
               // console.log('result --->>', result);
                if (result.code == 403 || result.code == 401) {
                    LoginForRefresh()
                }else {
                    //console.log('result --->>', result);
                    return result
                }
            }, (error) => {
                // console.log('e--->>', error);
                error = error;
            })

            return response  
    } catch (error) {
        
    }
}
else {
    ShowAlert('No Internet Connection')
}
}

const LoginForRefresh = async () => {
    //console.log('Login refresh api call ------>>');
        const email = await AsyncStorage.getItem(AsyncStorageKey.email)
        const password = await AsyncStorage.getItem(AsyncStorageKey.password)
        const tenantId = await AsyncStorage.getItem(AsyncStorageKey.tenantId)

        let data = { 'email': email, 'password': password }
        let url = ServiceUrl.base_url + ServiceUrl.loginUrl

    //console.log('data ------>>', data);
    console.log('url ------>>',url);
    const isConnected = await NetworkUtils.isNetworkAvailable()
    //console.log("isConnected---->>>>", isConnected)
    if (isConnected == true){
        try {
        let response = await fetch(url, {  
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-TenantID' : tenantId
            },
            body:JSON.stringify(data)
        }).then(res => res.json())
            .then((result) => {
                console.log('login refress res ------>>',result);
                storeData(result.data)
                
            }, (error) => {
               // console.log('refresh error ------>>',error);
                error = error;
            })

            return response  
        } catch (error) {
           // console.log('refresh catch error ------>>',error);
        }
    }
    else {
        ShowAlert('No Internet Connection')
    }
}

const storeData = async (data) => {
    // console.log('accessToken ------>>', data.accessToken);
    // console.log('sessionId ------>>', data.sessionId);
    // console.log('unique id ------>>',data.userDetails.userUniqueId);
        try {
            await AsyncStorage.setItem(AsyncStorageKey.accessToken, data.accessToken)
            await AsyncStorage.setItem(AsyncStorageKey.sessionId, data.sessionId)
            await AsyncStorage.setItem(AsyncStorageKey.userUniqueId, data.userDetails.userUniqueId)
        } catch (e) {
                // saving error
            console.log('storing error name --->>>')
        }
    }



export { getApiHelper,getApi, postApiHelper, ApiHelper, LoginForRefresh ,FormApiHelper, getWithOutAuthrization}