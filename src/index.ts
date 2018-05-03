import { watchCountModule } from './watchCount/index';
import { browserInfoModule } from './browserInfo/index';

declare const angular: any;
declare const Rx: any;
declare const $: any;
declare var Promise: any;

const moduleName = 'logger-js';

//module
export const loggingModule = angular.module(moduleName, [
    watchCountModule,
    browserInfoModule
]).factory('loggerSvc',[
        '$log',
        '$window',
        'stacktraceService',
        'browserInfo',
        'watchCountSvc',
        (
        $log,
        $window,
        stacktraceService,
        browserInfo,
        watchCountSvc) => {
            
            let consoleLogs = [];
            let stackTraceLogs = [];
            let userState = {
                consoleLogs : [],
                stackTraceLogs : []
            };
            let logState = {
                consoleLogsEnabled: false,
                enabled: false,
                timer: null,
                url: ''
            };
            let logObserver;
            
            const newUserState = () => {
                return {
                    userSession: null, // Session Details
                    browserInfo: browserInfo.getBrowserInfo(), // browserInfo
                    locationPath: $window.location.href, // Current View
                    lastUpdatedTime: null, // Last Updated Timestamp
                    consoleLogs: [], //console Logs
                    stackTraceLogs: [], // stackTrace
                    globalWatchersCount: watchCountSvc.getGlobalWatches() //globalwatches
                };
            };
            
            const get = () => {
                return userState;
            };
            
            const set = (userStateData) => {
                userState = userStateData;
            };

            const getLogState = () => {
                return logState;
            };
                
            const sendDataToServer = (message: string, data: any) => {
                if(logState.consoleLogsEnabled) {
                    userState.consoleLogs = consoleLogs;
                }
                userState.stackTraceLogs = stackTraceLogs;
                $.ajax({
                    type: "POST",
                    url: logState.url,
                    contentType: "text/plain",
                    data: angular.toJson({
                        message: message,
                        dataObj: data
                    })
                });
            };
                        
            const handle = (view: string,
                    message: any,
                    data: any,
                    logType: string = 'log',
                    sendToServer?: boolean
                ): void => {
                let msg = `(${view}) ${new Date()} : ${message}`;
                switch (logType) {
                    case "log":
                    $log.log(`Info: ${msg}, Data: ${data}`);
                    break;
                    case "info":
                    $log.info(`Info: ${msg}, Data: ${data}`);
                    break;
                    case "warn":
                    $log.warn(`Warn: ${msg}, Data: ${data}`);
                    break;
                    case "error":
                    $log.error(`Error: ${msg}, Data: ${data}`);
                    break;
                    case "debug":
                    $log.debug(`Error: ${msg}, Data: ${data}`);
                    break;
                    case "exception":
                    $log.debug(`Error: ${msg}, Data: ${data}`);
                    break;
                    default:
                    $log.log(`Info: ${msg}, Data: ${data}`);
                    break;
                }
                logState.enabled && logState.consoleLogsEnabled && sendToServer && consoleLogs.push({message: msg, data: data, logType: logType});
            };
            
            const unHandle = function (exception, cause) {
                $log.error.apply($log, arguments);
                try {
                    let errorData = {
                        errorMessage : exception.toString(),
                        errorUrl: $window.location.href,
                        stackTrace: stacktraceService.print({
                            e: exception
                        }),
                        cause: (cause || ""),
                        userState: userState
                    };
                    logState.enabled && stackTraceLogs.push(errorData);
                } catch (error) {
                    logState.enabled && stackTraceLogs.push({errorMessage: 'Error logging failed', error :error});
                    $log.warn(`Error logging failed - ${error}`);
                }
            };
            
            const setUserState = (session) => {
                let userState = newUserState();
                userState.userSession = session;
                userState.lastUpdatedTime = Date.now();
                userState.consoleLogs = [];
                userState.stackTraceLogs = [];
                service.set(userState);
            };
                                
            const setLoggingState = (logStateObj) => {
                if(!logStateObj.enabled){
                    logState.enabled && shutDown();
                }
                else if(!logState.enabled && logStateObj.timer && logStateObj.url){
                    bootUp(logStateObj.timer);
                }
                logState = logStateObj;
            };
            
            const bootUp = (timer) => {
                logObserver = Rx.Observable.timer(timer, timer)
                .subscribe(() => {
                    sendDataToServer('Log update', userState);
                });
            };
            
            const shutDown = () => {
                logObserver.onCompleted();
            };
            
            const service = {
                get: get,
                set: set,
                handle: handle,
                unHandle: unHandle,
                setUserState: setUserState,
                setLoggingState: setLoggingState,
                bootUp: bootUp,
                shutDown: shutDown
            };
            
            return service;
        }
]).config(['$provide', function($provide){
    $provide.decorator("$exceptionHandler", ['$delegate','loggerSvc', ($delegate, LoggerSvc) => {
            return (exception, cause) => {
                $delegate(exception, cause);
                LoggerSvc.unHandle('error',exception, cause);
            };
        }
    ]);
    $provide.decorator('$log', ['$delegate', 'loggerSvc', function ($delegate, loggerSvc) {
        return {
            log: function () {
                // $delegate.log.apply(null, arguments);
                loggerSvc.handle('unknown View', arguments[0], arguments[1], 'log');
            },
            info: function (){
                // $delegate.info.apply(null, arguments);
                loggerSvc.handle('unknown View', arguments[0], arguments[1], 'info');
            },
            debug: function (){
                // $delegate.debug.apply(null, arguments);
                loggerSvc.handle('unknown View', arguments[0], arguments[1], 'debug');
            },
            warn: function (){
                // $delegate.warn.apply(null, arguments);
                loggerSvc.handle('unknown View', arguments[0], arguments[1], 'warn');
            },
            error: function () {
                // $delegate.error.apply(null, arguments);
                loggerSvc.handle('unknown View', arguments[0], arguments[1], 'error');
            }
        };
    }]);
}]).factory('httpHeaderInterceptor', [
            '$q',
            'lastUpdatedService',
            'LoggerSvc',
            '$injector',
            ($q, lastUpdatedService, LoggerSvc, $injector) => {
                return {
                    requestError: (rejection) => {
                        return $q.reject(rejection);
                    },
                    response: (response) => {
                        return response;
                    },
                    responseError: (rejection) => {
                        if (rejection.status === 304) {
                            return $q.reject(rejection);
                        } else {
                            LoggerSvc.handle('App', `Http Call intercepted with error - status: ${rejection.status} - detail: ${rejection}`, null, 'error', true);
                            rejection.data = [];
                            return new Promise((resolve, reject) => {
                                resolve(rejection);
                            });
                        }
                    }
                };
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpHeaderInterceptor');
}]);