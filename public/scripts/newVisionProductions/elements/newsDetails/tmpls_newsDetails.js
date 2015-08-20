(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.newsDetailsContent = function () {
        return [
            tmpls.header(),
            tmpls.newsDetailsWrapper()
        ]
    };

    tmpls.newsDetails = function (newsData) {
        var
            controlsDescriptors = nv.settings.controlsDescriptors,
            imagesContent = [],
            eventImages = newsData.images,
            textContent,
            content=[];

        //console.log(newsData.videoSrc);

        if (newsData.videoSrc !== u && newsData.videoSrc != '' && newsData.videoSrc !== null) {
            textContent = [{
                c: 'text', C: [
                    {
                        c: 'video', C: {
                        e: 'iframe',
                        a: {width: '640', height: '360', src: newsData.videoSrc, frameborder: '0'}
                    }
                    },
                    {H: newsData.text}]
            }, {c: 'clear'}];

        }
        else {
            textContent = {c: 'text', H: newsData.text};
        }

        if (eventImages !== u) {
            for (var i = 0; i < eventImages.length; i++) {
                imagesContent.push({
                    e: 'li',
                    C: {e: 'img', a: {src: controlsDescriptors.site.contentImagesPath + eventImages[i]}}
                })
            }
        }

        content.push({
            c: 'title-wrapper', C: [
                {c: 'date', t: newsData.date},
                {c: 'title', t: newsData.title}
            ]
        });

        if(imagesContent.length>0){
            content.push({c: 'image-slider', C: {e: 'ul', c: 'bxslider', C: imagesContent}});
        }

        content.push({
            c: 'text-wrapper', C: [
                {c: 'logo'},
                textContent
            ]
        });

        return content;
    };

    tmpls.newsDetailsWrapper = function () {
        return [
            {c: 'news-details', n: 'newsWrapper'},
            {a: {id: 'footer'}, C: tmpls.footer()}
        ]
    };

}(NV));