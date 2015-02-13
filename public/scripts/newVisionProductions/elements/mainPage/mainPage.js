NV.mainPage = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
        tp = global.cnCt.tp,
        settings = nv.settings,
        mainPageData = settings.dataModels.mainPage,
        $fragment,
        build,
        $mainBanners = [],
        $announcementImages = [],
        $mainImage,
        $mainImageContents,
        $contentImages = [],
        $showDetails,
        i,
        currentVisibleFrameIndex = -1,
        controlsDescriptors = settings.controlsDescriptors,
        duration = nv.settings.scrollToTopDuration || 200,
        doc = global.document,
        startY,
        finishY,
        startT,
        finishT,
        eventAnnouncement,
        $slideLeft,
        $slideRight,
        $sliders = [],
        $sliderItems = [],
        sliderContainerClass = 'images-container'
        ;

    function buildMainPageForm(mainPageData) {
        var $sliderItem;
        $fragment = global.document.createDocumentFragment();

        a9.each(mainPageData.mainBanners, function (mainBanner) {
            build = tp('mainImageContent', mainBanner, $fragment);
            $showDetails = build.showDetails;
            a9.addEvent($showDetails, eventOnPointerEnd, showDetails);
            $contentImages.push(build.r);
        });

        var $mainImageContentWrapper = tp('imageFrame', $mainPageContentWrapper).mainImageContentWrapper;
        $mainImageContentWrapper.appendChild($fragment);

        $fragment = global.document.createDocumentFragment();

        var $contentBlocks = tp('contentBlocks').r;

        for (i = 0; i < mainPageData.eventAnnouncements.length; i++) {
            eventAnnouncement = mainPageData.eventAnnouncements[i];
            eventAnnouncement.odd = i % 2 == 0;
            build = tp('announcement', eventAnnouncement, $fragment);


            $slideLeft = build.slideLeft;
            $slideRight = build.slideRight;

            $sliderItem = build.imagesContainer;
            $sliderItem.images = build.img;
            $sliders.push($sliderItem);

            //console.log(build.img);

            a9.addEvent($slideLeft, eventOnPointerEnd, slideLeft);
            a9.addEvent($slideRight, eventOnPointerEnd, slideRight);
            $contentBlocks.appendChild($fragment);
        }

        $mainPageContentWrapper.appendChild($contentBlocks);
    }

    var $mainPageContentWrapper = tp('mainPageContentWrapper', $parent).r;

    buildMainPageForm(mainPageData);


    setTimeout(slideImageFrame, 100);

    function setInactiveImages() {
        for (i = 0; i < $contentImages.length; i++) {
            a9.removeClass($contentImages[i], "active");
        }
    }

    function updateCurrentVisibleFrameIndex() {
        currentVisibleFrameIndex++;
        if (currentVisibleFrameIndex >= $contentImages.length) {
            currentVisibleFrameIndex = 0;
        }
    }

    function setActiveImage() {
        for (i = 0; i < $contentImages.length; i++) {
            if (i == currentVisibleFrameIndex) {
                a9.addClass($contentImages[i], "active");
            }
        }
    }

    function slideImageFrame() {
        setInactiveImages();
        updateCurrentVisibleFrameIndex();
        setActiveImage();
        setTimeout(slideImageFrame, controlsDescriptors.site.mainPageSlideTimeout);
    }


    function showDetails() {
        scrollToTop();
    }

    function interpolate(source, target, shift) {
        return (source + ((target - source) * shift));
    }

    function easing(pos) {
        return (-Math.cos(pos * Math.PI) / 2) + .5;
    }

    function animate() {
        var now = +(new Date()),
            shift = (now > finishT) ? 1 : (now - startT) / duration;
        global.scrollTo(0, interpolate(startY, finishY, easing(shift)));
        (now > finishT) || setTimeout(animate, 15);
    }

    function scrollToTop() {
        finishY = (a9.$('contentBlocks').offsetTop || 0);
        startY = ((global.pageYOffset || doc.scrollTop) || 0) - (doc.clientTop || 0);
        startT = +(new Date());
        finishT = startT + duration;
        setTimeout(animate, 15);
    }

    function slideLeft(e) {
        onSliderClick(e, e.target, 'left');
    }

    function slideRight(e) {
        onSliderClick(e, e.target, 'right');
    }

    function onSliderClick(e, $target, direction) {
        var $slider = a9.getParentByClass($target, sliderContainerClass, true);
        if ($slider !== null) {

            if (!$slider.currentSlide) {
                $slider.currentSlide = 0;
            }

            //console.log($slider.currentSlide);

            for (i = 0; i < $slider.images.length; i++) {
                a9.removeClass($slider.images[i], 'active');
            }

            if (direction == 'right') {
                if ($slider.currentSlide < $slider.images.length - 1) {
                    $slider.currentSlide = $slider.currentSlide + 1;
                } else {
                    $slider.currentSlide = 0;
                }
            } else if (direction == 'left') {
                if ($slider.currentSlide > 0) {
                    $slider.currentSlide = $slider.currentSlide - 1;
                } else {
                    $slider.currentSlide = $slider.images.length - 1;
                }
            }
            a9.addClass($slider.images[$slider.currentSlide], 'active');
        }
        //e.preventDefault();
    }
};