import React, {useEffect, useState} from 'react';

//Import all required component
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import colors from '../../Common/Colors';
import {useIsFocused} from '@react-navigation/native';
import {ApiHelper, getApiHelper} from '../../Service/Fetch';
import string, {ServiceUrl, AsyncStorageKey} from '../../Common/String';
import {ShowAlert, ShowLoader} from '../../Common/Helper';
import { Image } from 'react-native-elements';
import Grid from 'react-native-grid-component';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import PDFView from 'react-native-view-pdf';
import { da } from 'date-fns/locale';
import {openFile} from '../../components/fileViewer';
import * as mime from 'react-native-mime-types';
import RNFetchBlob from 'rn-fetch-blob';

const QueriesArray = [
  {id: '1', image: require('../../../assets/images/sampleresources.png')},
  {id: '2', image: require('../../../assets/images/sampleresources.png')},
  {id: '3', image: require('../../../assets/images/sampleresources.png')},
  {id: '4', image: require('../../../assets/images/sampleresources.png')},
];

const MyResourcesFamily = ({navigation,route}) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState({
    isLoading: false,
    Note: [],
    Query: route.params.resources,
    ALL : [],
  });
  useEffect(() => {
    if (isFocused) {
      getResources();
    }
  }, []);
  const getResources = () => {
    setData({
      ...data,
      isLoading: true,
    });
    let dataURL = {'sessionId':route.params.sessionId,
    }
    getApiHelper(
      ServiceUrl.base_url_91 + ServiceUrl.getResources,
      'GET',
    ).then((response) => {
      ////console.log('Response', response.data);
      if (response.code >= 200 && response.code <= 299) {
        ///console.log('Query', response.data.resourceMap.NOTE);
        // if (!unmounted) {

        // }
        setData({
          ...data,
          isLoading: false,
          Note: response.data.resourceMap.NOTE + response.data.resourceMap.QUERY +  response.data.resourceMap.QUERY_REPLY,
         // Query :[...response.data.resourceMap.NOTE , ...response.data.resourceMap.QUERY , ...response.data.resourceMap.QUERY_REPLY],
        });

      } else {
        ShowAlert(response.message);
      }
    });
    //console.log('Queryefvfrvrvr', data.Note);
  };

  const renderItem1 = ({item}) => (
    <Text>{item.key}</Text>
 
  );
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
          //console.log('path',res)
           alert('File Downloaded Successfully.')
         
          }
      });
  };
 const Details = (item) =>{
   //console.log('data==',data)
  navigation.navigate('MyResourcesDetails',{time : route.params.time ,
     //Name : route.params.Name,
     image : data.key ,
     fileType :data.fileType})
    }

 
  const renderItem = (item , i) => (
    <View style={{flex:1,margin: 10}}>

{Platform.OS == 'ios' ? (
                  <TouchableOpacity onPress={() => downloadPdf(item)}>
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
                ) : (
                  <TouchableOpacity onPress={() => openFile(item)}>
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
                )}
    </View>
  );

  const ItemSeparatorView = () => {
    return (
      // FlatList Item Separator
      <View
        style={{
          height: 2,
          margin: 10,
          backgroundColor: '#d8e4f1',
        }}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollViewStyle}>
        {/* <Text style={styles.text1}>{route.params.time}</Text>
        <Text style={styles.text2}>Session With {route.params.Name}</Text> */}
        <View style={{padding: 0}}>
          {/* <FlatList
            style={styles.FlatListStyle}
            data={data.Note}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
          /> */}
          <Grid
            style={styles.list}
            renderItem={renderItem}
            //renderPlaceholder={this.dorenderPlaceholder}
            data={data.Query}
            // define number of columns on grid
            numColumns={2}
            keyExtractor={(item) => item.id}
           // ItemSeparatorComponent={ItemSeparatorView}
           // refreshing={this.state.refreshing}
            // do actions on refresh
            // onRefresh={() => {
            //   this.setState({
            //     data: addColorOnGrid(COLOR_COUNT),
            //     refreshing: false,
            //   });
            // }}
          />
          {/* //  <Text>My Resources</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    flex: 2,
    },
  FlatListStyle: {
    backgroundColor: 'white',
  },
  ListViewContainer: {
    borderRadius: 15,
    height: 200,
    // backgroundColor: '#D3D3D3',
    // marginVertical: 10,
    marginRight: 15,
    height: 1500,
  },
  text1: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 20,
  },
  text2: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 10,
    marginBottom: 10,
  },
  text3: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.GREY,
    marginTop: 10,
  },
  scrollViewStyle: {
    backgroundColor: 'white',
    flex: 1,
    padding :30,
    //flexGrow :0.05,
  },
  box2: {
    opacity: 0.9,
    marginVertical: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    //marginBottom:40,
    //right:90
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
}
});
export default MyResourcesFamily;
