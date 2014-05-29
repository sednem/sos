'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var SoServices = angular.module('sosWeb.services', ['ngResource']);

SoServices.value('version', '0.0.0');

SoServices.factory('ServiceTpServico', ['$http', 'Alerts',
	function($http, Alerts){
		return {
			getTiposServicos: function() {
				var url = 'http://soservices.vsnepomuceno.cloudbees.net/tipo-servico?callback=JSON_CALLBACK';
       			return $http.jsonp(url).
				error(function(data, status) {
			     	Alerts.addAlert('ServiceTpServico Erro: ' + status +' '+ data, 'danger');
			    }).
			    then(function(result) {
           			return result.data;
			    });
     		}
		}
	}
]);

SoServices.factory('ServicePrestadores', ['$http', 'Alerts',
	function($http, Alerts){
		return {
			getPrestadores: function(idTipoServico, lat, lng, raio, successCallback) {
       			$http(
				{
					method: 'JSONP',//POST ??
					url: 'http://soservices.vsnepomuceno.cloudbees.net/prestador?callback=JSON_CALLBACK',
						//'http://soservices.vsnepomuceno.cloudbees.net/prestador/query/?callback=JSON_CALLBACK',
					headers: {'Content-Type': 'application/jsonp'},//jsonp
					data: JSON.stringify(
						{	query :
							{
								'tipo_servico_id' : idTipoServico, //Encontrar maneira de trocar nome para id
								'latitude' : lat, 
								'longitude' : lng,
								'distancia' : raio
							}
						})
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.addAlert('ServicePrestadores: Erro -> ' + status +' '+ data, 'danger');
			    });
     		}
		}
	}
]);

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

	// this.addAlert('Teste Danger', 'danger');
	// this.addAlert('Teste Success', 'success');
	// this.addAlert('Teste Info', 'info');
});