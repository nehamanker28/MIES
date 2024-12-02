import React, {Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Alert,
    Image,
    TouchableHighlight,
    PermissionsAndroid,
  } from 'react-native';

//import CardView from 'react-native-cardview';
import string from '../../Common/String';
import colors from '../../Common/Colors';
import GreenButton from '../../components/GreenButton';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../components/context';
const { signOut } = AuthContext;

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
          isButtonClicked: false,
          isfirstNameEmpty: false,
          isphoneNumberEmpty: false,
          isemailIdEmpty: false,
          isphoneNoEmpty: false,
          isemailAddressEmpty: false,
          isPasswordEmpty: false,
          isReenterPasswordEmpty :false,
          isLoader: false,
          firstNameValue: '',
          lastNameValue: '',
          phoneNumberValue: '',
          emailIdValue: '',
          passwordValue :'',
          reenterPasswordValue :'',
        //   emailErrorMsg_1: string.email_is_required,
        //   phoneErrorMsg_1: string.phone_number_is_required,
     
        }
      }
      onEnterText = (firstNameValue) => {
        if (firstNameValue.trim() != 0) {
          this.setState({ firstNameValue: firstNameValue, isfirstNameEmpty: false });
          //console.log(firstNameValue)
        } else {
          this.setState({ firstNameValue: firstNameValue, isfirstNameEmpty: true });
        }
      }
     
    
      onEnterPhoneNumber = (phoneNumberValue) => {
        var formatNum = phoneNumberValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    
        if (phoneNumberValue.trim() != 0) {
          this.setState({ phoneNumberValue: formatNum, isphoneNumberEmpty: false });
        } else {
          this.setState({ phoneNumberValue: formatNum, isphoneNumberEmpty: true });
        }
      }
      onEnterEmailID = (emailIdValue) => {
       // var formatNum = phoneNumberValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    
        if (emailIdValue.trim() != 0) {
          this.setState({ emailIdValue: formatNum, isemailAddressEmpty: false });
        } else {
          this.setState({ emailIdValue: formatNum, isemailAddressEmpty: true });
        }
      }
      onEnterPassword = (passwordValue) => {
    
        if (passwordValue.trim() != 0) {
          this.setState({ passwordValue: passwordValue, isPasswordEmpty: false });
        } else {
          this.setState({ passwordValue: passwordValue, isPasswordEmpty: true });
        }
      }
      onEnterReenterPassword = (reenterPasswordValue) => {
    
        if (reenterPasswordValue.trim() != 0) {
          this.setState({ reenterPasswordValue: reenterPasswordValue, isReenterPasswordEmpty: false });
        } else {
          this.setState({ reenterPasswordValue: reenterPasswordValue, isReenterPasswordEmpty: true });
        }
      }
      doSignUp = () => {
        //console.log('SignUp')
    }
    render() {
        // try{
        //   const { navigate } = this.props.navigation;  
    return (
     <SafeAreaView style={styles.container}>
   
     <ScrollView keyboardShouldPersistTaps="handled" style = {{marginBottom:10}}>
     <Image
                source={require('../../../assets/images/SignUpbackground.png')}
                style={styles.image} />
                <View
                  style={{ marginTop: -100, backgroundColor: colors.WHITE}}
                  cardElevation={5}
                  cardMaxElevation={5}
                  cornerRadius={40}>
                  <Text style={styles.title}>{string.create_account}</Text>
                  <View style={styles.personal_info_view}>

                    <View style={styles.rowStyle}>
                      <Text style={styles.textStyle}>Full Name</Text>
                      <Text style={styles.astric}>{string.astric}</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      //set the value in state.
                      onChangeText={firstNameValue => this.onEnterText(firstNameValue)}
                      // value={this.state.firstNameValue}
                      underlineColorAndroid={colors.TRANSPARENT}
                      placeholder={string.enter_first_name}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        this._last_name_input && this._last_name_input.focus()
                      }
                      blurOnSubmit={false}
                    />
                    
                    {this.state.isfirstNameEmpty ?
                      <Text style={styles.required_view}>{string.first_name_required}</Text> : null
                    }
                    <View style={styles.rowStyle}>
                      <Text style={styles.textStyle}>Mobile</Text>
                      <Text style={styles.astric}>{string.astric}</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={12}
                      onChangeText={phoneNumberValue => this.onEnterPhoneNumber(phoneNumberValue)}
                      underlineColorAndroid={colors.TRANSPARENT}
                      value={this.state.phoneNumberValue}
                      placeholder={string.phone_nu_place}
                      ref={ref => {
                        this._phone_no_input = ref;
                      }}
                      returnKeyType="next"
                      onSubmitEditing={() => this._email_input && this._email_input.focus()}
                      blurOnSubmit={false} />
                    
                    {this.state.isfirstNameEmpty ?
                      <Text style={styles.required_view}>{string.first_name_required}</Text> : null
                    }
                    <View style={styles.rowStyle}>
                      <Text style={styles.textStyle}>Email Address</Text>
                      <Text style={styles.astric}>{string.astric}</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      //set the value in state.
                      onChangeText={firstNameValue => this.onEnterText(firstNameValue)}
                      // value={this.state.firstNameValue}
                      underlineColorAndroid={colors.TRANSPARENT}
                      placeholder={string.enter_first_name}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        this._last_name_input && this._last_name_input.focus()
                      }
                      blurOnSubmit={false}
                    />
                    
                    {this.state.isfirstNameEmpty ?
                      <Text style={styles.required_view}>{string.first_name_required}</Text> : null
                    }
                    <View style={styles.rowStyle}>
                      <Text style={styles.textStyle}>Password</Text>
                      <Text style={styles.astric}>{string.astric}</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      //set the value in state.
                      onChangeText={firstNameValue => this.onEnterText(firstNameValue)}
                      // value={this.state.firstNameValue}
                      underlineColorAndroid={colors.TRANSPARENT}
                      placeholder={string.enter_first_name}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        this._last_name_input && this._last_name_input.focus()
                      }
                      blurOnSubmit={false}
                    />
                    
                    {this.state.isfirstNameEmpty ?
                      <Text style={styles.required_view}>{string.first_name_required}</Text> : null
                    }
                    <View style={styles.rowStyle}>
                      <Text style={styles.textStyle}>Re-enter Password</Text>
                      <Text style={styles.astric}>{string.astric}</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      //set the value in state.
                      onChangeText={firstNameValue => this.onEnterText(firstNameValue)}
                      // value={this.state.firstNameValue}
                      underlineColorAndroid={colors.TRANSPARENT}
                      placeholder={string.enter_first_name}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        this._last_name_input && this._last_name_input.focus()
                      }
                      blurOnSubmit={false}
                    />
                    
                    {this.state.isfirstNameEmpty ?
                      <Text style={styles.required_view}>{string.first_name_required}</Text> : null
                    }

                   


                    {/* <View style={styles.rowStyle}>
                      <Text style={styles.textStyle}>{string.gender}</Text>
                      <Text style={styles.astric}>{string.astric}</Text>
                    </View> */}

                   


                    
                 
                 </View>
                
                 <TouchableOpacity style = {{marginTop : 40,marginLeft : 0}} 
                 onPress={() => signOut()}>
                  <LinearGradient colors={[ '#0fd683', '#10c177']} style={styles.linearGradient, styles.SubmitbuttonStyle}>
                  <Text style={styles.buttonText}>SignUp</Text>
                  </LinearGradient>
                  </TouchableOpacity> 
                
                <View style={styles.registerView}>
              <Text
                style={styles.no_account_view}>
                I'm already Member
              </Text>
              <Text style={styles.sign_up_view}
                onPress={() => props.navigation.navigate('SplashSignUp')}>
                Log In
              </Text>

            </View>
            </View>
     </ScrollView>
    </SafeAreaView>
)}
}
const styles = StyleSheet.create({
    container: {
       
        backgroundColor: colors.TEXTBOX_BLUE,
       
      },
      image: {
        width: '100%',
        height: 279,
        resizeMode: 'contain',
        marginTop: 50,
        // marginLeft: 47,
        //marginBottom: 17,
      },
    header: {
      color: colors.BLACK,
      textAlign: 'left',
      marginTop: 10,
      fontSize: 28,
      //fontFamily: 'Oswald-SemiBold',
      opacity: Platform.OS === 'ios' ? 0 : 100,
    },
    SubmitbuttonStyle:{
      borderRadius:10,
      paddingVertical:15,
      paddingHorizontal:20,
      height:50,
      width :315,
      marginLeft :50
  },
  buttonText: {
      fontFamily: 'Roboto-Medium',
      fontWeight:'bold',
      color:'white',
      fontSize:16,
      textAlign:"center",
      
  },
    registerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom:40,
      },
      no_account_view: {
        color: colors.DARK_BLACK,
        fontSize: 16,
        marginEnd: 5,
       // fontFamily: 'OpenSans-SemiBold'
      },
      sign_up_view: {
        textDecorationColor: colors.GERRN_ONPRESS,
        textDecorationLine: 'underline',
        color: colors.TEXT_BLUE,
        fontSize: 16,
        //fontFamily: 'OpenSans-SemiBold'
      },
   
    profile_style: {
      width: 110,
      height: 110,
      borderRadius: 110 / 2,
      borderColor: colors.BOTTLE_GREEN,
      borderWidth: 3,
      marginTop: 15
    },
    edit_view: {
      backgroundColor: colors.LIGHT_YELLOW,
      height: 40, width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -30,
      marginStart: 10
      // flex:1
    },
   
    title: {
      fontWeight: 'bold',
      // color: '#3d4041',
      color: colors.DARK_BLACK,
      fontSize: 30,
      marginTop: 50,
      textAlign: 'center',
    //   marginStart :100,
    //   marginEnd:100,
      fontFamily: 'Roboto-Bold'
    },
    personal_info_view: {
      marginStart: 20,
      marginEnd: 20,
      marginTop: 15,
      marginBottom: 0
    },
    rowStyle: {
      flexDirection: 'row',
      marginTop: 15,
      marginBottom: Platform.OS === 'ios' ? 10 : 0,
    },
    textStyle: {
      // textAlign: 'auto',
      // fontFamily: 'OpenSans-Regular',
      //color: '#3d4041',
      color: colors.GREY,
      fontSize: 13,
      fontFamily: 'Roboto-Regular',
      marginLeft :30
  
    },
    required_view: {
      // fontFamily: 'OpenSans-Regular',
      //fontFamily: 'OpenSans-SemiBold',
      color: colors.ASTRIC_RED,
      fontSize: 12,
      marginTop: 5
    },
    astric: {
      marginStart: 2,
      color: colors.ASTRIC_RED,
      fontSize: 16,
      //fontFamily: 'OpenSans-SemiBold',
      // fontFamily: 'OpenSans-Regular',
      //  fontWeight: 'bold'
    },
    input: {
      width: 320,
      fontSize: 16,
      height :40,
      marginLeft :30,
      backgroundColor :colors.TEXTBOX_BLUE,
     // fontFamily: 'OpenSans-SemiBold',
      // fontFamily: 'OpenSans-Regular',
      color: colors.DARK_BLACK,
      borderRadius :5,
      // multiline: true,
      // numberOfLines : 4.
      // borderBottomWidth: 1,
      // borderBottomColor: colors.BOTTOM_LINE,
    },
    elder_style: {
      //fontWeight: 'bold',
      //color: '#3d4041',
      color: colors.DARK_BLACK,
      fontSize: 16,
      marginEnd: 5,
      //fontFamily: 'OpenSans-SemiBold'
    },
    create_ac: {
      textDecorationColor: colors.GERRN_ONPRESS,
      textDecorationLine: 'underline',
      // fontWeight: 'bold',
      color: colors.GERRN_ONPRESS,
      fontSize: 16,
      //fontFamily: 'OpenSans-Bold'
    },
    line: {
      width: '100%',
      height: 1.5,
      backgroundColor: colors.LIGHT_GREY,
      marginBottom :10
    },
    button_view: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      // borderWidth: 1,
      // borderColor: '#041317',
      backgroundColor: colors.GERRN_ONPRESS,
      borderRadius: 10,
      alignItems: 'center',
      marginStart: 60,
      marginEnd: 60,
      flex: 1,
      justifyContent: 'center',
      marginTop: 70,
      marginBottom: 50,
      
    },
    nextStyle: {
      color: colors.WHITE,
      fontSize: 18,
      //fontFamily: 'OpenSans-Bold'
       fontWeight: 'bold',
    },
   
    skipStyle: {
      justifyContent: 'center',
      textAlign: 'right',
      //fontFamily: 'OpenSans-Semibold',
      color: colors.ASTRIC_RED,
      textDecorationLine: 'underline',
      fontSize: 16,
      marginTop: 15
    }
})

