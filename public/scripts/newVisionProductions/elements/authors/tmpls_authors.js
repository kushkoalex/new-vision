(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.authors = function () {
        return [
            tmpls.header(),
            tmpls.authorsTitle(),
            tmpls.authorsForm()
        ]
    };

    tmpls.authorsTitle = function () {
        return {c: 'titleContainer', C: {c: 'title', t: 'мастера и работы', C: {c: 'logo'}}}
    };

    tmpls.authorsForm = function () {
        return {n: 'authorsBlocks', c: 'authors-container'}
    };

    tmpls.author = function (authorsDataItem) {
        return {
            c: 'author-container', C: [
                {c: 'image'},
                {
                    c: 'description', C: [
                    {c: 'title', t: authorsDataItem.title},
                    {c: 'tags',n:'tags'}
                ]
                }
            ]
        }
    };

    tmpls.tag = function(tagText){
        return{c:'tag', C:{e:'a', h:'#',t:tagText} }
    };

    tmpls.clear = function(){
        return{c:'clear'}
    }

}(NV));