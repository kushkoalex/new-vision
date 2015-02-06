(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;


    tmpls.imageFrame = function (mainBanners) {
        if (mainBanners[0] !== u) {
            return {
                c: 'main-image-wrapper', C: [
                    tmpls.header(true),
                    {
                        c: 'main-title-wrapper',
                        C: [
                            {c: 'title', H: mainBanners[0].title},
                            {c: 'separator'},
                            {c: 'description', H: mainBanners[0].description},
                            {
                                e: 'a', h: '#content-blocks', c: 'details', C: {
                                C: [
                                    {c: 'arrow'},
                                    {c: 'text', t: l10n('mainPageDetails')},
                                    {c: 'arrow'}]
                            }
                            }
                        ]
                    }
                ]
            }
        }
    };

    tmpls.announcements = function (eventAnnouncements) {

        var
            controlsDescriptors = nv.settings.controlsDescriptors,
            content = [],
            eventAnnouncement,
            images,
            imageDescriptionPair,
            image,
            description,
            i,
            j;

        for (i = 0; i < eventAnnouncements.length; i++) {

            images = [];

            for (j = 0; j < eventAnnouncements[i].images.length; j++) {
                images.push({c:'image active',a: {style: 'background-image: url(' + controlsDescriptors.site.contentImagesPath + eventAnnouncements[i].images[0] + ')'}})
            }

            image = {
                c: 'images-container',
                C: images
            };

            description = {
                c: 'description', C: {
                    c: 'description-content-wrapper', C: [
                        {c: 'title', t: eventAnnouncements[i].title},
                        {c: 'text', H: eventAnnouncements[i].text}
                    ]
                }
            };

            if (i % 2 == 0) {
                imageDescriptionPair = [description, image];
            }
            else {
                imageDescriptionPair = [image, description];
            }

            eventAnnouncement = {
                c: 'content-blocks', C: [
                    {e: 'a', a: {name: 'content-blocks'}},
                    {
                        c: 'content-block', C: [
                        imageDescriptionPair,
                        {c: 'clear'}
                    ]
                    }]
            };
            content.push(eventAnnouncement);
        }
        return content;
    };


    tmpls.mainPage = function (mainPageDataModel) {
        return {
            c: 'main-page-content-wrapper', C: [
                tmpls.imageFrame(mainPageDataModel.mainBanners),
                tmpls.announcements(mainPageDataModel.eventAnnouncements)]
        }
    };

    tmpls.mainPageContentWrapper = function(){
        return{c: 'main-page-content-wrapper'}
    };

}(NV));