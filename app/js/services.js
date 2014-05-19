'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var SoServices = angular.module('sosWeb.services', ['ngResource']);

SoServices.value('version', '0.1');
/*.factory('prestadoresFactory', function($resource) {
	return $resource('json/prestadores.json');
})*/
// SoServices.factory('Prestadores', ['$resource',
//   function($resource){
//     return $resource('http://soservices.vsnepomuceno.cloudbees.net/prestador?callback=JSON_CALLBACK', {}, {
//       query: {method:'JSONP', params:{/*param1:'prestadores'*/}, isArray:true}
//     });
//   }]);

SoServices.service('Alerts', function () { //Alerts/Messages	
	var alerts = [];
	this.addAlert = function (strMsg, type) {
		alerts.push({"msg": strMsg, "type": type});
	};

	this.removeAlert = function(index) {
		alerts.splice(index, 1);
	};

	this.getAll = function() {
		return alerts;
	};
});