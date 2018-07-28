//This is needed to Import ExpressJS in our application
const express = require('express')
const http = require('http');
const appConfig = require('./config/appConfig');
const fs = require('fs');
const mongoose = require('mongoose');

//importing body-parser for fetching body parameters
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//importing the middlewares
const globalErrorMiddleware = require('./middleware/appErrorHandler');
const routeLoggerMiddleware = require('./middleware/routeLogger');
const helmet = require('helmet');
const logger = require('./library/loggerLib');

//Declaring an Instance of expressJs
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use(globalErrorMiddleware.globalErrorHandler);
app.use(routeLoggerMiddleware.logIp);

//Bootstrap model
let modelsPath = './models';
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        require(modelsPath + '/' + file)
    }
});
//end bootstrap model

//Bootstrap route
let routesPath = './routes';
fs.readdirSync(routesPath).forEach(function (file) {

    if (~file.indexOf('.js')) {
        console.log("including the following file");
        console.log(routesPath + '/' + file);
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }//

});
//end bootstrap route

//calling global 404 handler after route
app.use(globalErrorMiddleware.globalNotFoundHandler);
//end global 404 handler


//Listening the server -creating a local server
/* app.listen(appConfig.port, () => {
    console.log('Example app listening on port 3000!')
    //creating the mongo db connection here
    let db = mongoose.connect(appConfig.db.uri);

}); */

/**
 * Create HTTP Server
*/

const server = http.createServer(app);

//start listening to the http server

console.log(appConfig);
server.listen(appConfig.port);
server.on('error',onError);
server.on('listening',onListening);

//end server listening code

/**
 *Event Listener for HTTP server "error" event 
*/

function onError(error){
    if(error.syscall !== 'listen'){
        logger.error(error.code+ ' not equal listen','serverOnErrorHandler',10);
        throw error;
    }

    //handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10)
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    ('Listening on ' + bind)
    logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10)
    let db = mongoose.connect(appConfig.db.uri)
}

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    // application specific logging, throwing an error, or other logic here
})

//handling mongoose connection error
mongoose.connection.on('error', (err) => {
    console.log('Database connection error');
    console.log(err);
});//end mongoose connection error

//handling mongoose success event
mongoose.connection.on('open', (err) => {

    if (err) {
        console.log("Database Error");
        console.log(err);
    } else {
        console.log("Database connection open Success");
    }
});//end mongoose connection open handler
