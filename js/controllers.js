angular.module('nome.controllers', [])
    .controller('jogoCtrl', ["$scope", "Dados", "$timeout",
        function($scope, Dados, $timeout) {
            $scope.nomes = [];
            $scope.posicao = -1;
            $scope.pontuacao = 0;
            $scope.total = -1;
            $scope.aceites = []
            $scope.naoaceites = []

            var sortearNovo = function(){
                    var posicaoDoAceite = Math.floor(Math.random() * 2);
                    $scope.posicao = posicaoDoAceite;
                    var sortearAceite = Math.floor(Math.random() * $scope.aceites.length);
                    var sortearNaoAceite = Math.floor(Math.random() * $scope.naoaceites.length);
                    if (posicaoDoAceite == 0) {
                        $scope.sorteado1 = $scope.aceites[sortearAceite];
                        $scope.sorteado2 = $scope.naoaceites[sortearNaoAceite];
                    }
                    else{
                        $scope.sorteado2 = $scope.aceites[sortearAceite];
                        $scope.sorteado1 = $scope.naoaceites[sortearNaoAceite];
                    }
            }

            Dados.getDados().then(
                function(data) {
                    // a partir daqui já temos os dados podemos começar a brincar
                    $scope.aceites = data[0]
                    $scope.naoaceites = data[1]
                    sortearNovo();
                },
                function(error) {

                }
            );

            $scope.clicked = function(number){
                if($scope.posicao == number){
                    $("body").css("background-color","green");
                    $scope.pontuacao += 1;
                }
                else{
                    $("body").css("background-color","red");
                }

                if ($scope.total == -1) {
                    $scope.total = 1;
                }
                else{
                    $scope.total += 1;
                }

                $timeout(function() {
                    $("body").css("background-color","white");
                    sortearNovo();
                }, 200);
            }
        }
    ]);