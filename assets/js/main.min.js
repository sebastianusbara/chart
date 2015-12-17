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
            Site.highChart();

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
        },

        highChart: function () {
            var $graph  = $('.graph');
            var $chart  = $('#container');
            var $pie    = $('#pie');

            if ( !$chart.length ) return;
            if ( !$pie.length ) return;

            Modernizr.load( {
                load    : assets._highchart,
                complete: initChart
            });

            function initChart() {

                var data        = $chart.attr('data-movies');
                var title       = $chart.attr('data-title');
                var pie         = $pie.attr('data-segment');
                var pieTitle    = $pie.attr('data-pieTitle');

                $.getJSON( data, function(json, textStatus) {
                    $chart.highcharts({
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
                });

                $.getJSON( pie, function(json, textStatus) {
                    $pie.highcharts({
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: pieTitle
                        },
                        series: json.segment
                    });
                });

                $graph.ready(function() {
                    $graph.removeClass('load');
                });
            }
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

    Modernizr.load({
        load    : assets._jquery_cdn,
        complete: checkJquery
    });

})( window, document );
