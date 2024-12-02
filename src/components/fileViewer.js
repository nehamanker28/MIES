import React from 'react'
import { Text, View,PermissionsAndroid } from 'react-native'
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import * as mime from 'react-native-mime-types';
import { ShowAlert } from '../Common/Helper';



export const openFile = async(file) =>{

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'MEIS App Media Permission',
      message: 'MEIS App needs access to your Storage',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    // Permission Granted
    proceed(file)
  } else {
    // Permission Denied
    alert('CAMERA Permission Denied');
  }
}
export const proceed = (file) => {
    console.log('filee',file)
    const ext = mime.extension(file.fileType)
    const localFile = `${RNFS.DownloadDirectoryPath}/`+ file.fileName + '.' +ext;
    console.log(localFile)
    const options = {
      fromUrl: file.key,
      toFile: localFile
    };
    RNFS.downloadFile(options).promise
    .then(() => FileViewer.open(localFile), { showOpenWithDialog: true ,showAppsSuggestions:true})
    .then(() => {
        // success
    })
    .catch(error => {
       console.log(error)
       //ShowAlert(error.MESSAGE)
       ShowAlert(' No app associated with this mime type')
    });
}

