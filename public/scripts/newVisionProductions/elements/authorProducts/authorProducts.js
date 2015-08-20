NV.authorProducts = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        productsData = settings.dataModels.products,
        authorData = settings.dataModels.author,
        $fragment,
        $fragmentTag,
        build,
        buildTag,
        itemsInRow = settings.controlsDescriptors.site.authorProductItemsInRowCount,
        itemsCount = 0;

    function buildMediaForm(productsData) {
        $fragment = global.document.createDocumentFragment();
        $fragmentTag = global.document.createDocumentFragment();

        //console.log('productsDataItem '+productsData);

        a9.each(productsData, function (productsDataItem) {

            //console.log(productsDataItem);

            if (itemsCount % itemsInRow == 0) {
                tp('clear', $fragment)
            }



            productsDataItem.hasDetailsLink = true;
            productsDataItem.authorName = authorData.name;

            build = tp('product', productsDataItem, $fragment);

            itemsCount++;


            var $tags = build.tags;

            //console.log(productsDataItem.tags);

            a9.each(productsDataItem.tags, function (tag) {
                //console.log(tag);
                tag.pageUrl =  nv.settings.controlsDescriptors.site.searchFilterUrlArtistProducts;
                tag.isSearchFilterUrlArtistProducts = true;
                tag.authorName = productsDataItem.author.name;
                buildTag = tp('tag', tag, $fragmentTag);

                $tags.appendChild($fragmentTag);
            });

        });

        tp('clear', $fragment);

        $products.appendChild($fragment);
    }

    var $products = tp('authorProducts',authorData, $parent).productsBlocks;


    buildMediaForm(productsData);
};