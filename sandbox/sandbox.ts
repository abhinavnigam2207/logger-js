declare const angular: any;

angular.module('app', ['logger-js'])
    .controller('LoggerCtrl', ['LoggerSvc', '$scope', function (LoggerSvc, $scope) {

        $scope.logState = {
            consoleLogsEnabled: false,
            enabled: false,
            timer: null,
            url: ''
        };
        $scope.logText = '';

        $scope.calLogSvc = (logType) => {
            var state = LoggerSvc.getLogState();
            if(state && state.enabled) {
                LoggerSvc.handle('Default View', `This is a ${logType} type of log`, logType);
            }
            else {
                alert('No log Added.');
            }
        };

        $scope.setLoggingState = () => {
            LoggerSvc.setLoggingState($scope.logState);
        };

    }]);