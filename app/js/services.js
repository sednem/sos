'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var SoServices = angular.module('sosWeb.services', ['ngResource', 'ngStorage']);

SoServices.value('version', '0.0.0');

SoServices.factory('ServiceTpServico', ['$http', 'Alerts',
	function($http, Alerts){
		var url = 'http://soservices.vsnepomuceno.cloudbees.net/tipo-servico';
		return {
			getTiposServicos: function() {
       			return $http.get(url).
				error(function(data, status) {
			     	Alerts.addAlert('ServiceTpServico Erro: ' + status +' '+ data, 'danger');
			    }).
			    then(function(result) {
           			return result.data;
			    });
     		},
     		getIdByName: function(strName) {
       			return $http.get(url).
				error(function(data, status) {
			     	Alerts.addAlert('ServiceTpServico Erro: ' + status +' '+ data, 'danger');
			    }).
			    then(function(result) {
			    	var tiposServicos = result.data;
			    	var i;
			    	for (i = 0; i < tiposServicos.length; ++i) {
			    		if(tiposServicos[i].nome == strName){
			    			return tiposServicos[i].id;
			    		}
					}
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
					method: 'GET',//POST ??
					url: 'http://soservices.vsnepomuceno.cloudbees.net/prestador/query?'+
					'tipo_servico_id='+idTipoServico+
					'&latitude='+lat+
					'&longitude='+lng+
					'&distancia='+raio,
					headers: {'Content-Type': 'application/jsonp'}
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
	
	this.closeAll = function() {
		while (alerts.length > 0) {
			alerts.splice(0, 1);
		}		
	};

	// this.addAlert('Teste Danger', 'danger');
	// this.addAlert('Teste Success', 'success');
	// this.addAlert('Teste Info', 'info');
});

SoServices.factory('Authentication', function($localStorage){		
	
	var userAuth = {
			nome: '',
		    email: '',
		    senha: null,
		    apiKey: '',
		    logado: false,
		    confirmarsenha: null
	};
	
	if ($localStorage.currentUserJson == null) {
		$localStorage.currentUserJson = angular.toJson(userAuth);
	} 

  return {
    login: function(userLogin) { 
    	userAuth = userLogin;
    	$localStorage.currentUserJson = angular.toJson(userAuth);
    },
    logout: function(userLogout) { 
    	userAuth = userLogout;
    	$localStorage.currentUserJson = angular.toJson(userAuth);
    	delete $localStorage.currentUserJson;
    },
    isLoggedIn: function() { userAuth.logado; },
    currentUser: function() { 
    	userAuth = angular.fromJson($localStorage.currentUserJson);
    	return userAuth;
    }
  };
});