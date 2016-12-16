
Opening = {

    Sound_Opening: new Audio("/assets/media/opening.wav"),

    Ready: function () {
 
        Game.Initialize();
        Opening.Sound_Opening.play();

    },
     
}
 
$(document).ready(Opening.Ready);
