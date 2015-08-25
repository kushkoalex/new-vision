NV.authors = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        authorsData = settings.dataModels.authors,
        $fragment,
        $fragmentTag,
        build,
        buildTag,
        //$authorProducts=[],
        itemsInRow = settings.controlsDescriptors.site.authorProductItemsInRowCount,
        itemsCount = 0;

    function buildMediaForm(authorsData) {
        $fragment = global.document.createDocumentFragment();
        $fragmentTag = global.document.createDocumentFragment();
        //console.log(authorsData);

        a9.each(authorsData, function (authorsDataItem) {

            //console.log(authorsDataItem);

            if (itemsCount !== 0 && itemsCount % itemsInRow == 0) {
                tp('clear', $fragment)
            }

            build = tp('author', authorsDataItem, $fragment);
            //$authorProducts.push(build.r);
            itemsCount++;


            var $tags = build.tags;

            a9.each(authorsDataItem.tags, function (tag) {
                //console.log(tag);

                tag.pageUrl = nv.settings.controlsDescriptors.site.searchFilterUrlArtists;
                buildTag = tp('tag', tag, $fragmentTag);

                $tags.appendChild($fragmentTag);
            });

        });

        tp('clear', $fragment);

        $authors.appendChild($fragment);
    }

    var $authors = tp('authors', $parent).authorsBlocks;

    nv.searchForm($parent, settings.controlsDescriptors.site.searchFilterUrlArtists);

    buildMediaForm(authorsData);
};