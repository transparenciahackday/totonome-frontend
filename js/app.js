'use strict';
angular.module('nome', [
    'nome.services',
    'nome.controllers',
    'nome.directives',
    'ngRoute',
    'ngResource',
    'djds4rce.angular-socialshare'
]).config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/jogo.html',
            controller: 'jogoCtrl',
            reloadOnSearch: false
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);

angular.module('nome').run(function($rootScope) {
    //$rootScope.serverAddress = "http://localhost:80/"
    $rootScope.serverAddress = "https://totonome.herokuapp.com/";
});

angular.module('nome').config(function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
});