var lastScrollTop = 0,
    autoScrolling = false;


String.prototype.toInt = function () {
    return parseInt(this);
};

$(function () {
    $("html").niceScroll();

    setCurrentEvaluations(96251);
    lastScrollTop = $(window).scrollTop();
    $(window).on("resize", setDynamicObjectSize)
             .on("scroll", function () { })
             .trigger("resize");


    $('a[href][href^="#"], #start-scroll').on("click", function (event) {
        event.preventDefault();
        $(window).stop()
                 .animate({ scrollTop: $($(this).attr("href") || $(this).data("href")).offset().top - $('[data-spy="affix"]').height() }, 500);
    });

    if (document.getElementById('main-logo') !== null) {
        new Waypoint({
            element: document.getElementById('main-logo'),
            handler: function (direction) {
                if (direction === "down") logoDesappear();
            }
        });
    }
    if (document.getElementById('start-scroll') !== null) {
        new Waypoint({
            element: document.getElementById('start-scroll'),
            offset: 20,
            handler: function (direction) {
                if (direction === "up") logoAppear();
            }
        });
    }

    $("li.search").find("a").on("click", function () {
        $(this).parent().addClass("active")
               .find("input").on("blur change", function () { $(this).parent().removeClass("active"); })
                            .focus()[0]
                            .select();
    });

    $(".ios-toggle.checkbox-green").on("change", function () {
        var _img = $(this).parent().next().find("img"),
            _bag = $("#hand-bag"),
            _left = _bag.offset().left + 20,
            _delta = _.chain(_bag.find("img"))
                      .map(function (i) { return $(i).height() + parseInt($(i).css("margin-top")) * 2; }).value(),
            _top = _bag.offset().top + (_delta.length === 0 ? 0 : _.reduce(_delta, function (a, b) { return a + b; }));

        if (!$(this).is(":checked") || $("img[src='" + _img.attr("src") + "']").length != 1) {
            $("img[src='" + _img.attr("src") + "']:last").hide("slide", function () { $(this).parent().hide("slide", function () { $(this).remove(); }); });
            return;
        };

        _img.clone().appendTo("body")
                    .css({ position: "absolute", top: _img.offset().top, left: _img.offset().left, "z-index": 1999 })
                    .animate({ top: _top, left: _left }, 1000 - _img.offset().top / 5,
                    function () {
                        $(this).hide().appendTo($("<div class='col-md-4 text-center selected-tool'/>")
                                                    .css({ "background-image": "url(" + $(this).attr("src") + ")" })
                                                    .appendTo(_bag));
                    });
    });

});

function setCurrentEvaluations(qty) {
    $("#currentEvaluations").html(qty);
    setTimeout(function () { setCurrentEvaluations(_.random(qty, qty + 3)); }, _.random(750 * 60, 1000 * 60));
};

function setDynamicObjectSize(event) {
    $("#main-logo").css({ width: $(window).width() / 3 });
    //$("section#cite-3 .parallax-container").css({ "min-height": $(window).height() });
};

function setDinamicObjectPosition(event) {
    var _lastScrollTop = lastScrollTop,
        _section = $("section.home-slider");
    lastScrollTop = $(this).scrollTop()
    var _scrollingDown = _lastScrollTop < lastScrollTop;

    //console.log([lastScrollTop < $("section#main-services").offset().top - $('[data-spy="affix"]').height()]);

    if ($("#main-logo").height() - lastScrollTop <= 0)
        $("#main-logo").trigger("desappear");
    else if (!_scrollingDown && (lastScrollTop < $("section#main-services").offset().top - $('[data-spy="affix"]').height()))
        $("#main-logo").trigger("appear");
};

function logoDesappear() {
    $("#main-logo").animate({ marginLeft: $("#main-logo").width() * -1.1, opacity: 0 }, 500);
    $('[data-spy="affix"]').animate({ marginTop: 0 }, 500);
    //$(window).stop().animate({ scrollTop: $("section#main-services").offset().top - $('[data-spy="affix"]').height() }, 500);
};

function logoAppear() {
    $("#main-logo").animate({ marginLeft: 0, opacity: 1 }, 500);
    $('[data-spy="affix"]').animate({ marginTop: -$('[data-spy="affix"]').height() }, 500);
    //$(window).stop().animate({ scrollTop: 0 }, 500);
};

function logoScroll() {
    console.log($(this).offset().top);
};

function loadTweets() {
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
        data: {
            screen_name: 'luisllorca',
            count: 5,
            oauth_consumer_key: 'U74FROsl7e4jrcFeymfZWKKBn',
            oauth_token: '114833867-8MKMSQ6l3m7DxfdpypLVdi9OeLN9xHomTjFnF907',

        },
        success: function (data, textStatus, XMLHttpRequest) {
            debugger;
            var tmp = false;
            var results = $('#twitter_results');
            //console.log(data);
            for (i in data) {
                if (data[i].retweeted_status !== null) {
                    tmp = $('<li class="retweet" itemid="' + data[i].retweeted_status.id_str + '"><div class="dogear"></div><img src="' + data[i].retweeted_status.user.profile_image_url + '" alt="" align="left" width="48" height="48" /><cite>' + data[i].retweeted_status.user.screen_name + '</cite><p>' + data[i].retweeted_status.text.linkify_tweet() + '</p></li>');
                    if (data[i].retweeted_status.favorited) {
                        tmp.addClass('favorite');
                    }
                } else {
                    tmp = $('<li itemid="' + data[i].id_str + '"><div class="dogear"></div><img src="' + data[i].user.profile_image_url + '" alt="" align="left" width="48" height="48" /><cite>' + data[i].user.screen_name + '</cite><p>' + data[i].text.linkify_tweet() + '</p></li>');
                    if (data[i].favorited) {
                        tmp.addClass('favorite');
                    }
                }

                results.append(tmp);
            }
        },
        error: function (req, status, error) {
            debugger;
        }
    });
}

