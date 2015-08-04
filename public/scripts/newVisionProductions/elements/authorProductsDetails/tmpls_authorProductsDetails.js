(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        settings = nv.settings,
        u;

    tmpls.authorProductsDetails = function (authorInfo) {

        var subMenuModel = [
            {
                text: l10n('authors_subMenu_aboutAuthor', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorAboutPageUrl, {artist: authorInfo.name})
            },
            {
                text: l10n('authors_subMenu_authorProducts', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorProductsPageUrl, {artist: authorInfo.name}),
                isActive: true
            },
            {text: l10n('authors_subMenu_authorEvents', 'firstUpper')}
        ];

        return [
            tmpls.header(),
            tmpls.artsTitle(nv.settings.controlsDescriptors.site.authorsPageUrl),
            tmpls.authorTitle(authorInfo),
            tmpls.artsSubMenu(subMenuModel),
            tmpls.authorProductsDetailsForm(authorInfo),
            tmpls.pageFooter()
        ]
    };


    tmpls.authorProductsDetailsForm = function (authorInfo) {
        var
            contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathAuthorsOrig,
            imagesContent = [],
            products = nv.settings.dataModels.products;
            ;

            //authorImages = authorInfo.images;


        for (var i = 0; i < products.length; i++) {
            imagesContent.push({
                e: 'li',
                C: {e: 'img', a: {src: contentImagePath + products[i].photo}}
            })
        }

        return {
            c: 'bxsliderProductDetailsContainer', C: [{
                c: 'productDetailsInfo', C: [
                    {c: 'title', a: {id: 'productDescriptionTitle'}, t: ''},
                    {c:'tags', a: {id: 'productDescriptionTags'}},
                    {c:'price',a: {id: 'productDescriptionPrice'}}
                ]
            }, {c: 'image-slider', C: {e: 'ul', c: 'bxsliderProductDetails', C: imagesContent}}]
        }
    }


}(NV));