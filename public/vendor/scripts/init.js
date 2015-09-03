$(function () {
    $('.bxslider').bxSlider({
        minSlides: 3,
        maxSlides: 10,
        slideWidth: 400,
        slideMargin: 0,
        moveSlides: 1,
        pager: false
    });

    var elements = document.querySelectorAll('.intense');
    if (elements.length > 0) {
        Intense(elements);
    }
    //Intense(document.querySelectorAll('.demo-link'));

    var products = NV.settings.dataModels.products,
        tagsContainer = document.getElementById('productDescriptionTags'),
        titleContainer = document.getElementById('productDescriptionTitle'),
        productDescriptionPrice = document.getElementById('productDescriptionPrice'),
        productDescriptionText = document.getElementById('productDescriptionText'),
        startSlide = NV.settings.controlsDescriptors.site.startSlide | 0;

    productDetailsSlider = $('.bxsliderProductDetails').bxSlider({
        adaptiveHeight: false,
        mode: 'fade',
        startSlide: startSlide,
        pager: false,
        onSliderLoad: function (currentIndex) {
            // do funky JS stuff here
            //alert('Slider has finished loading. Click OK to continue!');


            //console.log(products);

            titleContainer.innerHTML = '&laquo' + products[startSlide].title + '&raquo';
            productDescriptionPrice.innerHTML = products[startSlide].price;
            productDescriptionText.innerHTML= products[startSlide].description;

            for (var i = 0; i < products[startSlide].tags.length; i++) {
                var item = document.createElement('span');
                var att = document.createAttribute("class");
                att.value = "product-description-tag";
                item.setAttributeNode(att);

                item.innerHTML = products[startSlide].tags[i];
                tagsContainer.appendChild(item);
            }


            //console.log(products[0].tags);


            //productDetailsSlider.goToSlide(2);

        },
        onSlideAfter: function ($slideElement, oldIndex, newIndex) {
            // do mind-blowing JS stuff here
            //alert('A slide has finished transitioning. Bravo. Click OK to continue!');
            if (products && products[newIndex] && products[newIndex].title) {
                titleContainer.innerHTML = '&laquo' + products[newIndex].title + '&raquo';
                productDescriptionPrice.innerHTML = products[newIndex].price;
                productDescriptionText.innerHTML= products[newIndex].description;
            }
            else {
                titleContainer.innerHTML = '';
                productDescriptionPrice.innerHTML = '';
                productDescriptionText.innerHTML= '';
            }

            tagsContainer.innerHTML = '';

            if (products[newIndex] && products[newIndex].tags) {
                for (var i = 0; i < products[newIndex].tags.length; i++) {
                    var item = document.createElement('span');
                    var att = document.createAttribute("class");
                    att.value = "product-description-tag";
                    item.setAttributeNode(att);

                    item.innerHTML = products[newIndex].tags[i];
                    tagsContainer.appendChild(item);
                }
            }

            //console.log(oldIndex);
            //console.log(newIndex);
        }
    });


    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $(".main-page-content-wrapper .language-switcher").css("top", "5px");
            $(".main-page-content-wrapper .header").css("height", "80px");
            $(".main-page-content-wrapper .logo").css("top", "5px");
            $(".main-page-content-wrapper .main-menu ul").css("top", "20px");
            $(".main-page-content-wrapper a.join-us").css("top", "20px");
        } else {
            $(".main-page-content-wrapper .language-switcher").css("top", "44px");
            $(".main-page-content-wrapper .header").css("height", "170px");
            $(".main-page-content-wrapper .logo").css("top", "50px");
            $(".main-page-content-wrapper .main-menu ul").css("top", "66px");
            $(".main-page-content-wrapper a.join-us").css("top", "66px");
        }
    });
});