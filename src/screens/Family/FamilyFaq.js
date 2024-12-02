import React, {useState, useEffect } from 'react';
import colors from "../../Common/Colors";
import SearchBar from 'react-native-search-bar';
import chevron from '../../../assets/images/arrow.png';
import { useIsFocused } from "@react-navigation/native";
import {getApiHelper} from '../../Service/Fetch'
import  {ServiceUrl} from '../../Common/String';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,

    Image
} from 'react-native';
import { tr } from 'date-fns/locale';
import {ExpandableListView} from 'react-native-expandable-listview';

const Item = ({ item, onPress, style ,answerBool,image}) => (
    <TouchableOpacity onPress={onPress}>
      <View style  = {{flex :1,justifyContent :'center'}}>
          <View style = {{flexDirection :'row',justifyContent :'space-between',paddingVertical :20}}>
          <View style = {{flexDirection :'row'}}>
                {/* <View style = {{backgroundColor:colors.TEXT_BLUE,borderRadius:20,paddingHorizontal :5,marginVertical :7}}/> */}
                <View style = {{backgroundColor:'#387af6',borderRadius:20,width :15,height :15}}/>
                <Text style = {{ fontFamily :'Roboto-regular',fontSize : 16,marginStart :20,marginVertical :0,color : style}}>
                 {item.Question}
                </Text>
          </View>
     
            <TouchableOpacity>
                <Image source={image} style = {{width :12,height:12 ,tintColor : style}}/>      
            </TouchableOpacity>
          </View>
          </View>
          {answerBool ?
          <Text style = {{ fontFamily :'Roboto-regular',fontSize : 16,marginStart :20,marginVertical :10}}>
                 {item.Answer}
                </Text>
          
                :<View></View>
          }
    </TouchableOpacity>
  );

 

 
const FamilyFaq = () => {
  
  
    const [selectedId, setSelectedId] = useState(null);
    const [FaqContent ,setFaqContent] = useState([]);
    const [noData,setNoData] = useState(Boolean);
    let unmounted = false;
    const isFocused = useIsFocused();
     
    const updateSearch = (val) => {       
    let text = val.toLowerCase()
    let trucks = FaqContent
    let filteredName = trucks.filter((item) => {
      return item.categoryName.toLowerCase().match(text)
    })
    //console.log('Print Filer',filteredName)
    if (!text || text === '') {
        getFamilyFaq()
        setFaqContent(FaqContent)
    } 
    else if (!filteredName.length) {
      // set no data flag to true so as to render flatlist conditionally
      setNoData(true)
      //console.log('nosdfsfsdfsdf ===',noData)

    } else if (Array.isArray(filteredName)) {
      setNoData(false)
      setFaqContent(filteredName)
      //console.log('nodataFalse ===',noData)
    }
    };
    const onPressSearch = (val) => {
        //console.log('onPress',val)
    };
    
    const onPressCancel = () => {
        //console.log('onCancel')
        getFamilyFaq()
    }; 
    const renderItem = ({ item }) => {
        const Bool = item.id === selectedId ?  true : false;
        const color = item.id === selectedId ? colors.TEXT_BLUE : colors.BLACK
        const imgUrl =  item.id === selectedId ? require('../../../assets/images/upsideDownArrow.png') : require('../../../assets/images/arrow.png') 
       //console.log(Bool)
        return (
          <Item
            item={item}
            onPress={() => setSelectedId(item.id)}
            answerBool =  {Bool}
            style = {color}
            image = {imgUrl}
          />
        );
      };
      const getFamilyFaq = () => {
        
        getApiHelper(ServiceUrl.base_url_91 + ServiceUrl.getFamilyFaq, 'GET')
            .then(response => {
                if (response.code >= 200 && response.code <= 299) {
                    
                    if (!unmounted) {
                        setFaqContent(response.data.content)  
                    }
                } else {
                    ShowAlert(response.message)
                }
            })
    }
    useEffect(() => {
        if (isFocused) {
            getFamilyFaq()
        }
        
        return () => {
            unmounted = true
        }
    }, [isFocused])
    
    return (
        (
            <ScrollView style={styles.container}>
                <View style={{ borderRadius: 10 }}>
                    <SearchBar
                        style={{ backgroundColor: 'white' }}
                        textColor={colors.BLACK}
                        hideBackground={true}
                        barTintColor={colors.TEXT_BLUE}
                        placeholder="Search"
                        onChangeText={(val) => updateSearch(val)}
                        onSearchButtonPress={(val) => onPressSearch(val)}
                        onCancelButtonPress={() => onPressCancel()}
                        barTintColor={{backgroundColor:'white'}}
                    />
                    {noData ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text> No Data </Text>
                        </View>
                        :
                        <ExpandableListView
                            data={FaqContent} // required
                            customChevron={chevron}
                            //chevronColor= {colors.TEXT_BLUE}
                            innerItemLabelStyle={{ fontSize: 20, color: colors.BLACK }}
                            itemLabelStyle={{ color: colors.BLUE }}
                            itemContainerStyle={{ backgroundColor: colors.TRANSPARENT }}
                            itemImageIndicatorStyle={{ tintColor: colors.TEXT_BLUE }}

                        />}
                </View>
            </ScrollView>

        )
   );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin :20
        //backgroundColor: '#eaf1fe',
    },
})
export default FamilyFaq