
Versus = {

    Sound_Music: new Audio("/assets/media/intro.wav"),
    Sound_Counter: new Audio("/assets/media/intesity.wav"),
    Sound_Bells: new Audio("/assets/media/bells.wav"),
    Sound_Ready: new Audio("/assets/media/ready.wav"),
    Sound_Drum: new Audio("/assets/media/drum.wav"),
    Animation: null,
    Config: null,

    Ready: function () {

        Game.Initialize({
            title: "Versus",
            configPath: "/data/versus.json",
            Start: Versus.Start
        });

    },

    Start: function (data) {

        Versus.Config = data;
        Versus.FrameOpening();

    },

    FrameOpening: function () {

        //preparing the frame and a element to use
        var screen = Game.Screen('opening').Prepare();
        var titleElement = screen.Element('title');

        //stating sound effects
        //Versus.Sound_Music.loop = true;
        //Versus.Sound_Music.play();

        //animating elements
        titleElement.animateCSS('bounceIn', 1000);
        Versus.Animation = setInterval(function () {

            if (new Date().getTime() % 2 == 1) {
                titleElement.animateCSS('rubberBand');
            } else {
                titleElement.animateCSS('tada');
            }

        }, 5000);

        //waiting for a key
        Game.WaitKey('enter', function () {

            titleElement.animateCSS('fadeOut', function () {

                Versus.FrameIntro();

            });

        });

    },

    FrameIntro: function () {

        //preparing the frame and a element to use
        var screen = Game.Screen('intro').Prepare();
        var player1 = screen.Element('player1');
        var player2 = screen.Element('player2');
        var versus = screen.Element('versus');


        player1.find('.photo img').attr('src', Versus.Config.player1.photo);
        player1.find('.name').text(Versus.Config.player1.name);
        player1.find('.team').text(Versus.Config.player1.team);

        player2.find('.photo img').attr('src', Versus.Config.player2.photo);
        player2.find('.name').text(Versus.Config.player2.name);
        player2.find('.team').text(Versus.Config.player2.team);

        player1.animateCSS('bounceInLeft', 1000);
        player2.animateCSS('bounceInRight', 1000);
        versus.animateCSS('zoomInDown', 1500);

        var introAnimation = setInterval(function () {

            player1.animateCSS('bounce', Math.floor(Math.random() * 2000) + 500);
            player2.animateCSS('bounce', Math.floor(Math.random() * 2000) + 500);
            versus.animateCSS('jello', Math.floor(Math.random() * 4000) + 3000);
             
        }, 6000);

    },

    FrameCounter: function () {

    },

    FrameWaitWinner: function () {

    },

    FrameDraw: function () {

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
