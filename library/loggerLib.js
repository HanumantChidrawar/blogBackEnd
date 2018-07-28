const logger = require('pino')()
const moment = require('moment')

let captureError = (errorMessage, errorOrigin, errorLevel) =>{
    let currentTime = moment()

    let errorResponse ={
        timeStamp: currentTime,
        errorMessage: errorMessage,
        errorOrigin: errorOrigin,
        errorLevel: errorLevel
    }

    logger.error(errorResponse)
    
    return errorResponse;

}//end caputreError

let captureInfo = (message, origin, impotance) =>{
    let currentTime = moment();

    let infoMessage = {
        timestamp: currentTime,
        message: message,
        origin: origin,
        level: impotance
    }

    logger.info(infoMessage);
    return infoMessage;

}// end infoCapture

module.exports = {
    error: captureError,
    info: captureInfo
}