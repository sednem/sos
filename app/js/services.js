'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('sosWeb.services', []).
value('version', '0.1')
.factory('prestadoresFactory', function($resource) {
	return $resource('json/prestadores.json');
});
