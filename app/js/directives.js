'use strict';

/* Directives */


var SoSDirectives = angular.module('sosWeb.directives', []);

SoSDirectives.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]);

//Google places autocomplete
SoSDirectives.directive('googleplace', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			var options = {
				types: [],
				componentRestrictions: {}
			};
			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
			 
			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				scope.$apply(function() {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});

SoSDirectives.directive('frmBuscaServico', function () {
	return {
		restrict: 'E',
		templateUrl: 'templates/frm-busca-servico.html'
	};
});