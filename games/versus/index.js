
Versus = {

    Sound_Music: new Audio("/assets/media/intro.wav"),
    Sound_Counter: new Audio("/assets/media/intesity.wav"),
    Sound_Bells: new Audio("/assets/media/bells.wav"),
    Sound_Ready: new Audio("/assets/media/ready.wav"),
    Sound_Drum: new Audio("/assets/media/drum.wav"),
    Serial: null,
    Animation: null,
    Config: null,
    StopCounter: null,
    Player1: 0,
    Player2: 1,
    Players: null,

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
        Versus.Sound_Music.loop = true;
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

            titleElement.animateCSS('zoomOut', function () {

                Versus.Player1 = Versus.Config.players[0];
                Versus.Player2 = Versus.Config.players[1];

                Versus.FrameIntro();

            });

        });

    },

    ChangePlayers: function () {

        try { Versus.KeysChangePlayers.reset(); } catch (e) { }
        Versus.KeysChangePlayers = new window.keypress.Listener();


        Versus.KeysChangePlayers.simple_combo('1', function () {
            Versus.Player1 = Versus.Config.players[0];
            Versus.SetPlayers(1);
        });
        Versus.KeysChangePlayers.simple_combo('2', function () {
            Versus.Player1 = Versus.Config.players[1];
            Versus.SetPlayers(1);
        });
        Versus.KeysChangePlayers.simple_combo('3', function () {
            Versus.Player1 = Versus.Config.players[2];
            Versus.SetPlayers(1);
        });
        Versus.KeysChangePlayers.simple_combo('4', function () {
            Versus.Player1 = Versus.Config.players[3];
            Versus.SetPlayers(1);
        });

        Versus.KeysChangePlayers.simple_combo('7', function () {
            Versus.Player2 = Versus.Config.players[0];
            Versus.SetPlayers(2);
        });
        Versus.KeysChangePlayers.simple_combo('8', function () {
            Versus.Player2 = Versus.Config.players[1];
            Versus.SetPlayers(2);
        });
        Versus.KeysChangePlayers.simple_combo('9', function () {
            Versus.Player2 = Versus.Config.players[2];
            Versus.SetPlayers(2);
        });
        Versus.KeysChangePlayers.simple_combo('0', function () {
            Versus.Player2 = Versus.Config.players[3];
            Versus.SetPlayers(2);
        });


    },

    SetPlayers: function (type) {

        Versus.ChangePlayers();

        var screen = Game.Screen('intro');
        var player1 = screen.Element('player1');
        var player2 = screen.Element('player2');

        if (type == 1) { player1.find('.photo').animateCSS('tada') }
        if (type == 2) { player2.find('.photo').animateCSS('tada') }

        player1.find('.photo img').attr('src', Versus.Player1.photo);
        player1.find('.name').text(Versus.Player1.name);
        player1.find('.team').text(Versus.Player1.team);

        player2.find('.photo img').attr('src', Versus.Player2.photo);
        player2.find('.name').text(Versus.Player2.name);
        player2.find('.team').text(Versus.Player2.team);

    },

    FrameIntro: function () {

        //preparing the frame and a element to use
        var screen = Game.Screen('intro').Prepare();
        var player1 = screen.Element('player1');
        var player2 = screen.Element('player2');
        var versus = screen.Element('versus');

        Versus.SetPlayers();

        player1.animateCSS('bounceInLeft', 1000);
        player2.animateCSS('bounceInRight', 1000);
        versus.animateCSS('zoomInDown', 1500);

        clearInterval(Versus.introAnimation)
        Versus.introAnimation = setInterval(function () {

            player1.animateCSS('bounce', Math.floor(Math.random() * 2000) + 500);
            player2.animateCSS('bounce', Math.floor(Math.random() * 2000) + 500);
            versus.animateCSS('jello', Math.floor(Math.random() * 4000) + 3000);

        }, 6000);

        Game.WaitKey('enter', function () {

            clearInterval(Versus.introAnimation);
            Versus.FrameCounter();

        })

    },

    FrameCounter: function () {

        var screenIntro = Game.Screen('intro');
        var player1 = screenIntro.Element('player1');
        var player2 = screenIntro.Element('player2');
        var versus = screenIntro.Element('versus');

        versus.animateCSS('zoomOut', 500, function () {
            versus.hide();
        });

        player2.animateCSS('bounceOutLeft', 1000, function () {
            player2.hide();
        });
        player1.animateCSS('bounceOutRight', 1000, function () {
            player1.hide();
        });

        setTimeout(function () {

            Versus.StartSerialRead()

            var screen = Game.Screen('counter').Prepare();
            var number = screen.Element('number');
            var spanNumber = number.find('.span-counter-big');

            number.show();


            clearTimeout(Versus.TimeoutCounter);
            Versus.Sound_Ready.pause();
            Versus.Sound_Ready.currentTime = 0;
            Versus.Sound_Ready.play()

            spanNumber.text(3);
            spanNumber.animateCustomCSS('rotateIn', { duration: timeOut });

            var timeOut = 600;
            Versus.TimeoutCounter = setTimeout(function () {

                spanNumber.text(2);

                Versus.TimeoutCounter = setTimeout(function () {

                    spanNumber.text(1);

                    Versus.TimeoutCounter = setTimeout(function () {

                        spanNumber.animateCustomCSS('rotateOut', {
                            onComplete: function () {

                                spanNumber.hide();

                                Versus.FrameWaitWinner();

                            }
                        });

                    }, timeOut);


                }, timeOut);

            }, timeOut);

        }, 2000);


    },

    FrameWaitWinner: function () {

        var screenWait = Game.Screen('waitwinner').Prepare();
        var text = screenWait.Element('text');
        text.animateCSS('flash');

    },

    ShowDraw: function () {

        Versus.Sound_Ready.pause();
        Versus.Sound_Drum.play();

        var screenDraw = Game.Screen('draw').Prepare();
        var text = screenDraw.Element('text');
        text.animateCSS('flash');

        Game.WaitKey('enter', function () {
            Versus.FrameIntro();
        });

    },

    ShowBurn: function () {

        Versus.Sound_Ready.pause();
        Versus.Sound_Drum.play();

        var screenDraw = Game.Screen('burn').Prepare();
        var text = screenDraw.Element('text');
        text.animateCSS('flash');

        Game.WaitKey('enter', function () {
            Versus.FrameIntro();
        });

    },

    ShowWinner: function (winnerData) {

        Versus.Sound_Bells.play();

        var screenWait = Game.Screen('waitwinner');
        var text = screenWait.Element('text');

        var winner = screenWait.Element('winner');
        var textWinner = screenWait.Element('textWinner');


        text.animateCSS('zoomOut', function () {

            text.hide();

            winner.find('.photo img').attr('src', winnerData.photo);
            winner.find('.name').text(winnerData.name);
            winner.find('.team').text(winnerData.team);

            textWinner.animateCSS('zoomInDown', 0);
            winner.animateCSS('zoomInUp', 300);

            Game.WaitKey('enter', function () {
                Versus.FrameIntro();
            });

        });

    },

    StartSerialRead: function () {

        var screenWait = Game.Screen('waitwinner');
        var text = screenWait.Element('text');

        //creating the serial object
        var SerialPort = require('serial-node');
        Versus.Serial = new SerialPort();

        //prevent the closing and stopping serial reading
        var win = require('nw.gui').Window.get();
        win.on('close', function () {
            Versus.Serial.stop();
        });

        //setting use with config arguments and callback functions
        Versus.Serial.use(Versus.Config.serial.port, {
            baud: Versus.Config.serial.baud,
            callbackUse: function (args) {

                if (args.state) {

                    //reading serial in looping
                    Versus.Serial.read(true);

                } else {

                    alert(args.error + '\n\n' + 'Go to the Device Manager into Windows and try change or disable and enable the COM port and try again.');
                    location.href = location.href;

                }

            },
            callbackRead: function (args) {

                //my rules to accept data when the serial data was like: @6:0!
                var read = args.value.trim() || '';
                if (read.startsWith('@') && read.endsWith('!') && read.length == 5) {

                    console.log(read);

                    switch (true) {

                        case (read == Versus.Player1.serialkey && text.is(':visible')):
                            Versus.Serial.stop();
                            Versus.ShowWinner(Versus.Player1);
                            break;

                        case (read == Versus.Player2.serialkey && text.is(':visible')):
                            Versus.Serial.stop(); 
                            Versus.ShowWinner(Versus.Player2);
                            break;

                        case (read == '@0:0!' && text.is(':visible')):
                            Versus.Serial.stop();
                            clearTimeout(Versus.TimeoutCounter);
                            Versus.ShowDraw();
                            break;

                        case (read != '@6:0!' && !text.is(':visible')):
                            Versus.Serial.stop();
                            clearTimeout(Versus.TimeoutCounter);
                            Versus.ShowBurn();
                            break;
                    }

                    //show the useful data
                    console.log(read);

                }

            }

        });


    }

}

$(document).ready(Versus.Ready);
