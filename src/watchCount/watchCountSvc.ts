declare const angular: any;

export function watchCountSvc ($window) {
        'ngInject';

        const getGlobalWatches = () => {
            let total = 0;
            let scopeIds = {};


            const countWatchersInScope = (scope) => {
                if(scope) {
                    if (scopeIds.hasOwnProperty(scope.$id)) {
                        return;
                    }
                    scopeIds[scope.$id] = true;
                    if (scope.$$watchers) {
                        total += scope.$$watchers.length;
                    }
                }
            }

            const countWatchersInNode = (node) => {
                let element = angular.element(node);
                if (element.hasClass("ng-isolate-scope") && element.isolateScope) {
                    countWatchersInScope(element.isolateScope());
                }

                if (element.hasClass("ng-scope")) {
                    countWatchersInScope(element.scope());
                }
            }

            angular.forEach(
                document.querySelectorAll(".ng-scope , .ng-isolate-scope"),
                countWatchersInNode
            );
            return (total);
        };

        let service = {
            getGlobalWatches: getGlobalWatches
        };

        return service;
}