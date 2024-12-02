//Import React and Hooks we needed
import { bg } from 'date-fns/locale';
import React, { Component} from 'react';

//Import all required component
import { View, StyleSheet, Image,ImageBackground } from 'react-native';
import colors from '../../Common/Colors';
import IntroScreen from './IntroScreen';
// import colors from "../common/colors";
var logo = require('../../../assets/images/Logo.png')

  export default class SplashScreen extends Component {
    constructor (props){
      super(props);
      setTimeout(()=>
      {
        this.props.navigation.navigate('IntroScreen');
      },1000);
    }
    render() {
      return (
          <ImageBackground
          backgroundColor = {colors.WHITE}
          style = {{height : '100%',width :'100%'}}
          >
          <View
          style = {{flex :1,justifyContent :'center',alignItems :'center'}}>
            <Image source = {logo}
            style = {{height :140 ,width:280}}>
            </Image>
          </View>

          </ImageBackground>
      );
    }
 
};


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : colors.WHITE,
    //paddingTop: ( Platform.OS === 'ios' ) ? 100 : 0
  },
  backgroundImage: {
   
   // alignItems: 'center',
     marginTop :300,
    width :'100%',
    height : '100%',
    //paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },

  logo: {
    width: 350,
    height: 500,
  },
});