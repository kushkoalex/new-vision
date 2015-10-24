(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,

        u;

    tmpls.authorEvents = function (authorInfo) {
        var subMenuModel = [
            {
                text: l10n('authors_subMenu_authorProducts', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorProductsPageUrl, {artist: authorInfo.name})
            },
            {
                text: l10n('authors_subMenu_aboutAuthor', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorAboutPageUrl, {artist: authorInfo.name})
            },
            {
                text: l10n('authors_subMenu_authorEvents', 'firstUpper'),
                isActive: true
            }
        ];

        return [
            tmpls.header(),
            tmpls.artsTitle(nv.settings.controlsDescriptors.site.authorsPageUrl),
            tmpls.authorTitle(authorInfo),
            tmpls.artsSubMenu(subMenuModel),
            tmpls.authorEventsForm(authorInfo),
            tmpls.pageFooter()
        ]
    };


    tmpls.authorEventsForm = function (authorInfo) {
        var
            contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathAuthors,
            photoPath = contentImagePath + authorInfo.photo,
            authorEvents = [],
            content;

        a9.each(authorInfo.events, function (aEvent) {
            content=[];

            if(aEvent.date!=null){
                content.push({c: 'author-event-date',C:{e:'span',t: aEvent.date} });
            }
            content.push({c: 'author-event-title', e: 'a', h: aEvent.url,t:aEvent.title});

            authorEvents.push({
                c: 'author-event',
                C: content
            });
        });


        return {
            n: 'aboutAuthorFrm', c: 'authors-container about-author', C: [
                {c: 'author-photo', C: {e: 'img', a: {src: photoPath}}},
                {
                    c: 'author-description',
                    C: [
                        {c: 'author-description-title', t: l10n('authors_subMenu_authorEvents').toUpperCase()},
                        {c: 'logo'},
                        {c: 'text', C: authorEvents}
                    ]
                },
                {c: 'clear'}
            ]
        }
    };


}(NV));