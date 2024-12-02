import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { addDays, format, getDate, isSameDay, startOfDay, getMonth} from 'date-fns'
import GestureRecognizer from 'react-native-swipe-gestures';
 


const WeekCalender = ({ date , onChange}) => {
    
    const [week, setWeek] = useState([])
    const [startDate, setStartDate] = useState(Date)
    const [selectedDate, setSelectedDate] = useState(date)
    //const [month, setMonth] = useState(0)


    let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    let noOfDays = 4
    
    useEffect(() => {
       const weekdays = getWeekDays(date)
        setWeek(weekdays)
        setSelectedDate(date)
       // setMonth(getMonth(date))
    }, [date])


    const getWeekDays = (date) => {
     
        const start = startOfDay(date) //startOfWeek(date, { weekStartsOn: 1 });
        setStartDate(start)

        const final = []
    
        for (let i = 0; i < noOfDays; i++){
            const dateObj = addDays(start, i)
            final.push({
                formatted: format(dateObj, 'EEE'),
                date:dateObj,
                day: getDate(dateObj),
                month: getMonth(dateObj)
            })
        }
        return final
    }
    
    const onSwipeLeft = (gestureState) => {
        moveLeft()
    }
 
    const onSwipeRight = (gestureState) => {
         moveRight()
    }

    const moveLeft = () => {
        console.log('left start----->>>', startDate)
        const date = addDays(startDate, noOfDays)
        const weekdays = getWeekDays(date)
       // setMonth(getMonth(date))
        setWeek(weekdays)
    }
 
    const moveRight = (gestureState) => {
         console.log('right start----->>>', startDate)
        const date = addDays(startDate, -noOfDays)
        const weekdays = getWeekDays(date)
        //setMonth(getMonth(date))
        setWeek(weekdays)
    }

    
    
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    const onSelectDate = (date) => {
        setSelectedDate(date)
        onChange(date)
    }

    return (
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity onPress={() => moveRight()}>
                <Image source={require('../../assets/images/arrow_L.png')} style={{marginLeft:5, width:20, height:20, resizeMode:'contain'}}></Image>
            </TouchableOpacity>
            <GestureRecognizer
                onSwipeLeft={(state) => onSwipeLeft(state)}
                onSwipeRight={(state) => onSwipeRight(state)}
                config={config}
                style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>
                {/* <View style={{justifyContent:'center', alignItems:'center', marginBottom:5}}>
                    <Text style={styles.monthText}>{months[month]}</Text>
                </View> */}
                <View style={styles.container}>
                    {week.map(weekDay => {
                        const textStyles = [styles.label]
                        const weekDayStyles = [styles.weekDayItem]
                        const sameDay = isSameDay(weekDay.date, selectedDate)
                        //console.log('date->>>>', weekDay.month, "selected Date", selectedDate)
                        if (sameDay) {
                            weekDayStyles.push(styles.selectedWeekDayItem)
                        }
                        return (
                            <TouchableOpacity key={weekDay.formatted} onPress={() => onSelectDate(weekDay.date)} >
                                <Text style={{ textAlign: 'center', paddingBottom: 2, fontSize: 15 }}>{months[weekDay.month]}</Text>
                                <View style={weekDayStyles} >
                                    <Text style={textStyles}>{weekDay.day}</Text>
                                    <Text style={textStyles}>{weekDay.formatted}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </GestureRecognizer>
            <TouchableOpacity onPress={()=> moveLeft()}>
                <Image source={require('../../assets/images/arrow.png')} style={{marginRight:5, width:20, height:20, resizeMode:'contain'}}></Image>
            </TouchableOpacity>
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    weekDayItem: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'black',
        height: 75,
        width: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedWeekDayItem: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#387af6',
        height: 75,
        width: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        color: 'black',
        textAlign:'center'
    },
    monthText:{
        fontSize: 20,
        color: 'black',
        textAlign:'center',
        fontFamily:'Roboto-Regular'
    }
    // selectedLabel: {
    //     fontSize: 20,
    //     color: 'blue',
    //     textAlign:'center'
    // },
    

})

export default WeekCalender
