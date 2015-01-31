'use strict';

/* Services */
angular.module('nome.services', [])
    .factory('Rest', ["$http", "$q", "$rootScope",
        function($http, $q, $rootScope) {
            return {
                getInitialWords: function() {
                    var deferred = $q.defer();
					$http.get($rootScope.serverAddress+'word/').success(function(data) {
                        deferred.resolve(data);
                    }).error(function(data) {
                        deferred.reject(data);
                    });

                    return deferred.promise;
                },
                postAnswer: function(selectedWord, word1, word2){
                    var deferred = $q.defer();

                    var config = {
                        "selectedWord": selectedWord,
                        "word1": word1,
                        "word2": word2
                    };

                	$http.post( $rootScope.serverAddress + 'word/', config).success(function(data) {
                        deferred.resolve(data);
                    }).error(function(data) {
                        deferred.reject(data);
                    });

                    return deferred.promise;
                }
            }
        }
    ]);