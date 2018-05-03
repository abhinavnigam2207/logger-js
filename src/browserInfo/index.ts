import { browserInfoSvc } from './browserInfoSvc';
declare const angular: any;

export const browserInfoModule = angular.module('browserInfoModule')
.factory('browserInfoSvc', browserInfoSvc);