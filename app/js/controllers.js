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
.controller('PrestadoresCtrl', ['$scope', function($scope) {
	$scope.maxRate = 10;

	$scope.prestadores = [
	    {
			"nome": "Diogo Peixoto",
			"email": "peixotoo@gmail.com",
			"senha": "12345",
			"cpf": "000.000.000-00",
			"logradouro": "Rua Fulaninho de tal",
			"numero": "xxx",
			"complemento": "apartamento x",
			"cep": "xxxxx-xxx",
			"telefone": "XX XXXX-XXXX",
			"avaliacao": 10,
		},
		{
			"nome": "Renato V. Mendes",
			"email": "renato@vmendes.com.br",
			"senha": "mypass",
			"cpf": "111.111.111-11",
			"logradouro": "Rua Três",
			"numero": 123,
			"complemento": "",
			"cep": "53400-123",
			"telefone": "81 8800-0088",
			"avaliacao": 7,
		},
		{
			"nome": "Vilmar Nepomuceno",
			"email": "vsnepomuceno@gmail.com",
			"senha": "asdasd",
			"cpf": "222.222.222-22",
			"logradouro": "Rua XYZ",
			"numero": 987,
			"complemento": "aptº 303",
			"cep": "54678-009",
			"telefone": "81 4444-4554",
			"avaliacao": 8,
		},
		{
			"nome": "José Maria",
			"email": "zemaria@hotmail.com",
			"senha": "10101970",
			"cpf": "333.333.333-33",
			"logradouro": "Rua da esquina",
			"numero": 1212,
			"complemento": "",
			"cep": "54678-309",
			"telefone": "81 3443-4554",
			"avaliacao": 3,
		},
		{
			"nome": "Karina Oliveira",
			"email": "vkoliveira@hotmail.com",
			"senha": "asdasd",
			"cpf": "222.222.222-22",
			"logradouro": "Rua XYZ",
			"numero": 987,
			"complemento": "aptº 303",
			"cep": "54678-009",
			"telefone": "81 4444-4554",
			"avaliacao": 5,
		},
		{
			"nome": "Tiago Alencar",
			"email": "tiago@hotmail.com",
			"senha": "10101970",
			"cpf": "333.333.333-33",
			"logradouro": "Rua da esquina",
			"numero": 1212,
			"complemento": "",
			"cep": "54678-309",
			"telefone": "81 3443-4554",
			"avaliacao": 7,
		}
	];

	$scope.bigTotalItems = $scope.prestadores.length;
	$scope.bigCurrentPage = 1;
	$scope.itemsPerPage = 1;

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		$scope.currentPage
	};

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