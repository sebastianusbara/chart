/*! [PROJECT_NAME] | Suitmedia */

;(function ( window, document, undefined ) {

    var path = {
        css: myPrefix + 'assets/css/',
        js : myPrefix + 'assets/js/vendor/'
    };

    var assets = {
        _jquery_cdn     : 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
        _jquery_local   : path.js + 'jquery.min.js',
        _fastclick      : path.js + 'fastclick.min.js',
        _highchart      : path.js + 'highcharts.min.js'
    };

    var Site = {

        init: function () {
            Site.fastClick();
            Site.enableActiveStateMobile();
            Site.WPViewportFix();

            window.Site = Site;
        },

        fastClick: function () {
            Modernizr.load({
                load    : assets._fastclick,
                complete: function () {
                    FastClick.attach(document.body);
                }
            });
        },

        enableActiveStateMobile: function () {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', function () {}, true);
            }
        },

        WPViewportFix: function () {
            if ( navigator.userAgent.match(/IEMobile\/10\.0/) ) {
                var style   = document.createElement("style"),
                    fix     = document.createTextNode("@-ms-viewport{width:auto!important}");

                style.appendChild(fix);
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        }

    };

    var Chart = {

        init: function () {
            Chart.lineChart();
            Chart.pieChart();

            window.Chart = Chart;
        },

        lineChart: function () {
            var $line  = $('.line');
            if ( !$line.length ) return;

            $line.each(function(index, el) {
                var $chartdata   = $(this);
                var data         = $chartdata.data('movies');
                var title        = $chartdata.data('title');

                $.getJSON( data, function(json, textStatus) {
                    $chartdata.highcharts({
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: title
                        },
                        xAxis: json.month,
                        yAxis: json.legend,
                        series: json.viewer
                    });

                    $chartdata.removeClass('load');
                })
                .fail(function() {
                    $chartdata.removeClass('load');
                    $chartdata.
                    append('<div class="err">Failed to Fetch Data</div>');
                });
            });         
        },

        pieChart: function () {
            var $pie  = $('.pie');
            if ( !$pie.length ) return;

            $pie.each(function(index, el) {
                var $chartdata   = $(this);
                var data         = $chartdata.data('segment');
                var title        = $chartdata.data('title');

                $.getJSON( data, function(json, textStatus) {
                    $chartdata.highcharts({
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: title
                        },
                        series: json.segment
                    });

                    $chartdata.removeClass('load');
                })
                .fail(function() {
                    $chartdata.removeClass('load');
                    $chartdata.
                    append('<div class="err">Failed to Fetch Data</div>');
                });
            });         
        }

    };

    var checkJquery = function () {
        Modernizr.load([
            {
                test    : window.jQuery,
                nope    : assets._jquery_local,
                complete: Site.init
            }
        ]);
    };

    Modernizr.load([
        {
            load    : assets._jquery_cdn,
            complete: checkJquery
        },
        {
            load    : assets._highchart,
            complete: Chart.init
        }
    ]);

})( window, document );