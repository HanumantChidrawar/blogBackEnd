const moment = require('moment');
const momenttz = require('moment-timezone');
const timeZone = 'Asia/CalCutta'

let now = () =>{
    return moment.utc().format();
}

let getLocalTime = () =>{
    return moment().tz(timeZone).format();
}

let convertLocalTime = () =>{
    return momenttz.tz(time, timeZone).format('LLLL');
}

module.exports = {
    now: now,
    getLocalTime: getLocalTime,
    convertLocalTime: convertLocalTime
}