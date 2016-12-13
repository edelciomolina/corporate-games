Game = {

    Config: null,
    AnimationWaitKey: null,
    WaitKeys: [],

    Initialize: function (args) {

        Game.Config = args;

        $.getJSON("/data/config.json", function (config) {

            $.getJSON(Game.Config.configPath, function (data) {

                document.title = Game.Config.title;

                //preparando evento para controle dos slides
                var listener = new window.keypress.Listener();

                for (var i = 0; i < Game.Config.keys.length; i++) {

                    var key = Game.Config.keys[i];
                    var img = key.img || '/img/enter.png';

                    Game.WaitKeys[key.key] = false;

                    listener.simple_combo(key.key, function (a, c) {
                         
                        if (Game.WaitKeys[key.key]) {

                            Game.WaitKeys[key.key] = false;
                            key.fcn()

                        }

                    });

                }
          

                //removendo ponteiro do mouse
                $('*').css({ 'cursor': 'none' });

                //efeito de atenção para waitkey  
                setInterval(function () {

                    if (Game.WaitKeys['enter']) {

                        Game.CheckWaitKey();
                        $('.img-waitkey:not(:visible)').fadeIn();

                    } else {

                        clearInterval(Game.AnimationWaitKey);
                        Game.AnimationWaitKey = null;
                        $('.img-waitkey:visible').fadeOut();

                    }

                }, 100);

                data.gameData = data;
                if (Game.Config.Start) Game.Config.Start(data);

            });

        });

    },

    WaitKey: function(key, state){

        debugger;

        var state = state || true;

        Game.WaitKeys[key] = state;

    },

    CheckWaitKey: function () {

        if (Game.AnimationWaitKey == null || typeof Game.AnimationWaitKey == 'undefined') {
            Game.AnimationWaitKey = setInterval(function () {
                if (new Date().getTime() % 2 == 1) {
                    $('.img-waitkey:visible').animateCSS('tada');
                } else {
                    $('.img-waitkey:visible').animateCSS('shake');
                }
            }, 8000);
        }
    },
     
}