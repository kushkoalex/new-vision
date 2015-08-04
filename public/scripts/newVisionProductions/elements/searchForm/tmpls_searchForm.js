(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.searchForm = function (data) {

        return {
            c: 'layout', C: {
                c: 'popup', C: {
                    e: 'form', a: {id:'sForm', method:'POST', action: '/'}, C: [{
                        c: 'frame', C: [
                            {
                                c: 'title-wrapper',C:{c:'title',t:l10n('searchFormTitle').toUpperCase()}
                            },
                            {
                                c:'select-artist-wrapper',C:tmpls.vSelect({
                                options: data.authorCategories,
                                selectedIndex: 0,
                                n: 'artistCategorySelect'
                            })
                            },
                            {c:'separator'},
                            {
                                c:'select-art-wrapper', n:'artCategorySelectWrapper', C:
                                tmpls.vSelect({
                                options: data.authorCategories[0].categories,
                                selectedIndex: 0,
                                n: 'artCategorySelect'
                            })
                            },
                            {c:'separator'},
                            {c:'description',t:'',n:'sfDescription'},
                            {c:'tags',n:'sfTagsWrapper',C:tmpls.tagList({
                                options: data.authorCategories[0].categories[0].tags,
                                n: 'sfTags'
                            })}
                        ]
                    },{c:'button', n:'btnSubmit',C:{c:'button-title',H:l10n('searchFormSubmitButtonTitle','firstUpper')}}]
                }
            }
        }
    }

}(NV));
