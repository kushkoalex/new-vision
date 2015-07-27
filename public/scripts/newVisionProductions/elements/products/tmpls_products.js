(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.products = function () {

        var subMenuModel = [
            {text:l10n('authors_subMenu_authors','firstUpper'),link:nv.settings.controlsDescriptors.site.authorsPageUrl},
            {text:l10n('authors_subMenu_products','firstUpper'),isActive:true},
            {text:l10n('authors_subMenu_search','firstUpper')}
        ];

        return [
            tmpls.header(),
            tmpls.artsTitle(),
            tmpls.artsSubMenu(subMenuModel),
            tmpls.productsForm(),
            tmpls.pageFooter()
        ]
    };


    tmpls.productsForm = function () {
        return {n: 'productsBlocks', c: 'authors-container'}
    };


    tmpls.product = function (productsDataItem) {
        var
            contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathProductsThumb,
            photoPath = contentImagePath + productsDataItem.photo;

        return {
            c: 'author-container', C: [
                {c: 'image', C: {e: 'img', a: {src: photoPath}}},
                {
                    c: 'description', C: [
                    {c: 'title', t: productsDataItem.title},
                    {c: 'author', C:{e:'a',h:'#'+productsDataItem.author.name,t: productsDataItem.author.title} },
                    {c: 'tags', n: 'tags'}
                ]
                }
            ]
        }
    };


}(NV));