(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,

        u;

    tmpls.authors = function () {
        var subMenuModel = [
            {
                text: l10n('authors_subMenu_products', 'firstUpper'),
                link: nv.settings.controlsDescriptors.site.productsPageUrl
            },
            {text: l10n('authors_subMenu_authors', 'firstUpper'), isActive: true},
            {text: l10n('authors_subMenu_search', 'firstUpper'), popup: true}
        ];

        return [
            tmpls.header(),
            tmpls.artsTitle(),
            tmpls.artsSubMenu(subMenuModel),
            tmpls.tagsFilter(nv.settings.controlsDescriptors.site.authorsPageUrl,nv.settings.controlsDescriptors.site.searchFilterUrlArtists),
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

    tmpls.tagsFilter = function (link,filterLink,isSearchFilterUrlArtistProducts,authorName) {
        var currentTags = [],
            tags = [],
            separatedTagsIds,
            i,
            j,
            tagLink;

        if (nv.settings.dataModels.currentTags.length == 0) {
            return {}
        }



        //console.log(currentTags);



        //console.log(filterLink);


        for (i = 0; i < nv.settings.dataModels.currentTags.length; i++) {

            currentTags = [];
            for (j = 0; j < nv.settings.dataModels.currentTags.length; j++) {
                if (nv.settings.dataModels.currentTags[i].id!=nv.settings.dataModels.currentTags[j].id) {
                    currentTags.push(nv.settings.dataModels.currentTags[j].id);
                }
            }
            separatedTagsIds = currentTags.join('-');

            //console.log(separatedTagsIds);



            tagLink = currentTags.length==0 ? link : isSearchFilterUrlArtistProducts
                ? a9.supplant(filterLink, {tagsId: separatedTagsIds, id: authorName})
                : a9.supplant(filterLink, {tagsId: separatedTagsIds});
            //console.log(tagLink);


            tags.push({e:'a', h: tagLink, c: 'tag', H: nv.settings.dataModels.currentTags[i].title});
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


    tmpls.authorImagePreview = function(obj){

        return {e: 'img', c:obj.isActive?'active':'', n:'image'+obj.index, a: {src: obj.imgSrc}}
    };

    tmpls.author = function (authorsDataItem) {
        return {
            c: 'author-container', a:{index:authorsDataItem.index}, C: [
                {
                    c: 'image',
                    C: {
                        e: 'a',
                        //h: a9.supplant(nv.settings.controlsDescriptors.site.authorAboutPageUrl, {artist: authorsDataItem.name}),
                        h: a9.supplant(nv.settings.controlsDescriptors.site.authorProductsPageUrl, {artist: authorsDataItem.name}),
                        n:'images'
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
            ? a9.supplant(tag.pageUrl, {tagsId: separatedTagsIds, id: tag.authorName})
            : a9.supplant(tag.pageUrl, {tagsId: separatedTagsIds});
        return {c: 'tag', C: {e: 'a', h: href, t: tag.title}}
    };

    tmpls.clear = function () {
        return {c: 'clear'}
    }

}(NV));