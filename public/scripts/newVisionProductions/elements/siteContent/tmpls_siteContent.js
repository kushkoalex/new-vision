(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,


        u;

    tmpls.siteContent = function (siteContentData) {


        return [
            tmpls.header(),
            tmpls.siteContentForm(siteContentData)
        ];
    };

    tmpls.siteContentForm = function (content) {

        var controlsDescriptors = nv.settings.controlsDescriptors;

        return [
            {
                c: 'contacts-form-wrapper', C: [
                {
                    c: 'feedback-form-wrapper', C: {
                    c: 'feedback-form', C: {
                        c: 'feedback-form-content-wrapper', C: [
                            {c: 'title', t:content.title},
                            {c: 'text',H:content.text}
                        ]
                    }
                }
                },
                {c: 'map-wrapper', a: {style:'background-image:url('+controlsDescriptors.site.contentImagesPath + content.imageSrc+')'}},
                {c: 'clear'}
            ]
            },
            {a: {id: 'footer'}, C: tmpls.footer()}
        ];
    };

}(NV));