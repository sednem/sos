'use strict';

/* Controllers */

angular.module('sosWeb.controllers', ['ui.bootstrap','ui.map','ui.event'])
.controller('MainCtrl', ['$scope', '$modal',
	'$log',  function($scope, $modal, $log) {
	$scope.labels = {
		"filtrar_resultado": "Filtrar prestadores...",
		"prestadores_encontrados": "Prestadores encontrados",
		"endereco": "Endereço",
		"buscar": "Buscar",
	}

	$scope.logado = true;

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
}])
.controller('PrestadoresCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.maxRate = 10;
	var urlPrestadores = 'http://soservices.vsnepomuceno.cloudbees.net/prestador?callback=JSON_CALLBACK';

	//Alerts/Messages
	$scope.mensagens = [];
	$scope.addAlert = function (strMsg, type) {
		$scope.mensagens.push({"msg": strMsg, "type": type});
	};

	$scope.closeAlert = function(index) {
		$scope.mensagens.splice(index, 1);
	};

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

	$scope.prestadores = [];

	$http({method: 'JSONP', url: urlPrestadores}).
    	success(function(data, status, headers, config) {
	      $scope.prestadores = data.list.prestadores;
	    	//TODO: Alterar variaveis quando realizar link com paginacao
			$scope.bigTotalItems = $scope.prestadores.length;
			$scope.bigCurrentPage = 1;
	     	$scope.addAlert('Prestadores de serviços encontrados', 'success');
	    }).
	    error(function(data, status, headers, config) {
	     	$scope.addAlert('Erro: ' + status +' '+ headers, 'danger');
	    });

	//Map
	// function createMarker(prest) {
	// 	var marker_prest = new google.maps.Marker({
	//         position: new google.maps.LatLng(prest.endereco.latitude,prest.endereco.longitude),
	//         title: prest.nome,
	//         map: map,
	//         icon: '../img/map_icon_prest.png',
	//     }); 

	var ll = new google.maps.LatLng(-18.8800397, -47.05878999999999);
	
    $scope.mapOptions = {
        center: ll,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Markers should be added after map is loaded
    $scope.onMapIdle = function() {
        if ($scope.myMarkers === undefined){    
            var marker = new google.maps.Marker({
                map: $scope.myMap,
                position: ll
            });
            $scope.myMarkers = [marker, ];
        }
    };

    $scope.markerClicked = function(m) {
        window.alert("clicked");
    };
}])
.controller('MyCtrl2', ['$scope', function($scope) {
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