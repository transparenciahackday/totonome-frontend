angular.module('nome.controllers', [])
    .controller('jogoCtrl', ["$scope", "Dados",
        function($scope, Dados) {
            $scope.nomes = [];
            Dados.getDados().then(
                function(data) {
                    // a partir daqui já temos os dados podemos começar a brincar
                    $scope.aceites = data[0]
                    $scope.naoaceites = data[1]

                    var posicaoDoAceite = Math.floor(Math.random() * 2);
                    $scope.posicao = posicaoDoAceite

                    // sortear o primeiro
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
                },
                function(error) {

                }
            );
        }
    ]);