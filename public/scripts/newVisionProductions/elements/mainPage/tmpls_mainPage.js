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


    tmpls.mainPage = function (mainBanners) {
        return {c: 'main-page-content-wrapper', C: tmpls.imageFrame(mainBanners)}
    };

}(NV));