'use strict';

// Declare app level module which depends on filters, and services
var SoSApp = angular.module('sosWeb', [
  'ngRoute',/*'ngResource',*/
  'sosWeb.filters',
  'sosWeb.services',
  'sosWeb.directives',
  'sosWeb.controllers'
]);

SoSApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'MainCtrl'});
  $routeProvider.when('/busca', {templateUrl: 'partials/busca.html', controller: 'PrestadoresCtrl'});
  $routeProvider.when('/busca/tipoServico/:tipoServico/endereco/:endereco/raio/:raio',
    {templateUrl: 'partials/busca.html', controller: 'PrestadoresCtrl'});
  $routeProvider.when('/anunciar', {templateUrl: 'partials/anunciar.html', controller: 'AnuncioCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

SoSApp.constant('paginationConfig', {
  itemsPerPage: 1,
  maxSize: 2,
  boundaryLinks: true,
  directionLinks: true,
  rotate: false,
  firstText: '\u00AB', // «
  previousText: '\u2039', // ‹
  nextText: '\u203A', // ›
  lastText: '\u00BB'// »
});

// '\u2713' : ✓
// '\u2718' : ✘
