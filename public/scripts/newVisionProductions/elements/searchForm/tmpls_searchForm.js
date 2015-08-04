(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.searchForm = function () {

        return {
            c: 'layout', C: {
                c: 'popup', C: {
                    e: 'form', a: {action: '/'}, C: {
                        c: 'frame', C: [
                            {
                                c: 'title-wrapper',C:{c:'title',t:l10n('searchFormTitle').toUpperCase()}
                            },
                            {
                                c:'select-artist-wrapper',C:{
                                e:'select'
                            }
                            },
                            {c:'separator'},
                            {
                                c:'select-art-wrapper',C:{
                                e:'select'
                            }
                            },
                            {c:'separator'},
                            {c:'description',t:'',n:'sfDescription'},
                            {c:'tags',n:'sfTags'}
                        ]
                    }
                }
            }
        }
    }

}(NV));
