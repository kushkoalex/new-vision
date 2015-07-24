(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,

        u;

    tmpls.products = function () {
        return [
            tmpls.header(),
            tmpls.productsTitle(),
            tmpls.subMenuProducts(),
            tmpls.productsForm()
        ]
    };

    tmpls.productsTitle = function () {
        return {c: 'titleContainer', C: {c: 'title', t: 'мастера и работы', C: {c: 'logo'}}}
    };

    tmpls.subMenuProducts = function(){

        return{
            c:'subMenuWrapper',C:{
                c:'subMenu',C:[
                    {c:'item', C:{e:'a',h:nv.settings.controlsDescriptors.site.authorsPageUrl ,t:l10n('authors_subMenu_authors','firstUpper')} },
                    {c:'separator'},
                    {c:'item active',t:l10n('authors_subMenu_products','firstUpper')},
                    {c:'separator'},
                    {c:'item',t:l10n('authors_subMenu_search','firstUpper')}
                ]}
        }

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

    tmpls.tag = function (tagText) {
        return {c: 'tag', C: {e: 'a', h: '#', t: tagText}}
    };

    tmpls.clear = function () {
        return {c: 'clear'}
    }

}(NV));