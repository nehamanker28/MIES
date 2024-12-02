import React, { useEffect , useState} from 'react'
import {View, StyleSheet, Image, Text, ScrollView, TouchableOpacity} from 'react-native'
import emoji from '../../assets/images/emoji/png'
import Modal from 'react-native-modal';



const Emoji = ({ isOpen, selectMethod, closeEmojiMethod }) => {
    const [isEmojiModel, setIsEmojiModel] = useState(isOpen);

    const showModel = () => {
        //console.log('inside -------->>>',isEmojiModel)
        if(isEmojiModel) {
            setIsEmojiModel(false)
            closeEmojiMethod()
        }else {
            setIsEmojiModel(true)
        }
    }

    const selectEmoji = (i) => {
        selectMethod(i)
        setIsEmojiModel(false)
    }

    return (
        <Modal isVisible={isEmojiModel}
            onBackdropPress={() => showModel()}
            style={styles.emojiBox}>
            <View style={{ flex: 1, backgroundColor: 'white', height: 200, padding:10}}>
                <ScrollView style={{flex:1}}>
                    <View style={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
                    {
                        Object.keys(emoji).map(i => 
                        <TouchableOpacity key={i} style={{backgroundColor:'white',  width: 30, height: 30, justifyContent:'center', alignItems:'center', margin:4.5}} onPress={ () => selectEmoji(i)}>
                            <Image source={emoji[i]} style={{ width: 30, height: 30, resizeMode: 'contain'}}></Image>
                        </TouchableOpacity>
                        )
                    }
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

    emojiBox: {
        borderRadius: 20,
        flex :1,
        paddingHorizontal :30,
        paddingVertical:150
      },
})

export default Emoji
