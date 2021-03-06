(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;


    tmpls.mainImageContentWrapper = function () {
        return {c: 'main-image-content-wrapper', n: 'mainImageContentWrapper'}
    };


    tmpls.mainImageContent = function (mainBanner) {
        var controlsDescriptors = nv.settings.controlsDescriptors;

        return {
            c: 'main-image-content',
            n: 'mainImage',
            //a: {style: 'background-image: url(' + controlsDescriptors.site.contentImagesPath + mainBanner.imageSrc + ')'},
            C: [{
                e: 'img', a: {src: controlsDescriptors.site.contentImagesPath + mainBanner.imageSrc}
                //e:'img', a: {style: 'background-image: url(' + controlsDescriptors.site.contentImagesPath + mainBanner.imageSrc + ')'}
            }, {
                c: 'main-title-wrapper',
                C: [
                    {c: 'title', H: mainBanner.title, n: 'title'},
                    {c: 'separator'},
                    {c: 'description', H: mainBanner.description},
                    {
                        c: 'details', n: 'showDetails',
                        C: [
                            {c: 'arrow'},
                            {c: 'text', t: l10n('mainPageDetails'), a: {data: mainBanner.order}},
                            {c: 'arrow'}]

                    }
                ]
            }]
        }
    };


    tmpls.imageFrame = function () {
        return [
            tmpls.header(true),
            tmpls.mainImageContentWrapper()
        ]
    };

    tmpls.imageControls = function (imagesLength) {
        var className = 'image-slider-controls';
        if (!imagesLength || imagesLength === 1) {
            className += ' hidden';
        }

        return {
            c: className,
            C: [
                {c: 'left', n: 'slideLeft'},
                {c: 'right', n: 'slideRight'}
            ]
        }
    };

    tmpls.announcement = function (eventAnnouncement) {
        var
            controlsDescriptors = nv.settings.controlsDescriptors,
            content = [],
            images,
            imageDescriptionPair,
            imagesContainer,
            image,
            description,
            activeClassName,
            i;

        images = [];

        for (i = 0; i < eventAnnouncement.images.length; i++) {

            if (i == 0) {
                activeClassName = ' active';
            } else {
                activeClassName = '';
            }

            images.push({
                c: 'image' + activeClassName,
                n: 'img',
                a: {style: 'background-image: url(' + controlsDescriptors.site.contentImagesPath + eventAnnouncement.images[i] + ')'}
            });
        }

        imagesContainer = {
            c: 'images-container',
            n: 'imagesContainer',
            C: [
                images,
                tmpls.imageControls(images.length)
            ]
        };

        description = {
            c: 'description', C: {
                c: 'description-content-wrapper', C: [
                    {c: 'title', t: eventAnnouncement.title},
                    {c: 'text', H: eventAnnouncement.text}
                ]
            }
        };

        if (eventAnnouncement.odd) {
            imageDescriptionPair = [description, imagesContainer];
        }
        else {
            imageDescriptionPair = [imagesContainer, description];
        }

        return {
            c: 'content-block', a: {id: 'contentBlock' + eventAnnouncement.order}, C: [
                imageDescriptionPair,
                {c: 'clear'}
            ]
        };
    };

    tmpls.contentBlocks = function () {
        return {
            c: 'content-blocks', a: {id: 'contentBlocks'}
        };
    };


    //tmpls.mainPage = function (mainPageDataModel) {
    //    return {
    //        c: 'main-page-content-wrapper', C: [
    //            tmpls.imageFrame(mainPageDataModel.mainBanners),
    //            tmpls.announcements(mainPageDataModel.eventAnnouncements)]
    //    }
    //};

    tmpls.mainPageContentWrapper = function () {
        return {c: 'main-page-content-wrapper'}
    };

}(NV));