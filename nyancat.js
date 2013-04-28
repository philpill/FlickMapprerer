YUI({
    //Last Gallery Build of this module
    gallery: 'gallery-2012.06.20-20-07'
}).use('transition', 'node', 'gallery-audio', function (Y) {

	var konami = new Konami(nyancat_start);

    var animationDuration = 9;

    var Ybody = Y.one(document.body);
    var bodyWidth = Ybody.getStyle('width');
    Ybody.append('<img src="nyancat.gif" id="image" width="100" style="position:fixed;z-index:9999;left:-100px;top:50px;"/>');

    var Yimage = Y.one('#image');

    var Ysound = Y.Audio.create({
        baseUrl: 'nyancat'
    });

    var sound = document.getElementById('sound');

    var nyancat_reset = function() {

        Ysound.invoke('pause');
        Ysound.set('currentTime', '0');
        Ysound.set('volume', '1');

        Yimage.setStyle('left', '-100px');
    };

    function nyancat_start() {

        Ysound.invoke('play');

        Yimage.setStyle('display', 'block');

        Yimage.transition({
            left: {
                duration: animationDuration,
                value: bodyWidth
            }
        }, nyancat_reset);
    }

    Ysound.on('timeupdate', function (e) {
        var vol = 1,
        interval = 200;
        if (Math.floor(Ysound.get('currentTime') === 6)) {
            if (Ysound.get('volume') === 1) {
                var intervalID = setInterval(function () {
                    if (vol > 0) {
                        vol -= 0.10;
                        if (vol >= 0.10)
                            Ysound.set('volume', vol.toFixed(1));
                    } else {
                        clearInterval(intervalID);
                    }
                },
                interval);
            }
        }
    });
});
