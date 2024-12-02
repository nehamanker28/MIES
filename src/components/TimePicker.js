import React from 'react'
import { Text, View } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const TimePicker = (props) => {
    return (
        <DateTimePickerModal
            isVisible={props.isVisible}
            date = {props.date}
            mode="time"
            is24Hour={false}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}  
        />
        )
}

export default TimePicker
