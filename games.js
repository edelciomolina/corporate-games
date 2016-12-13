Game = {

    Config: null,
    AnimationWaitKey: null, 
    Config: null,

    Initialize: function (args) {

        Game.Config = args;

        $.getJSON("/data/config.json", function (config) {

            $.getJSON(Game.Config.configPath, function (data) {

                document.title = Game.Config.title;

                //removendo ponteiro do mouse
                $('*').css({ 'cursor': 'none' });
                 
                data.gameData = data;
                if (Game.Config.Start) Game.Config.Start(data);

            });

        });

    },

    WaitKey: function (key, callback) {

        $('.img-waitkey:not(:visible)').fadeIn();
        var listener = new window.keypress.Listener(); 
        listener.simple_combo(key, function (a, c) {

            $('.img-waitkey:visible').fadeOut();
            if (callback) callback();

        });
         
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