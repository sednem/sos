'use strict';

/* Controllers */

angular.module('sosWeb.controllers', ['ui.bootstrap'])
.controller('MainCtrl', ['$scope', function($scope) {
	$scope.labels = {
		"filtrar_resultado": "Filtre aqui o resultado da sua pesquisa...",
		"prestadores_encontrados": "Prestadores encontrados",
		"endereco": "Endereço",
		"buscar": "Buscar",
	}

$scope.maxRate = 10;

	$scope.rate = 7;
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
	}
  ];
}])
.controller('MyCtrl2', ['$scope', function($scope) {
}]);
