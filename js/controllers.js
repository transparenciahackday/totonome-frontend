angular.module('nome.controllers', [])
    .controller('jogoCtrl', ["$scope", "Rest", "$timeout", "$routeParams", "$location", "$window",
        function($scope, Rest, $timeout, $routeParams, $location, $window) {

            var correct = new Audio('../sounds/correct.mp3');
            var wrong = new Audio('../sounds/wrong.mp3');

            $scope.range = function(n) {
                return new Array(n);
            };

            var nome1 = $routeParams.nome1 || null;
            var nome2 = $routeParams.nome2 || null;
            if(nome2){
                nome2 = nome2.replace("/","");
            }

            $scope.$watch('sorteado1', function() {
                $location.search('nome1', $scope.sorteado1);
            });

            $scope.$watch('sorteado2', function() {
                $location.search('nome2', $scope.sorteado2);
            });

            $scope.reload = function() {
                $window.location.reload();
            };

            // ao fechar o modal temos que re-iniciar o jogo
            $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
                $scope.reload();
            });

            $scope.pontuacao = 0;
            $scope.total = -1;
            $scope.sorteado1 = "";
            $scope.sorteado2 = "";

            $scope.vidasIniciais = 3;
            $scope.vidas = $scope.vidasIniciais;

            $scope.ultimo1 = "";
            $scope.ultimo2 = "";
            $scope.venceuUltimo = false;

            if (!nome1 || !nome2) {
                Rest.getInitialWords().then(
                    function (data) {
                        $scope.sorteado1 = data.word1;
                        $scope.sorteado2 = data.word2;
                        $scope.ultimo1 = data.word1;
                        $scope.ultimo2 = data.word2;
                    },
                    function (data) {
                    }
                )
            } else {
                $scope.sorteado1 = nome1;
                $scope.sorteado2 = nome2;
            }

            $scope.ultimaRespostaCorrecta = '';
            $scope.clicked = function(number){
                if($scope.blocked) return
                else $scope.blocked = true

                if(number == 0){$scope.selectedWord = $scope.sorteado1}
                else{$scope.selectedWord = $scope.sorteado2}

                Rest.postAnswer($scope.selectedWord, $scope.sorteado1, $scope.sorteado2).then(
                    function(data){
                        // acende a resposta correcta

                        $scope.challengeLink = "https://twitter.com/intent/tweet?";
                        $scope.challengeLink += "original_referer=" + encodeURIComponent( $location.absUrl() ) +"&";
                        $scope.challengeLink += "text="+ encodeURIComponent( "Qual é o nome correcto? " + $scope.sorteado1 + " ou " + $scope.sorteado2 ) +"&";
                        $scope.challengeLink += "tw_p=tweetbutton&";
                        $scope.challengeLink += "url="+ encodeURIComponent( $location.absUrl() ) +"&";
                        $scope.challengeLink += "via=totonome";

                        if(data.answer){
                            $("body").css("background-color","#91e49e");
                            $scope.pontuacao += 100;
                            $scope.venceuUltimo = true;
                            $scope.ultimaRespostaCorrecta = $scope.selectedWord;
                            correct.play();
                        }
                        else{
                            wrong.play();
                            $("body").css("background-color","#f48a71");
                            $scope.venceuUltimo = false;
                            $scope.vidas -= 1

                            if($scope.selectedWord==$scope.sorteado1){
                                $scope.ultimaRespostaCorrecta = $scope.sorteado2;
                            } else {
                                $scope.ultimaRespostaCorrecta = $scope.sorteado1;
                            }

                            if ($scope.vidas <= 0) {
                                console.log($location.absUrl());
                                console.log($location.host());
                                $scope.scoreLink = "https://twitter.com/intent/tweet?";
                                $scope.scoreLink += "original_referer=" + encodeURIComponent( "http://" + $location.host() ) +"&";
                                $scope.scoreLink += "text="+ encodeURIComponent( "Consegui " + $scope.pontuacao + " pontos! E tu, quantos consegues?" ) +"&";
                                $scope.scoreLink += "tw_p=tweetbutton&";
                                $scope.scoreLink += "url="+ encodeURIComponent( "http://" + $location.host() ) +"&";
                                $scope.scoreLink += "via=totonome";
                                $('#myModal').foundation('reveal', 'open');
                            }
                        }

                        if ($scope.total == -1) {
                            $scope.total = 1;
                        }
                        else{
                            $scope.total += 1;
                        }

                        $timeout(function() {
                            $("body").css("background-color","#f5d48d");
                            $scope.ultimo1 = $scope.sorteado1;
                            $scope.ultimo2 = $scope.sorteado2;
                            $scope.sorteado1 = data.word1;
                            $scope.sorteado2 = data.word2;
                            $scope.ultimaRespostaCorrecta = '';
                            // reset aos botões
                            if($scope.vidas>0) $scope.blocked = false
                        }, 500);
                    },
                    function(data){

                    }
                )
            }
        }
    ]);