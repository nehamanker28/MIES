import React from 'react'
import moment from 'moment'


export const validateUserName = (text) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      let num = value.replace(".", '');
        if (isNaN(num)) {
            return false // incorrect phone no
        } else {
            return true   // correct phone no
        }
    ////console.log("Email is Not Correct");
    return false
  }else {
    return true
  }
}

export const calculateAge = (dob) => {
    // //console.log('dob -------------------------------------->>>',dob)
    var today = new Date();
    ////console.log('today -------->>>',today)
    var birthDate = new Date(dob);  // create a date object directly from `dob1` argument
    ////console.log('birthDate -------->>>',birthDate)
    var age_now = today.getFullYear() - birthDate.getFullYear();
   console.log('age_now -------->>>', age_now)
    
    var returnVal = age_now
    var m = today.getMonth() - birthDate.getMonth();
    console.log('m -------->>>', m)
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age_now--;
            returnVal = age_now
            var month = birthDate.getMonth() - today.getMonth();
            month = 12 - month
    
            if (returnVal <= 0) {
                returnVal = month + ' month'
            } else {
                if (m == 0) {
                    returnVal = age_now + ' yrs'
                } else {
                    returnVal = age_now + ' yrs '
                }
            }
        } else {
            var month = today.getMonth() - birthDate.getMonth();

            if (returnVal <= 0) {
                if (m == 1) {
                    returnVal = today.getDay() + birthDate.getDay() + ' day'
                } else {
                    returnVal = month + ' months'
                }
            } else {
                if (m == 0) {
                    returnVal = age_now + ' yrs'
                } else {
                    returnVal = age_now + ' yrs ' 
                }
            }
        }
        return returnVal;
}


export const isPast = (d) => {
        var today = new Date();
        var date = new Date(d);  
        
        var isPast = false
        if (date < today) {
            isPast = true
        }
        return isPast;
}

export const calculateDuration = (startDate, endDate) => {
    //  //console.log('start str ------>>>', startDate)
    //  //console.log('end str ------>>>',endDate)
    let startStr = startDate + 'Z'
    let endStr = endDate + 'Z'
    
    let sessionStartDate = new Date(startStr)
    let sessionEndDate = new Date(endStr)
    //  //console.log('start time ------>>>', sessionStartDate)
    //  //console.log('end time ------>>>',sessionEndDate)
    let hour = moment(sessionEndDate).diff(moment(sessionStartDate), 'hours')
    let minutes = moment(sessionEndDate).diff(moment(sessionStartDate), 'minutes')
    
    let ms = moment(sessionEndDate).diff(moment(sessionStartDate))
    var d = moment.duration(ms);
    ////console.log(d.days() + ':' + d.hours() + ':' + d.minutes() + ':' + d.seconds());
    var returnText = ''

    if (hour < 1) {
        returnText = minutes + ' min'
    } else {
        if (d.minutes() == 0) {
            returnText = d.hours() + ' hr'
        } else {
            returnText = d.hours() + ' hr ' + d.minutes() + ' min'
        }
    }
    return returnText
}

export const calculateMinsLeft = (startDate) => {

    ////console.log('start Date ------>>>',startDate)

    let startDateStr = startDate + 'Z'

    let sessionStartDate = new Date()
    let sessionEndDate = new Date(startDateStr)
    ////console.log('s sessionStartDate----->>>',sessionStartDate)
    ////console.log('s sessionEndDate----->>>',sessionEndDate)
    let returnText = moment(sessionEndDate).diff(moment(sessionStartDate), 'minutes')
    ////console.log('returnText----->>>',returnText)
    return returnText
}

export const calculateMinsLeftForEnd = (endDate) => {
    ////console.log('end Date ------>>>',endDate)
    let endDateStr = endDate + 'Z'

    let sessionStartDate = new Date()
    let sessionEndDate = new Date(endDateStr)
    ////console.log('e sessionStartDate----->>>',sessionStartDate)
    ////console.log('e sessionEndDate----->>>',sessionEndDate)
    let returnText = moment(sessionEndDate).diff(moment(sessionStartDate), 'minutes')
    ////console.log('returnText----->>>',returnText)
    return returnText
}