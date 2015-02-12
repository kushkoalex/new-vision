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
        $slideRight

        ;

    function buildMainPageForm(mainPageData) {
        $fragment = global.document.createDocumentFragment();

        a9.each(mainPageData.mainBanners, function (mainBanner) {
            build = tp('mainImageContent', mainBanner, $fragment);
            $showDetails = build.showDetails;
            a9.addEvent($showDetails, eventOnPointerEnd, showDetails);
            $contentImages.push(build.r);
        });

        var $mainImageContentWrapper = tp('imageFrame', $mainPageContentWrapper).mainImageContentWrapper;
        $mainImageContentWrapper.appendChild($fragment);


        for (i = 0; i < mainPageData.eventAnnouncements.length; i++) {
            eventAnnouncement = mainPageData.eventAnnouncements[i];
            eventAnnouncement.odd = i % 2 == 0;
            build = tp('announcement', eventAnnouncement, $fragment);
            $slideLeft = build.slideLeft;
            $slideRight = build.slideRight;
            a9.addEvent($slideLeft, eventOnPointerEnd, slideLeft);
            a9.addEvent($slideRight, eventOnPointerEnd, slideRight);
        }

        $mainPageContentWrapper.appendChild($fragment);
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
        console.log(e);
        console.log('left arrow pressed');
    }

    function slideRight(e) {
        console.log(e);
        console.log('right arrow pressed');
    }

};