
Quiz = {

    Sound_Music: new Audio("/assets/media/intro.wav"),
    Sound_Counter: new Audio("/assets/media/intesity.wav"),
    Sound_Bells: new Audio("/assets/media/bells.wav"),
    Sound_Ready: new Audio("/assets/media/ready.wav"),
    Sound_Drum: new Audio("/assets/media/drum.wav"),
    Animation: null, 
    Slide: -1,
    QuestionAtual: 1,
    QuestionCateg: 0,
    Questions: null,

    Ready: function () {

        Game.Initialize({
            title: "Quiz",
            configPath: "/data/quiz.json",
            keys: [{
                "key": "enter",
                "img": "/img/enter.png",
                "fcn": Quiz.NextStage
            }],
            Start: Quiz.Start
        });

    },

    Start: function (data) {

        Quiz.Questions = data.themes;

        Game.WaitKey('enter', function(){
             
            Quiz.NextStage();
            Quiz.ChangeQuestion();

        });
    },

    NextStage: function (a, c) {

        Quiz.Slide += 1;
        Quiz.Change(a, c);

    },

    Clean: function () {

        Quiz.Sound_Music.pause();
        Quiz.Sound_Counter.pause();
        Quiz.Sound_Bells.pause();
        Quiz.Sound_Ready.pause();

        var elems = $('.hidden:visible');
        elems.animateCSS('fadeOut', function () {

            elems.hide();

        });

    },

    ChangeQuestion: function () {

        try {

            if (Quiz.QuestionAtual % 6 == 0) {

                Quiz.QuestionAtual = 1;
                Quiz.QuestionCateg += 1;

            }

            var Group = Quiz.Questions[Quiz.QuestionCateg];
            var Question = Quiz.Questions[Quiz.QuestionCateg].questions[(Quiz.QuestionAtual - 1)];
            var Resposta = Quiz.Questions[Quiz.QuestionCateg].questions[(Quiz.QuestionAtual - 1)].result;
            var RespostaL = (Resposta == 1 ? 'A' : Resposta == 2 ? 'B' : Resposta == 3 ? 'C' : 'D');
            var RespostaM = Question.answers[Resposta];

            $('.span-theme-big').text(Group.name);
            $('.span-theme-title').text(Group.name);
            $('.span-text-titleT').text(Question.message);
            $('.question-a2').text(Question.answers[0]);
            $('.question-b2').text(Question.answers[1]);
            $('.question-c2').text(Question.answers[2]);
            $('.question-d2').text(Question.answers[3]);

            $('.span-resp-text').text(RespostaL);
            $('.span-resp-title').text("");
            $('.span-resp-title2').text(RespostaM);

            Quiz.QuestionAtual += 1;

        } catch (e) {

            Quiz.Slide = 0;
            Quiz.QuestionCateg = 1;
            Quiz.QuestionAtual = 1;
            Quiz.Change();

        }

    },

    ShowCategoria: function (callback) {

        $('.span-theme-big').animateCSS('fadeInDownBig', function () {

            $('.span-theme-big').animateCSS('fadeOutUpBig', 3000, function () {

                $('.span-theme-big').hide();

                callback();

            });

        });


    },

    ShowTimerStart: function (callback) {

        Quiz.Sound_Ready.play();

        var timeOut = 600;

        $('.span-counter-big').text(3);
        $('.span-counter-big').animateCustomCSS('rotateIn', { duration: timeOut });

        setTimeout(function () {

            $('.span-counter-big').text(2);

            setTimeout(function () {

                if (!Quiz.Cancel) {

                    $('.span-counter-big').text(1);

                    setTimeout(function () {

                        $('.span-counter-big').animateCustomCSS('rotateOut', {
                            onComplete: function () {

                                $('.span-counter-big').hide();

                                callback();

                            }
                        });

                    }, timeOut);

                }

            }, timeOut);

        }, timeOut);

    },

    ShowQuestion: function (callback) {

        $('.span-theme-title').animateCSS('bounceInLeft', function () {
            $('.span-text-title').animateCSS('bounceInLeft', function () {

                $('.span-theme-title').show();
                $('.span-text-title').show();

                callback();

            });
        });

    },

    ShowChoices: function (callback) {

        $('.table-question').animateCSS('bounceInUp', function () {
            $('.table-question').show();
        });

        $('.img-circle').animateCSS('slideInRight');
        $('.span-counter').animateCSS('slideInRight');

        $('.span-counter').text(10);
        setTimeout(function () {


            if (!Quiz.Cancel) {

                var counter = function () {

                    setTimeout(function () {

                        if (!Quiz.Cancel) {

                            $('.span-counter').text($('.span-counter').text() - 1);
                            Quiz.Sound_Counter.play();

                            if ($('.span-counter').text() <= 0) {


                                $('.span-theme-title').animateCSS('bounceOutLeft', function () { $('.span-theme-title').hide(); });
                                $('.span-text-title').animateCSS('bounceOutLeft', function () { $('.span-text-title').hide(); });
                                $('.table-question').animateCSS('bounceOutUp', function () { $('.table-question').hide(); });
                                $('.img-circle').animateCSS('slideOutRight', function () { $('.img-circle').hide(); });
                                $('.span-counter').animateCSS('slideOutRight', function () { $('.span-counter').hide(); });

                                Quiz.Sound_Drum.play();

                                $('.span-ready').animateCSS('zoomIn');
                                callback();

                            } else {

                                counter();

                            }

                        }

                    }, 1000);

                }
                counter();

            }
        }, 1000);


    },

    ShowAnswers: function (callback) {

        if (!Quiz.Cancel) {

            $('.span-ready').animateCSS('zoomOut', function () {

                $('.span-ready').hide();

                Quiz.Sound_Bells.play();

                $('.span-resp-title, .span-resp-title2').animateCSS('fadeInLeftBig');
                $('.span-resp-text').animateCSS('fadeInDownBig', function () {

                    callback();

                });


            });


        }


    },

    Change: function () {

        setTimeout(function () {

            Quiz.Cancel = false;

            //eliminando musica de fundo se houver
            try {
                Quiz.Sound_Music.pause();
            } catch (e) { }

            //elimitando timer de animação e ocultando elementos visiveis
            clearInterval(Quiz.Animation);


            //identificando proxima tela
            switch (Quiz.Slide) {

                case 0: //abertura

                    var elems = $('.screen .item');
                    elems.hide();

                    Quiz.Sound_Music.loop = true;
                    Quiz.Sound_Music.play();

                    $('.img-title').animateCSS('bounceIn', 1000);
                    Quiz.Animation = setInterval(function () {

                        if (new Date().getTime() % 2 == 1) {
                            $('.img-title').animateCSS('rubberBand');
                        } else {
                            $('.img-title').animateCSS('tada');
                        }

                    }, 5000);


                    Game.WaitKey('enter', function () {
                        Quiz.NextStage(); 
                    });

                    break;

                case 1: //mostrando a categoria e a pergunta

                    var elems = $('.screen .item');
                    elems.hide();

                    if (Quiz.QuestionAtual == 2) {

                        Quiz.ShowCategoria(function () {

                            Quiz.ShowTimerStart(function () {

                                Quiz.ShowQuestion(function () {

                                    Quiz.NextStage();

                                });

                            });

                        });


                    } else {

                        Quiz.ShowTimerStart(function () {

                            Quiz.ShowQuestion(function () {

                                Quiz.NextStage();

                            });

                        });

                    }

                    break;

                case 2: //mostrando as escolhas

                    Quiz.ShowChoices(function () {

                        Game.WaitKey('enter', function () {
                            Quiz.NextStage();
                        });

                    });

                    break;

                case 3: //mostrando a resposta

                    Quiz.ShowAnswers(function () {

                        Game.WaitKey('enter', function () {
                            Quiz.NextStage();
                        });

                    });

                    break;

                case 4: //ocultando a resposta

                    $('.span-resp-text').animateCSS('fadeOutRightBig', 1000, function (e) {
                        $(e).hide();
                    });
                    $('.span-resp-title, .span-resp-title2').animateCSS('fadeOutLeftBig', 1000, function (e) {

                        $(e).hide();

                        Quiz.Cancel = true;
                        Quiz.Slide = 1;
                        Quiz.ChangeQuestion();
                        Quiz.Change();

                    });

                    break;

                default:

            }


        }, 500);


    }


}

$(document).ready(Quiz.Ready);
