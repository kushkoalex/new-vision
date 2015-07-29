$(function(){
    $('.bxslider').bxSlider({
        minSlides: 3,
        maxSlides: 10,
        slideWidth: 400,
        slideMargin: 0,
        moveSlides:1,
        pager:false
    });


    $('.bxsliderProductDetails').bxSlider({
        adaptiveHeight: true,
        mode: 'fade',
        pager:false
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $(".main-page-content-wrapper .header").css("height", "80px");
            $(".main-page-content-wrapper .logo").css("top", "5px");
            $(".main-page-content-wrapper .main-menu ul").css("top", "20px");
            $(".main-page-content-wrapper a.join-us").css("top", "20px");
        } else {
            $(".main-page-content-wrapper .header").css("height", "170px");
            $(".main-page-content-wrapper .logo").css("top", "50px");
            $(".main-page-content-wrapper .main-menu ul").css("top", "66px");
            $(".main-page-content-wrapper a.join-us").css("top", "66px");
        }
    });
});