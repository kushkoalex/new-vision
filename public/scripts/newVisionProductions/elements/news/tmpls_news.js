(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.news = function () {
        return [
            tmpls.header(),
            tmpls.newsForm()
        ];
    };

    tmpls.newsForm = function () {
        return [{c: 'news-blocks', n: 'newsBlocks'},
            {c: 'footer-separator-line'},
            {a: {id: 'footer'}, C: tmpls.footer()}]
    };

    tmpls.newsBlock = function (dataItem) {
               var blockSize = 'news-block-'+dataItem.size;

        return {
            c: 'news-block '+blockSize, C: {
                c: 'title-wrapper '+dataItem.titlePosition, C: [
                    {c: 'date', t: dataItem.date},
                    {c: 'title', t: dataItem.title}
                ]
            }
        }
    };

}(NV));