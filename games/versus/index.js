
Versus = {

    Sound_Music: new Audio("/media/intro.wav"),
    Sound_Counter: new Audio("/media/intesity.wav"),
    Sound_Bells: new Audio("/media/bells.wav"),
    Sound_Ready: new Audio("/media/ready.wav"),
    Sound_Drum: new Audio("/media/drum.wav"),
    Animation: null,
    Slide: -1,
    QuestionAtual: 1,
    QuestionCateg: 0,
    Questions: null,

    Ready: function () {

        Game.Initialize({
            title: "Quiz",
            configPath: "/data/Versus.json",
            keys: [{
                "key": "enter",
                "img": "/img/enter.png",
                "fcn": Versus.NextStage
            }],
            Start: Versus.Start
        });

    },

    Start: function (data) {

        Versus.Questions = data.themes;

        Versus.NextStage();
        Versus.ChangeQuestion();
        Game.WaitKey('enter');
    },

    NextStage: function (a, c) {

        Versus.Slide += 1;
        Versus.Change(a, c);

    },

    Clean: function () {

        Versus.Sound_Music.pause();
        Versus.Sound_Counter.pause();
        Versus.Sound_Bells.pause();
        Versus.Sound_Ready.pause();

        var elems = $('.hidden:visible');
        elems.animateCSS('fadeOut', function () {

            elems.hide();

        });

    },

    ChangeQuestion: function () {

        try {

            if (Versus.QuestionAtual % 6 == 0) {

                Versus.QuestionAtual = 1;
                Versus.QuestionCateg += 1;

            }

            var Group = Versus.Questions[Versus.QuestionCateg];
            var Question = Versus.Questions[Versus.QuestionCateg].questions[(Versus.QuestionAtual - 1)];
            var Resposta = Versus.Questions[Versus.QuestionCateg].questions[(Versus.QuestionAtual - 1)].result;
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

            Versus.QuestionAtual += 1;

        } catch (e) {

            Versus.Slide = 0;
            Versus.QuestionCateg = 1;
            Versus.QuestionAtual = 1;
            Versus.Change();

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

        Versus.Sound_Ready.play();

        var timeOut = 600;

        $('.span-counter-big').text(3);
        $('.span-counter-big').animateCustomCSS('rotateIn', { duration: timeOut });

        setTimeout(function () {

            $('.span-counter-big').text(2);

            setTimeout(function () {

                if (!Versus.Cancel) {

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


            if (!Versus.Cancel) {

                var counter = function () {

                    setTimeout(function () {

                        if (!Versus.Cancel) {

                            $('.span-counter').text($('.span-counter').text() - 1);
                            Versus.Sound_Counter.play();

                            if ($('.span-counter').text() <= 0) {


                                $('.span-theme-title').animateCSS('bounceOutLeft', function () { $('.span-theme-title').hide(); });
                                $('.span-text-title').animateCSS('bounceOutLeft', function () { $('.span-text-title').hide(); });
                                $('.table-question').animateCSS('bounceOutUp', function () { $('.table-question').hide(); });
                                $('.img-circle').animateCSS('slideOutRight', function () { $('.img-circle').hide(); });
                                $('.span-counter').animateCSS('slideOutRight', function () { $('.span-counter').hide(); });

                                Versus.Sound_Drum.play();

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

        if (!Versus.Cancel) {

            $('.span-ready').animateCSS('zoomOut', function () {

                $('.span-ready').hide();

                Versus.Sound_Bells.play();

                $('.span-resp-title, .span-resp-title2').animateCSS('fadeInLeftBig');
                $('.span-resp-text').animateCSS('fadeInDownBig', function () {

                    callback();

                });


            });


        }


    },

    Change: function () {

        setTimeout(function () {

            Versus.Cancel = false;

            //eliminando musica de fundo se houver
            try {
                Versus.Sound_Music.pause();
            } catch (e) { }

            //elimitando timer de animação e ocultando elementos visiveis
            clearInterval(Versus.Animation);


            //identificando proxima tela
            switch (Versus.Slide) {

                case 0: //abertura

                    var elems = $('.screen .item');
                    elems.hide();

                    Versus.Sound_Music.loop = true;
                    Versus.Sound_Music.play();

                    $('.img-title').animateCSS('bounceIn', 1000);
                    Versus.Animation = setInterval(function () {

                        if (new Date().getTime() % 2 == 1) {
                            $('.img-title').animateCSS('rubberBand');
                        } else {
                            $('.img-title').animateCSS('tada');
                        }

                    }, 5000);

                    Game.WaitKey('enter');

                    break;

                case 1: //mostrando a categoria e a pergunta

                    var elems = $('.screen .item');
                    elems.hide();

                    if (Versus.QuestionAtual == 2) {

                        Versus.ShowCategoria(function () {

                            Versus.ShowTimerStart(function () {

                                Versus.ShowQuestion(function () {

                                    Versus.NextStage();

                                });

                            });

                        });


                    } else {

                        Versus.ShowTimerStart(function () {

                            Versus.ShowQuestion(function () {

                                Versus.NextStage();

                            });

                        });

                    }

                    break;

                case 2: //mostrando as escolhas

                    Versus.ShowChoices(function () {

                        Game.WaitKey('enter');

                    });

                    break;

                case 3: //mostrando a resposta

                    Versus.ShowAnswers(function () {

                        Game.WaitKey('enter');

                    });

                    break;

                case 4: //ocultando a resposta

                    $('.span-resp-text').animateCSS('fadeOutRightBig', 1000, function (e) {
                        $(e).hide();
                    });
                    $('.span-resp-title, .span-resp-title2').animateCSS('fadeOutLeftBig', 1000, function (e) {

                        $(e).hide();

                        Versus.Cancel = true;
                        Versus.Slide = 1;
                        Versus.ChangeQuestion();
                        Versus.Change();

                    });

                    break;

                default:

            }


        }, 500);


    }


}

$(document).ready(Versus.Ready);
