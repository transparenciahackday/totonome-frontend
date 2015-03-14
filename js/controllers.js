angular.module('nome.controllers', [])
    .controller('jogoCtrl', ["$scope", "Rest", "$timeout",
        function($scope, Rest, $timeout) {
            $scope.pontuacao = 0;
            $scope.total = -1;
            $scope.sorteado1 = ""
            $scope.sorteado2 = ""

            $scope.vidas = 3

            $scope.ultimo1 = ""
            $scope.ultimo2 = ""

            Rest.getInitialWords().then(
                function(data){
                    $scope.sorteado1 = data.word1;
                    $scope.sorteado2 = data.word2;
                    $scope.ultimo1 = data.word1;
                    $scope.ultimo2 = data.word2;
                },
                function(data){}
                )

            $scope.clicked = function(number){
                if($scope.blocked) return
                else
                    $scope.blocked = true

                if(number == 0){selectedWord = $scope.sorteado1}
                else{selectedWord = $scope.sorteado2}

                Rest.postAnswer(selectedWord, $scope.sorteado1, $scope.sorteado2).then(
                    function(data){
                        if(data.answer){
                            $("body").css("background-color","green");
                            $scope.pontuacao += 1;
                        }
                        else{
                            $("body").css("background-color","red");
                            $scope.vidas -= 1
                            // se vidas < 0 então temos de fazer qualquer coisa
                        }

                        if ($scope.total == -1) {
                            $scope.total = 1;
                        }
                        else{
                            $scope.total += 1;
                        }

                        $timeout(function() {
                            $("body").css("background-color","white");
                            $scope.ultimo1 = $scope.sorteado1;
                            $scope.ultimo2 = $scope.sorteado2;
                            $scope.sorteado1 = data.word1;
                            $scope.sorteado2 = data.word2;
                            $scope.blocked = false
                        }, 200);
                    },
                    function(data){

                    }
                    )
            }
        }
    ]);