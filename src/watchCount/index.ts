import { watchCountSvc } from './watchCountSvc';
declare const angular: any;

export const watchCountModule = angular.module('watchCountModule')
.factory('watchCountSvc', watchCountSvc);