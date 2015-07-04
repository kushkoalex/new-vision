(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,

        u;

    tmpls.authors = function () {
        return [
            tmpls.header(),
            tmpls.authorsTitle(),
            tmpls.subMenu(),
            tmpls.authorsForm()
        ]
    };

    tmpls.authorsTitle = function () {
        return {c: 'titleContainer', C: {c: 'title', t: 'мастера и работы', C: {c: 'logo'}}}
    };

    tmpls.subMenu = function(){

        return{
            c:'subMenuWrapper',C:{
            c:'subMenu',C:[
                {c:'item',t:l10n('authors_subMenu_authors','firstUpper')},
                {c:'separator'},
                {c:'item',t:l10n('authors_subMenu_products','firstUpper')},
                {c:'separator'},
                {c:'item',t:l10n('authors_subMenu_search','firstUpper')}
            ]}
        }

    };

    tmpls.authorsForm = function () {
        return {n: 'authorsBlocks', c: 'authors-container'}
    };


    tmpls.author = function (authorsDataItem) {
        var
            contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathAuthorsThumb,
            photoPath = contentImagePath + authorsDataItem.photo;

        return {
            c: 'author-container', C: [
                {c: 'image', C: {e: 'img', a: {src: photoPath}}},
                {
                    c: 'description', C: [
                    {c: 'title', t: authorsDataItem.title},
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