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
        itemsInRow = settings.controlsDescriptors.site.authorProductItemsInRowCount,
        itemsCount = 0;

    function buildMediaForm(authorsData) {
        $fragment = global.document.createDocumentFragment();
        $fragmentTag = global.document.createDocumentFragment();
        //console.log(authorsData);

        a9.each(authorsData, function (authorsDataItem) {

            //console.log(authorsDataItem);

            if (itemsCount % itemsInRow == 0) {
                tp('clear', $fragment)
            }

            build = tp('author', authorsDataItem, $fragment);

            itemsCount++;


            var $tags = build.tags;

            a9.each(authorsDataItem.tags, function (tag) {
                //console.log(tag);

                buildTag = tp('tag', tag, $fragmentTag);

                $tags.appendChild($fragmentTag);
            });

        });

        $authors.appendChild($fragment);
    }

    var $authors = tp('authors', $parent).authorsBlocks;


    buildMediaForm(authorsData);
};