if ($('.backstretch-enabled').length) {
    $.backstretch([
        /* "/img/gallery1/img-1.jpg", */
        "/img/gallery1/JSDAY2017024.jpg",
        "/img/gallery1/JSDAY2017252.jpg",
        "/img/gallery1/JSDAY2017156.jpg",
        "/img/gallery1/JSDAY2017153.jpg",
        "/img/gallery1/JSDAYES2016-131.jpg",
        "/img/gallery1/JSDAYES2016-240.jpg",
        "/img/gallery1/JSDAYES2016-312.jpg",
        "/img/gallery1/img-3.jpg",
        "/img/gallery1/JSDAYES009.jpg",
        "/img/gallery1/JSDAYES2016-137.jpg",
        "/img/gallery1/JSDAYES2016-301.jpg",
        "/img/gallery1/JSDAYES2016-3.jpg"
    ], {
        lazyload: true,
        fade: 750,
        duration: 4000
    });
}

//menu shrink
$(document).on("scroll", function () {
    if ($(document).scrollTop() > 100) {
        $("nav").addClass("shrink");
    } else {
        $("nav").removeClass("shrink");
    }
});

/* ==============================================
 Auto Close Responsive Navbar on Click
 =============================================== */

function close_toggle() {
    if ($(window).width() <= 768) {
        $('.navbar-collapse a').on('click', function () {
            $('.navbar-collapse').collapse('hide');
        });
    } else {
        $('.navbar .navbar-default a').off('click');
    }
}
close_toggle();

$(window).resize(close_toggle);

//events slider
$(document).ready(function () {
    $("#sponsors-slider").owlCarousel({
        autoPlay: 3000, //Set AutoPlay to 3 seconds
        items: 4,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 2],
        itemsMobile: [479, 1],
        pagination: false,
        navigation: true,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
    });
});