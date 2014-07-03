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
  $routeProvider.when('/prest/email/:email/apiKey/:apiKey', {templateUrl: 'partials/prestPortfolio.html', controller: 'PrestadoresAnunciosCtrl'});
  $routeProvider.when('/avaliacoesPrest/email/:email/apiKey/:apiKey', {templateUrl: 'partials/avaliacoesPrest.html', controller: 'AvaliacoesPrestCtrl'});
  $routeProvider.when('/forumPrest/email/:email/apiKey/:apiKey/servicoId/:servicoId', {templateUrl: 'partials/forumPrest.html', controller: 'ForumPrestCtrl'});
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

//Muda o background da home dinamicamente
function changeImage()
{
    $('#bg-home')/*.fadeTo('slow', 0.3, function()
    {
        $(this)*/.css('background-image', 'url('+images[x]+')');
    /*}).delay(1000).fadeTo('slow', 1);*/

    x++;

    if(x >= images.length){
        x = 0;
    } 

    // fadeImg(img, 100, true);
    setTimeout("changeImage()", 5000);
}
var images = [], x = 0;
images[0] = "img/bg-home/diarista.png";
images[1] = "img/bg-home/empreiteiro.png";
images[2] = "img/bg-home/jardineiro.png";
images[3] = "img/bg-home/marceneiro.png";
images[4] = "img/bg-home/pintor.png";
setTimeout("changeImage()", 5000);