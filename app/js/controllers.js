'use strict';

/* Global Object */
//var sosMap;
//var mapOptions;
var geo = new google.maps.Geocoder; //Posicao inicial do mapa

/* Controllers */
var SoSCtrls = angular.module('sosWeb.controllers', ['ui.bootstrap','ui.map','ui.event']);

/* Main page Ctrl */
SoSCtrls.controller('MainCtrl', ['$scope', '$http', '$location', '$modal', 'Alerts',
	'$log',  function($scope, $http, $location, $modal, Alerts, $log) {
	$scope.logado = true;
	$scope.gPlace;
	$scope.tipoServico;
	$scope.endereco;
	$scope.raio;

	$scope.search = function() {
		$location.path(
			'/busca/tipoServico/'+$scope.tipoServico+
			'/endereco/'+$scope.endereco+
			'/raio/'+$scope.raio);
	};

	$scope.tiposServicos = new Array();
	$http({
		method: 'JSONP',
		url: 'http://soservices.vsnepomuceno.cloudbees.net/tipo-servico?callback=JSON_CALLBACK'}).
    	success(function(data, status, headers, config) {
			$scope.tiposServicos = data;

	    }).
	    error(function(data, status, headers, config) {
	     	Alerts.addAlert('Erro: ' + status +' '+ data, 'danger');
	    });

	$scope.labels = {
		"filtrar_resultado": "Filtrar prestadores...",
		"prestadores_encontrados": "Prestadores encontrados",
		"endereco": "Endereço",
		"buscar": "Buscar",
	}

	//Alerts na pagina principal
	$scope.alerts = Alerts.getAll();
	$scope.closeAlert = function(index) {Alerts.removeAlert(index);};

	$scope.items = ['item1', 'item2', 'item3'];
	$scope.open = function (size) {
		var modalInstance;
		if($scope.logado){
			modalInstance = $modal.open({
			  templateUrl: 'partials/anunciar.html',
			  controller: 'AnuncioCtrl',
			  size: size,
			  resolve: {
			    items: function () {
			      return $scope.items;
			    }
			  }
			});
			modalInstance.result.then(function (selectedItem) {
			  $scope.selected = selectedItem;
			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		}else{
			modalInstance = $modal.open({
			  templateUrl: 'partials/login.html',
			  controller: 'LoginCtrl',
			  size: size
			});
		}
	};
}]);

/* Ctrl Busca de prestadores */
SoSCtrls.controller('PrestadoresCtrl', 
	['$scope', '$http', '$location', '$routeParams', 'Alerts',
	function($scope, $http, $location, $routeParams, Alerts) {
	 	//alert("Inicializando PrestadoresCtrl")
	 	$scope.tipoServico = $routeParams.tipoServico;
		$scope.endereco = $routeParams.endereco;
		$scope.raio = $routeParams.raio;

		$scope.prestadores = [];

		$scope.maxRate = 10;
		var urlPrestadores = 
		'http://soservices.vsnepomuceno.cloudbees.net/prestador?callback=JSON_CALLBACK';
		// 'http://soservices.vsnepomuceno.cloudbees.net/prestador/query?callback=JSON_CALLBACK';

		//Filter and order
		$scope.orderProp = '-avaliacao';
		$scope.orderBy = function (orderProp) {
			$scope.orderProp = orderProp;
		};

		//Pagination
		$scope.itemsPerPage = 1;
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};
		$scope.pageChanged = function() {
			$scope.currentPage
		};

		//Inicializa o mapa
		$scope.userLocation;
		var ll = new google.maps.LatLng(-7.9712137, -34.839565100000016);
	    $scope.mapOptions = {
	        center: ll,
	        zoom: 15,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

		
		$scope.getPesquisadores = function() {

			geo.geocode({'address':$scope.endereco},function(results, status){
	          	if (status == google.maps.GeocoderStatus.OK) {
					$scope.userLocation = results[0].geometry.location;
	        		ll = new google.maps.LatLng($scope.userLocation.lat(), $scope.userLocation.lng());

				    /*$scope.prestParams = 
					    {
				    		"tipo_servico_id" : 3,
							"latitude" : $scope.userLocation.lat(),
							"longitude" : $scope.userLocation.lng(),
							"distancia" : $scope.raio
						}*/

					$http({method: 'JSONP', url: urlPrestadores/*, params: $scope.prestParams*/}).
				    	success(function(data, status, headers, config) {
							$scope.prestadores = data;
					    	//TODO: Alterar variaveis quando realizar link com paginacao
								$scope.bigTotalItems = $scope.prestadores.length;
							$scope.bigCurrentPage = 1;

							// alert('Chamando carrega mapa..');
						    $scope.carregarMapa();
					    }).
					    error(function(data, status, headers, config) {
					     	Alerts.addAlert('Erro: ' + status +' '+ data, 'danger');
					    });
	          	} else {
	            	alert("Geocode was not successful for the following reason: " + status);
	          	}
		    });
		};

		$scope.carregarMapa = function() {
        	$scope.myMarkers = new Array();
	        //Adiciona marcadores para cada prestador encontrado
	        var i;
	    	for (i = 0; i < $scope.prestadores.length; ++i) {
				var newMarker = 
		            $scope.myMarkers.push(
		            	new google.maps.Marker({
			                map: $scope.sosMap,
			                position: new google.maps.LatLng(
								$scope.prestadores[i].endereco.latitude,
								$scope.prestadores[i].endereco.longitude),
			                icon: 'img/map_icon_prest.png'
		            	})
		            );
			}

	        $scope.myMarkers.push(
	        	new google.maps.Marker({
		            map: $scope.sosMap,
		            position: ll
	        	})
	        );
	        $scope.myMarkers.push($scope.newMarkers); //Adiciona novos marcadores.
        	$scope.sosMap.panTo(ll); //Centraliza o mapa no endereço informado.
		}

		if($scope.tipoServico && $scope.endereco && $scope.raio){
			$scope.getPesquisadores();
		}	
	    
	    //Markers should be added after map is loaded
	    $scope.onMapIdle = function() {
	        
	    };

	    $scope.markerClicked = function(m) {
	        window.alert("clicked");
	    };
	}
]);

//Controler Example
SoSCtrls.controller('MyCtrl2', ['$scope', function($scope) {
}]);


//Controla o dialog de anuncio de servicos
var AnuncioCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

//Controla o dialog de "sign in" / "sign up"
var LoginCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};