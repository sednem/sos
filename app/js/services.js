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
			     	Alerts.add('ServiceTpServico Erro: ' + status +' '+ data, 'danger');
			    }).
			    then(function(result) {
           			return result.data;
			    });
     		},
     		getIdByName: function(strName) {
       			return $http.get(url).
				error(function(data, status) {
			     	Alerts.add('ServiceTpServico Erro: ' + status +' '+ data, 'danger');
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
			getServicos: function(idTipoServico, lat, lng, raio, successCallback) {
       			$http(
				{
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/servico/query?'+
					'tipo_servico_id='+idTipoServico+
					'&latitude='+lat+
					'&longitude='+lng+
					'&distancia='+raio,
					headers: {'Content-Type': 'application/json'}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServicePrestadores: Erro -> ' + status +' '+ data, 'danger');
			    });
     		},
			getServicosPrestador: function(email, successCallback) {
       			$http(
				{
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/servico/email?email='+email,
					headers: {'Content-Type': 'application/json'}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServicePrestadores: Erro -> ' + headers +' '+ status, 'danger');
			    });
     		},
			getPrestadores: function(successCallback) {
       			$http(
				{
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/prestador',
					headers: {'Content-Type': 'application/json'}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServicePrestadores: Erro -> ' + status +' '+ data, 'danger');
			    });
			},
			getPrestador: function(email, successCallback) {
       			$http(
				{
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/prestador/email?email='+email,
					headers: {'Content-Type': 'application/json'}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServicePrestadores: Erro -> ' + status +' '+ data, 'danger');
			    });
			},
			getAvaliacoes: function(email, successCallback) {
       			$http(
				{
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/avaliacao/email?email='+email,
					headers: {'Content-Type': 'application/json'}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServicePrestadores: Erro -> ' + status +' '+ data, 'danger');
			    });
			}		
		}
	}
]);

SoServices.service('ServiceServicos', ['$http', 'Alerts',
	function($http, Alerts){
		return {
			getServicos: function(successCallback) {
       			$http(
				{
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/servico',
					headers: {'Content-Type': 'application/json'}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServicePrestadores: Erro -> ' + status +' '+ data, 'danger');
			    });
     		},
			getServico: function(idServico, successCallback) {
       			$http(
				{
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/servico/'+idServico,
					headers: {'Content-Type': 'application/json'}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServicePrestadores: Erro -> ' + status +' '+ data, 'danger');
			    });
     		}		
		}
	}
]);

SoServices.service('ServiceAvaliacoes', ['$http', 'Alerts',
	function($http, Alerts){
		return {
			avaliarPrestador: function(avaliacao, apiKey, successCallback) {
       			$http(
				{
					method: 'POST',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/avaliacao/avaliar',
					data: avaliacao,
					headers: {
						'Content-Type': 'application/json',
						'token-api' : apiKey
					}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServiceAvaliacoes: Erro -> ' + status +' '+ data, 'danger');
			    });
     		},
			responderAvaliacao: function(idAvaliacao, apiKey, replica, successCallback) {
       			$http(
				{
					method: 'PUT',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/avaliacao/replica?id='+idAvaliacao,
					data : replica,
					headers: {
						'Content-Type': 'application/json',
						'token-api' : apiKey
					}
				}).
		    	success(successCallback).
			    error(function(data, status, headers, config) {
			     	Alerts.add('ServiceAvaliacoes: Erro -> ' + status +' '+ data, 'danger');
			    });
     		}		
		}
	}
]);

SoServices.service('Alerts', ['$rootScope', '$timeout',
	function($rootScope, $timeout) {
		var alertService;
		$rootScope.alerts = [];
		return alertService = {
			add: function(msg, type) {
				$timeout(
					function(){alertService.closeAlertIdx(0);},
					5000);

			    return $rootScope.alerts.push({
					type: type,
					msg: msg,
					close: function() {
						return alertService.closeAlert(this);
					}
			    });
			},
			closeAlert: function(alert) {
				return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
			},
			closeAlertIdx: function(index) {
				return $rootScope.alerts.splice(index, 1);
			},
			clear: function(){
				$rootScope.alerts = [];
			}
		};
	}
]);

// SoServices.service('GMap', ['$rootScope',
// 	function($rootScope) {
// 		var GMap;
// 		$rootScope.currentMarker = '';
// 		$rootScope.myInfoWindow = '';
// 		return GMap = {
// 			openMarkerInfo : function(marker) {
// 				$rootScope.currentMarker = marker;
// 				$rootScope.currentMarkerIsService = (typeof $scope.currentMarker.servico !== 'undefined');
// 				$rootScope.myInfoWindow.open($scope.sosMap, marker);
// 			}
// 		};
// 	}
// ]);

SoServices.service('ServiceForum', ['$http', 'Alerts',
	function($http, Alerts){
		return {
			getForum : function(idServico, successCallback) {
       			$http({
					method: 'GET',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/forum/servico/'+idServico,
					headers: {'Content-Type': 'application/json'}
				}).
				success(successCallback).
				error(function(data, status, headers, config) {
			     	Alerts.add('ServiceForum: Erro -> ' + status +' '+ data, 'danger');
				});
     		},
			post : function(idServico, emailUsuario, strPergunta, apiKey, successCallback) {
    			$http({
					method: 'POST',
					url: 'http://soservices.vsnepomuceno.cloudbees.net/forum/servico/'+idServico+'',
					data: {
						email_usuario: emailUsuario,
						pergunta: strPergunta 
					},
					headers: {
						'Content-Type': 'application/json', 
						'token-api': apiKey
					}
				}).
				success(successCallback).
				error(function(data, status, headers, config) {
			 	    	Alerts.add('ServiceForum: Erro -> ' + status +' '+ data, 'danger');
				});
     		}
		}
	}
]);

SoServices.factory('Authentication', function($localStorage, $rootScope, $q){		
	
	var userAuth = {
			nome: '',
		    email: '',
		    senha: '',
		    apiKey: '',
		    logado: false,
		    confirmarsenha: '',
		    facebookId:'' 
	};
	
	var logged = false;
	var login = null;
	var faceUser = null;
	var isLogged = null;
	
	window.fbAsyncInit = function() {
		FB.init({
			appId : '1421756051420526',
			cookie : true, // enable cookies to allow the server to access 
			// the session
			xfbml : true, // parse social plugins on this page
			version : 'v2.0' // use version 2.0
		});	
		FB.getLoginStatus(function(response) {
    		if (response.status === 'connected') {
    			logged = true;
    			userAuth.apiKey = response.authResponse.accessToken;
    			$localStorage.currentUserJson = angular.toJson(userAuth);
    		} else {
    			logged = false;
    		}
    	});
	};

	// Load the SDK asynchronously
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id))
			return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
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
    },
    isLoggedIn: function() { userAuth.logado; },
    currentUser: function() { 
    	userAuth = angular.fromJson($localStorage.currentUserJson);
    	return userAuth;
    },
    loginFace : function() {
    	var deferred = $q.defer(); 
		FB.login(function(response) {	
			if (response.authResponse) {
				FB.getLoginStatus(function(response) {
		    		if (response.status === 'connected') {
		    			userAuth.apiKey = response.authResponse.accessToken;
		    			$localStorage.currentUserJson = angular.toJson(userAuth);
		    		}
		    	});
				$rootScope.$apply(function(){
		  	         deferred.resolve(login);
		  	    });
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		}, {scope: 'email'});
		return deferred.promise;
    },
    checkLogged: function() {    
    	var deferred = $q.defer(); 
    	FB.getLoginStatus(function(response) {
    		if (response.status === 'connected') {
    			logged = true;
    			userAuth.apiKey = response.authResponse.accessToken;
    			$localStorage.currentUserJson = angular.toJson(userAuth);
    		} else {
    			logged = false;
    		}
    		//$rootScope.$apply(function(){
    	          deferred.resolve(isLogged);
    	    //});
    	});
    	return deferred.promise;
    },
    getFacebookUser: function() {  
    	var deferred = $q.defer(); 
    	FB.api('/me', {fields: 'name, id, email'}, function(response) {
    		userAuth = angular.fromJson($localStorage.currentUserJson);
    		userAuth.nome = response.name;
    		userAuth.email = response.email;
    		userAuth.facebookId = response.id;
    		$localStorage.currentUserJson = angular.toJson(userAuth);
    		$rootScope.$apply(function(){
  	          deferred.resolve(faceUser);
  	        });
    	});
    	return deferred.promise;
    },
    isFaceLogged : function() {    	
		return logged;
    }
  };
});
