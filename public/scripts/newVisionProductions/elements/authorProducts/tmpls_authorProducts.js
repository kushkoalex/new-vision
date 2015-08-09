(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.authorProducts = function (authorInfo) {

        var subMenuModel = [
            {
                text: l10n('authors_subMenu_aboutAuthor', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorAboutPageUrl,{artist:authorInfo.name})
            },
            {
                text: l10n('authors_subMenu_authorProducts', 'firstUpper'),
                isActive: true
            },
            {
                text: l10n('authors_subMenu_authorEvents', 'firstUpper'),
                link: a9.supplant(nv.settings.controlsDescriptors.site.authorEventsPageUrl,{artist:authorInfo.name})
            }
        ];

        return [
            tmpls.header(),
            tmpls.artsTitle(nv.settings.controlsDescriptors.site.authorsPageUrl),
            tmpls.authorTitle(authorInfo),
            tmpls.artsSubMenu(subMenuModel),
            tmpls.productsForm(),
            tmpls.pageFooter()
        ]
    };



}(NV));