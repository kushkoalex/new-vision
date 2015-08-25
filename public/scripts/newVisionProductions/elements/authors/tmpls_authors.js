(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,

        u;

    tmpls.authors = function () {
        var subMenuModel = [
            {text: l10n('authors_subMenu_authors', 'firstUpper'), isActive: true},
            {
                text: l10n('authors_subMenu_products', 'firstUpper'),
                link: nv.settings.controlsDescriptors.site.productsPageUrl
            },
            {text: l10n('authors_subMenu_search', 'firstUpper'), popup: true}
        ];

        return [
            tmpls.header(),
            tmpls.artsTitle(),
            tmpls.artsSubMenu(subMenuModel),
            tmpls.tagsFilter(nv.settings.controlsDescriptors.site.authorsPageUrl),
            tmpls.authorsForm(),
            tmpls.pageFooter()
        ]
    };

    tmpls.artsTitle = function (link) {
        //console.log('artsTitle');
        if (link) {
            return {
                c: 'titleContainer',
                C: {c: 'title', C: [{c: 'logo'}, {e: 'a', h: link, t: l10n('artists_and_arts').toUpperCase()}]}
            }
        }
        return {c: 'titleContainer', C: {c: 'title', t: l10n('artists_and_arts').toUpperCase(), C: {c: 'logo'}}}
    };

    tmpls.artsSubMenu = function (subMenuModel) {
        //console.log('artsSubMenu');
        var subMenuContent = [];

        for (var i = 0; i < subMenuModel.length; i++) {

            if (subMenuModel[i].link) {
                subMenuContent.push({
                    c: 'item' + (subMenuModel[i].isActive === true ? ' active' : ''),
                    C: {
                        e: 'a',
                        h: subMenuModel[i].link,
                        t: subMenuModel[i].text,
                        c: '' + (subMenuModel[i].isActive === true ? ' active' : '')
                    }
                })
            } else if (subMenuModel[i].popup === true) {
                subMenuContent.push({
                    c: 'item',
                    C: {e: 'a', h: '#', t: subMenuModel[i].text, c: 'popuplink'}
                });
            } else {
                subMenuContent.push({
                    c: 'item' + (subMenuModel[i].isActive === true ? ' active' : ''),
                    t: subMenuModel[i].text
                });
            }

            if (i != subMenuModel.length - 1) {
                subMenuContent.push({c: 'separator'});
            }
        }

        return {
            c: 'subMenuWrapper', C: {
                c: 'subMenu', C: subMenuContent
            }
        };
    };

    tmpls.tagsFilter = function (link) {
        var currentTags = nv.settings.dataModels.currentTags,
            tags = [];

        if (currentTags.length == 0) {
            return {}
        }

        for (var i = 0; i < currentTags.length; i++) {
            tags.push({c: 'tag', H: currentTags[i].title});
        }

        return {
            c: 'filter-container', C: [
                {c: 'show-only', H: l10n('tagsFilterShowOnly', 'firstUpper')},
                {c: 'tags', C: tags},
                {c: 'reset', e: 'a', h: link, t: l10n('tagsFilterReset', 'firstUpper')}
            ]
        }
    };

    tmpls.authorsForm = function () {
        return {n: 'authorsBlocks', c: 'authors-container'}
    };


    tmpls.author = function (authorsDataItem) {
        var
            contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathAuthorsThumb,
            photoPath = contentImagePath + authorsDataItem.photo,
            productsThumbPath = nv.settings.controlsDescriptors.site.contentImagesPathProductsThumb;

        return {
            c: 'author-container', C: [
                {
                    c: 'image',
                    C: {
                        e: 'a',
                        h: a9.supplant(nv.settings.controlsDescriptors.site.authorAboutPageUrl, {artist: authorsDataItem.name}),
                        C: {e: 'img', a: {src: photoPath}}
                    }
                },
                {
                    c: 'description', C: [
                    {c: 'title', t: authorsDataItem.title},
                    {c: 'tags', n: 'tags'}
                ]
                }
            ]
        }
    };

    tmpls.tag = function (tag) {
        var currentTags = [],
            u;

        //console.log(tag);
        //a9.copyArray(nv.settings.dataModels.currentTags,currentTags);
        if (nv.settings.dataModels.currentTags !== u) {
            for (var i = 0; i < nv.settings.dataModels.currentTags.length; i++) {
                currentTags.push(nv.settings.dataModels.currentTags[i].id)
            }
        }



        if (!a9.contains(currentTags, tag.id)) {
            currentTags.push(tag.id);
        }
        var separatedTagsIds = currentTags.join('-');


        //var href = a9.supplant(nv.settings.controlsDescriptors.site.searchFilterUrlArtists, {tagsId: separatedTagsIds});
        var href = tag.isSearchFilterUrlArtistProducts
            ? a9.supplant(tag.pageUrl, {tagsId: separatedTagsIds,id:tag.authorName})
            : a9.supplant(tag.pageUrl, {tagsId: separatedTagsIds});
        return {c: 'tag', C: {e: 'a', h: href, t: tag.title}}
    };

    tmpls.clear = function () {
        return {c: 'clear'}
    }

}(NV));