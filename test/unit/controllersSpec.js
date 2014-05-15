'use strict';

/* jasmine specs for controllers go here */
describe('SoSWeb controllers', function() {

  describe('PrestadoresCtrl', function(){

    beforeEach(module('sosWeb'));

    it('should create "prestadores" model with 3 prestadores', inject(function($controller) {
      var scope = {},
          ctrl = $controller('PrestadoresCtrl', {$scope:scope});

      expect(scope.prestadores.length).toBe(3);
    }));

  });
});