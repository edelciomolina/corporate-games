Game = {

    Config: null,
    AnimationWaitKey: null,
    ListenerWaitKey: null,
    Config: null,

    Initialize: function (args) {

        Game.Config = args;

        Game.UpdateGameData(function (data) {

            document.title = Game.Config.title;

            //removendo ponteiro do mouse
            $('*').css({ 'cursor': 'none' });

            if (Game.Config.Start) Game.Config.Start(data);

        });


    },

    UpdateGameData: function (callback) {

        $.getJSON("/data/config.json", function (config) {

            Game.Config.data = config;

            $.getJSON(Game.Config.configPath, function (data) {

                if (callback) callback(data);

            });

        });

    },

    WaitKey: function (key, callback) {

        try { Game.ListenerWaitKey.reset(); } catch (e) { }
        Game.ListenerWaitKey = new window.keypress.Listener();

        setTimeout(function () {

            $('.img-waitkey:not(:visible)').fadeIn();
            Game.ListenerWaitKey.simple_combo(key, function (a, c) {

                Game.ListenerWaitKey.unregister_combo(key);

                $('.img-waitkey:visible').fadeOut();
                if (callback) callback();

            });

        }, 1000)

    },

    Screen: function (screenName) {

        var objectScreen = {

            Prepare: function () {

                $('screen').hide();
                $('screen#' + screenName + ' element').hide();
                $('screen#' + screenName + '').show();
                $('body').show();
                return objectScreen;

            },

            Element: function (elementName) {

                return $('screen#' + screenName + ' element#' + elementName + '');

            }

        }

        return objectScreen;

    }

}