
Game = {

    Sound_Music: new Audio("media/intro.wav"),
    Sound_Counter: new Audio("media/intesity.wav"),
    Sound_Bells: new Audio("media/bells.wav"),
    Sound_Ready: new Audio("media/ready.wav"),
    Sound_Drum: new Audio("media/drum.wav"),
    Animation: null,
    AnimationWaitKey: null,
    QuestionNumber: 0,
    WaitOk: false,
    Slide: -1,
    Timeout: 0,
    Paused: false,
    QuestionAtual: 1,
    QuestionCateg: 0,
    Questions: null,

    Ready: function () {

        $.getJSON("/data/questions.json", function (data) {

            Game.Questions = data;

            document.title = "Game On";
            Game.ChangeQuestion();


            //preparando evento para controle dos slides
            var listener = new window.keypress.Listener();
            listener.simple_combo("enter", function (a, c) {

                if (Game.WaitOk) {

                    Game.WaitOk = false;
                    Game.NextStage();

                }

            });

            //removendo ponteiro do mouse
            $('*').css({ 'cursor': 'none' });

            //efeito de atenção para waitkey  
            setInterval(function () {

                clearInterval(Game.AnimationWaitKey);

                if (Game.WaitOk) {

                    $('.img-waitkey').fadeIn();

                    Game.AnimationWaitKey = setInterval(function () {
                        if (new Date().getTime() % 2 == 1) {
                            $('.img-waitkey:visible').animateCSS('tada');
                        } else {
                            $('.img-waitkey:visible').animateCSS('shake');
                        }
                    }, 5000);

                } else {

                    $('.img-waitkey').fadeOut();

                }

            }, 100);

            Game.NextStage();

        });


    },

    NextStage: function (a, c) {

        Game.Slide += 1;
        Game.Change(a, c);

    },

    Clean: function () {

        Game.Sound_Music.pause();
        Game.Sound_Counter.pause();
        Game.Sound_Bells.pause();
        Game.Sound_Ready.pause();

        var elems = $('.hidden:visible');
        elems.animateCSS('fadeOut', function () {

            elems.hide();

        });

    },

    ChangeQuestion: function () {

        try {

            if (Game.QuestionAtual % 6 == 0) {

                Game.QuestionAtual = 1;
                Game.QuestionCateg += 1;

            }

            var Group = Game.Questions.themes[Game.QuestionCateg];
            var Question = Game.Questions.themes[Game.QuestionCateg].questions[(Game.QuestionAtual - 1)];
            var Resposta = Game.Questions.themes[Game.QuestionCateg].questions[(Game.QuestionAtual - 1)].result;
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

            Game.QuestionAtual += 1;

        } catch (e) {

            Game.Slide = 0;
            Game.QuestionCateg = 1;
            Game.QuestionAtual = 1;
            Game.Change();

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

        Game.Sound_Ready.play();

        $('.span-counter-big').animateCustomCSS('rotateIn', { duration: 600 });
        $('.span-counter-big').text(3);
        setTimeout(function () {

            $('.span-counter-big').text(2);

            setTimeout(function () {

                if (!Game.Cancel) {

                    $('.span-counter-big').text(1);

                    setTimeout(function () {

                        $('.span-counter-big').animateCustomCSS('rotateOut', {
                            duration: 600, onComplete: function () {

                                $('.span-counter-big').hide();

                                callback();

                            }
                        });

                    }, 600);

                }

            }, 600);

        }, 600);

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


            if (!Game.Cancel) {

                var counter = function () {

                    setTimeout(function () {

                        if (!Game.Cancel) {

                            $('.span-counter').text($('.span-counter').text() - 1);
                            Game.Sound_Counter.play();

                            if ($('.span-counter').text() <= 0) {


                                $('.span-theme-title').animateCSS('bounceOutLeft', function () { $('.span-theme-title').hide(); });
                                $('.span-text-title').animateCSS('bounceOutLeft', function () { $('.span-text-title').hide(); });
                                $('.table-question').animateCSS('bounceOutUp', function () { $('.table-question').hide(); });
                                $('.img-circle').animateCSS('slideOutRight', function () { $('.img-circle').hide(); });
                                $('.span-counter').animateCSS('slideOutRight', function () { $('.span-counter').hide(); });

                                Game.Sound_Drum.play();

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

        if (!Game.Cancel) {

            $('.span-ready').animateCSS('zoomOut', function () {

                $('.span-ready').hide();

                Game.Sound_Bells.play();

                $('.span-resp-title, .span-resp-title2').animateCSS('fadeInLeftBig');
                $('.span-resp-text').animateCSS('fadeInDownBig', function () {

                    callback();

                });


            });


        }


    },

    Change: function () {
         
        setTimeout(function () {

            Game.Cancel = false;

            //eliminando musica de fundo se houver
            try {
                Game.Sound_Music.pause();
            } catch (e) { }

            //elimitando timer de animação e ocultando elementos visiveis
            clearInterval(Game.Animation);


            //identificando proxima tela
            switch (Game.Slide) {

                case 0: //abertura

                    var elems = $('.screen .item');
                    elems.hide();

                    Game.Sound_Music.loop = true;
                    Game.Sound_Music.play();

                    $('.img-title').animateCSS('bounceIn', 1000);
                    Game.Animation = setInterval(function () {

                        if (new Date().getTime() % 2 == 1) {
                            $('.img-title').animateCSS('rubberBand');
                        } else {
                            $('.img-title').animateCSS('tada');
                        }

                    }, 5000);

                    Game.WaitOk = true;

                    break;

                case 1: //mostrando a categoria e a pergunta

                    var elems = $('.screen .item');
                    elems.hide();

                    if (Game.QuestionAtual == 2) {

                        Game.ShowCategoria(function () {

                            Game.ShowTimerStart(function () {

                                Game.ShowQuestion(function () {

                                    Game.NextStage();

                                });

                            });

                        });


                    } else {

                        Game.ShowTimerStart(function () {

                            Game.ShowQuestion(function () {

                                Game.NextStage();

                            });

                        });

                    }

                    break;

                case 2: //mostrando as escolhas

                    Game.ShowChoices(function () {

                        Game.WaitOk = true;

                    });

                    break;

                case 3: //mostrando a resposta

                    Game.ShowAnswers(function () {

                        Game.WaitOk = true;

                    });

                    break;

                case 4: //ocultando a resposta

                    $('.span-resp-text').animateCSS('fadeOutRightBig', 1000, function (e) {
                        $(e).hide();
                    });
                    $('.span-resp-title, .span-resp-title2').animateCSS('fadeOutLeftBig', 1000, function (e) {

                        $(e).hide();

                        Game.Cancel = true;
                        Game.Slide = 1;
                        Game.ChangeQuestion();
                        Game.Change();

                    });

                    break;

                default:

            }


        }, 500);


    }


}


$(document).ready(Game.Ready);
