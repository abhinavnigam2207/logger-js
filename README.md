# logger-js
A Logging Utility for your Angular JS Application.


##Developmnent

To build it:

npm i && gulp


## Installing
logger-js has optional dependencies on angular, RxJs 
and stacktrace.js


## Getting Started
1. After installing, add logger-js module as a dependency to your module:

````javascript
angular.module('YourModule', ['logger-js'])
````


2. Initiate logging for your context

````javascript
angular.module('YourModule').run(['LoggerJs', function(){
    LoggerSvc.setLoggingState({
                consoleLogsEnabled: boolean  // Should console logs be traced and stacked in array
                enabled: boolean,  // Should Logs be enabled, true to initiate
                timer: number,   // Time interval in milliseconds, after every time interval logs to be sent to server
                url: string,  // Logging service URL
            });
}]);
````


3. Log you actions

````javascript
app.controller('LogTestCtrl', ['$log', 'LoggerSvc',  function ($log, LoggerSvc) {
    LoggerSvc.handle(view: string,
                    message: any,
                    data: any,
                    logType: string',
                    sendToServer?: boolean);
    LoggerSvc.unHandle(exception: any,
                    cause: any);
}]);
````