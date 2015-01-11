'use strict';
angular.module('nome', [
    'nome.services',
    'nome.controllers',
    'nome.directives',
    'ngRoute',
    'ngResource'
]).config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/jogo.html',
            controller: 'jogoCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);