'use strict';


// Declare app level module which depends on filters, and services
angular.module('sosWeb', [
  'ngRoute',
  'sosWeb.filters',
  'sosWeb.services',
  'sosWeb.directives',
  'sosWeb.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html'});
  $routeProvider.when('/busca', {templateUrl: 'partials/busca.html', controller: 'PrestadoresCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
