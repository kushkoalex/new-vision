NV.mainPage = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
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
        i,
        currentVisibleFrameIndex = 0,
        controlsDescriptors = settings.controlsDescriptors
        ;


    function buildMainPageForm(mainPageData) {

        $fragment = global.document.createDocumentFragment();


        //build = tp('imageFrame', mainPageData.mainBanners, $fragment);
        //$mainImage = build.mainImageContentWrapper;

        a9.each(mainPageData.mainBanners, function (mainBanner) {
            build = tp('mainImageContent', mainBanner, $fragment);
            $contentImages.push(build.r);
        });


        var $mainImageContentWrapper = tp('imageFrame', $mainPageContentWrapper).mainImageContentWrapper;
        $mainImageContentWrapper.appendChild($fragment);


        a9.each(mainPageData.eventAnnouncements, function (announcement) {

            //console.log(announcement);

        });


        build = tp('announcements', mainPageData.eventAnnouncements, $fragment);


        $mainPageContentWrapper.appendChild($fragment);
    }


    var $mainPageContentWrapper = tp('mainPageContentWrapper', $parent).r;

    buildMainPageForm(mainPageData);

    slideImageFrame();


    function setInactiveImages() {
        for (i = 0; i < $contentImages.length; i++) {
            a9.removeClass($contentImages[i], "active");
        }
    }

    function updateCurrentVisibleFrameIndex()
    {
        currentVisibleFrameIndex++;
        if (currentVisibleFrameIndex >= $contentImages.length) {
            currentVisibleFrameIndex = 0;
        }
    }

    function setActiveImage(){
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

};