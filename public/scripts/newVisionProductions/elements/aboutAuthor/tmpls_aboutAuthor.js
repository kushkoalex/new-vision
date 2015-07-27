(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,

        u;

    tmpls.aboutAuthor = function (authorInfo) {
        var subMenuModel = [
            {text: l10n('authors_subMenu_aboutAuthor', 'firstUpper'), isActive: true},
            {
                text: l10n('authors_subMenu_authorProducts', 'firstUpper'),
                link:a9.supplant( nv.settings.controlsDescriptors.site.authorProductsPageUrl,{artist:authorInfo.name})
            },
            {text: l10n('authors_subMenu_authorEvents', 'firstUpper')}
        ];

        return [
            tmpls.header(),
            tmpls.artsTitle(nv.settings.controlsDescriptors.site.authorsPageUrl),
            tmpls.authorTitle(authorInfo),
            tmpls.artsSubMenu(subMenuModel),
            tmpls.aboutAuthorForm(authorInfo),
            tmpls.pageFooter()
        ]
    };

    tmpls.authorTitle = function(authorInfo){
        return{c:'author-title',t:authorInfo.title}
    };


    tmpls.aboutAuthorForm = function (authorInfo) {
        var
            contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathAuthors,
            photoPath = contentImagePath + authorInfo.photo;

        return {
            n: 'aboutAuthorFrm', c: 'authors-container about-author', C: [
                {c: 'author-photo', C: {e: 'img', a: {src: photoPath}}},
                {
                    c: 'author-description',
                    C: [
                        {c: 'author-description-title', t: l10n('authors_subMenu_aboutAuthor').toUpperCase()},
                        {c: 'logo'},
                        {c:'text',H:authorInfo.description}
                    ]
                },
                {c: 'clear'}
            ]
        }
    };

}(NV));