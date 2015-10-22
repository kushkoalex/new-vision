(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        settings = nv.settings,
        u;

    tmpls.authorProductsDetails = function (authorInfo) {

        var subMenuModel = [
            {
                text: l10n('authors_subMenu_authorProducts', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorProductsPageUrl, {artist: authorInfo.name}),
                isActive: true
            },
            {
                text: l10n('authors_subMenu_aboutAuthor', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorAboutPageUrl, {artist: authorInfo.name})
            },
            {
                text: l10n('authors_subMenu_authorEvents', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorEventsPageUrl, {artist: authorInfo.name})
            }
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
            contentImagePathOrig = nv.settings.controlsDescriptors.site.contentImagesPathAuthorsOrig,
            contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathProducts,
            avatarPath = nv.settings.controlsDescriptors.site.contentImagesPathAuthorsAvatar,
            imagesContent = [],
            products = nv.settings.dataModels.products;


        //authorImages = authorInfo.images;


        for (var i = 0; i < products.length; i++) {
            imagesContent.push({
                e: 'li',
                //C:{e:'a', c:'intense' ,h:contentImagePathOrig + products[i].photo, a:{'data-image':contentImagePathOrig + products[i].photo,  target:'_blank'},
                C: {
                    e: 'img',
                    c: 'intense',
                    a: {
                        'data-image': contentImagePathOrig + products[i].photo,
                        src: contentImagePath + products[i].photo
                    }
                }//}
            })
        }


        var className = 'productDetailsAuthorInfo hidden';
        //if (!authorInfo.description || authorInfo.description == '') {
        //    className += ' hidden';
        //}

        return {
            c: 'bxsliderProductDetailsContainer', C: [
                {
                    c: 'productDetailsInfo', C: [
                    {c: 'title', a: {id: 'productDescriptionTitle'}, t: ''},
                    {c: 'tags', a: {id: 'productDescriptionTags'}},
                    {c: 'price', a: {id: 'productDescriptionPrice'}},
                    {
                        c: className, a: {id: 'productDetailsAuthorInfo'}, C: [
                        {c: 'authorAvatar', C: {e: 'img', a: {src: avatarPath + authorInfo.avatar}}},
                        {
                            c: 'productDetailsAuthorInfoTextWrapper',
                            C: [
                                {c: 'productDetailsAuthorInfoTextTriangle'},
                                {
                                    c: 'productDetailsAuthorInfoTextContent', C: [
                                    {
                                        c: 'productDetailsAuthorInfoTextContentCloseBtn',
                                        n: 'productDetailsAuthorInfoTextContentCloseBtn'
                                    },
                                    {c: 'productDetailsAuthorInfoTextContentTitle', t: authorInfo.title},
                                    {c: 'productDetailsAuthorInfoTextContentText', a: {id: 'productDescriptionText'}}
                                ]
                                }]
                        }, {
                            c: 'clear'
                        }]
                    }
                ]
                },

                {c: 'image-slider', C: {e: 'ul', c: 'bxsliderProductDetails', C: imagesContent}}]
        }
    }


}(NV));