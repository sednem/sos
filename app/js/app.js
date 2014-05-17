'use strict';


// Declare app level module which depends on filters, and services
angular.module('sosWeb', [
  'ngRoute',/*'ngResource',*/
  'sosWeb.filters',
  'sosWeb.services',
  'sosWeb.directives',
  'sosWeb.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html'});
  $routeProvider.when('/busca', {templateUrl: 'partials/busca.html', controller: 'PrestadoresCtrl'});
  $routeProvider.when('/anunciar', {templateUrl: 'partials/anunciar.html', controller: 'AnuncioCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/home'});
}])
.constant('paginationConfig', {
  itemsPerPage: 1,
  maxSize: 2,
  boundaryLinks: true,
  directionLinks: true,
  rotate: false,
  firstText: '«',
  previousText: '‹',
  nextText: '›',
  lastText: '»'
});
