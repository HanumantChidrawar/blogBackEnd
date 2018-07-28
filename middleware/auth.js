/* Const library */
const logger = require('./../library/loggerLib');
const response = require('./../library/responseLib');
const check = require('./../library/checkLib');

let isAuthenticated = (req, res, next) => {
    if(req.params.authToken || req.query.authToken || req.header('authToken')){
        if(req.params.authToken == "Admin" || req.query.authToken == "Admin" || req.header('authToken') == "Admin"){
            req.user = {fullName:"Hanumant Patil", userId:"Admin"}
            next();
        }
        else{
            logger.error("Incorrect authentication token","Authentication Moiddleware",5);
            let apiResponse = response.generate(true, "Incorrect authentication token", 403,null);
            res.send(apiResponse);
        }
    } else{
        logger.error("Authentication Token Missing", "Authentication Middleware", 5);
        let apiResponse = response.generate(true, "Authentication Token is Missing in request",404, null);
        res.send(apiResponse);
    }
}

module.exports = {
    isAuthenticated: isAuthenticated
}