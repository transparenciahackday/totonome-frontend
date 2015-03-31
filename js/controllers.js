angular.module('nome.controllers', [])
    .controller('jogoCtrl', ["$scope", "Rest", "$timeout", "$routeParams", "$location", "$window", "$interval",
        function($scope, Rest, $timeout, $routeParams, $location, $window, $interval) {

            var correct = new Audio('../sounds/correct.mp3');
            var wrong = new Audio('../sounds/wrong.mp3');

            $scope.connecting = false;

            $scope.soundOn = false;
            $scope.changeSound = function(){
                $scope.soundOn = !$scope.soundOn;
            }

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

            // comentar este if todo para fazer aparecer o "ligar o servidor"

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

            var lastLink = $location.absUrl();
            $scope.challengeTwitter = function(){
                var challengeLink = "https://twitter.com/intent/tweet?";
                challengeLink += "original_referer=" + encodeURIComponent( lastLink ) +"&";
                challengeLink += "text="+ encodeURIComponent( "Qual destes nomes foi aprovado? " + $scope.ultimo1 + " ou " + $scope.ultimo2 ) +"?"+encodeURIComponent( "#TotoNome" )+ "&";
                challengeLink += "tw_p=tweetbutton&";
                challengeLink += "url="+ encodeURIComponent( lastLink );
                window.open(challengeLink,'','Toolbar=1,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0,Width=550,Height=400')
            }
            $scope.challengeMail = function(){
                var link = "mailto:?subject=";
                link += encodeURIComponent( "Qual destes nomes foi aprovado? " + $scope.ultimo1 + " ou " + $scope.ultimo2 ) +"? (TotoNome)";
                link += "&body=";
                link += encodeURIComponent( lastLink );
                window.open(link,'','Toolbar=1,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0,Width=550,Height=400')
            }
            $scope.challengeFacebook = function(){
                var link = "https://www.facebook.com/sharer/sharer.php?u="+ encodeURIComponent( lastLink );
                window.open(link,'','Toolbar=1,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0,Width=550,Height=400')
            }
            $scope.scoreTwitter = function(){
                var challengeLink = "https://twitter.com/intent/tweet?";
                challengeLink += "original_referer=" + encodeURIComponent( "http://" + $location.host() ) +"&";
                challengeLink += "text="+ encodeURIComponent( "Consegui " + $scope.pontuacao + " pontos! E tu, quantos consegues?" ) +encodeURIComponent( "#TotoNome" )+ "&";
                challengeLink += "tw_p=tweetbutton&";
                challengeLink += "url="+ encodeURIComponent( "http://" + $location.host() );
                window.open(challengeLink,'','Toolbar=1,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0,Width=550,Height=400')
            }
            $scope.scoreEmail = function(){
                var link = "mailto:?subject=";
                link += encodeURIComponent( "Consegui " + $scope.pontuacao + " pontos! E tu, quantos consegues? (TotoNome)" );
                link += "&body=";
                link += encodeURIComponent( "http://" + $location.host() );
                window.open(link,'','Toolbar=1,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0,Width=550,Height=400')
            }
            $scope.scoreFacebook = function(){
                var link = "https://www.facebook.com/sharer/sharer.php?u="+ encodeURIComponent( "http://" + $location.host() );
                window.open(link,'','Toolbar=1,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0,Width=550,Height=400')
            }

            $scope.ultimaRespostaCorrecta = '';
            $scope.clicked = function(number){
                if($scope.blocked) return
                else $scope.blocked = true

                if(number == 0){$scope.selectedWord = $scope.sorteado1}
                else{$scope.selectedWord = $scope.sorteado2}

                Rest.postAnswer($scope.selectedWord, $scope.sorteado1, $scope.sorteado2).then(
                    function(data){
                        lastLink = $location.absUrl();

                        if(data.answer){
                            $("body").css("background-color","#91e49e");
                            $scope.pontuacao += 100;
                            $scope.venceuUltimo = true;
                            $scope.ultimaRespostaCorrecta = $scope.selectedWord;
                            if($scope.soundOn){
                                correct.play();
                            }
                        }
                        else{
                            if($scope.soundOn){
                                wrong.play();
                            }
                            $("body").css("background-color","#f48a71");
                            $scope.venceuUltimo = false;
                            $scope.vidas -= 1

                            if($scope.selectedWord==$scope.sorteado1){
                                $scope.ultimaRespostaCorrecta = $scope.sorteado2;
                            } else {
                                $scope.ultimaRespostaCorrecta = $scope.sorteado1;
                            }

                            if ($scope.vidas <= 0) {
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
            var waited = 0;
            var interval;

            $scope.stopInterval = function(){
                $interval.cancel(interval);
            };

            interval =  $interval(function() {
                if(waited > 1000){
                    if($routeParams.nome1){
                        $scope.stopInterval();
                    }
                    else{
                        $scope.connecting = true;
                    }
                }
                waited += 100;
            }, 100);

            $scope.$on('$destroy', function() {
                $scope.stopInterval();
            });
        }
    ]);