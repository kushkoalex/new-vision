NV.products = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        productsData = settings.dataModels.products,
        $fragment,
        $fragmentTag,
        build,
        buildTag,
        itemsInRow = settings.controlsDescriptors.site.authorProductItemsInRowCount,
        itemsCount = 0;

    function buildMediaForm(productsData) {
        $fragment = global.document.createDocumentFragment();
        $fragmentTag = global.document.createDocumentFragment();
        //console.log(authorsData);

        a9.each(productsData, function (productsDataItem) {

            //console.log(authorsDataItem);

            if (itemsCount % itemsInRow == 0) {
                tp('clear', $fragment)
            }

            productsDataItem.hasDetailsLink = true;
            productsDataItem.h = a9.supplant(nv.settings.controlsDescriptors.site.authorProductsDetailsPageUrl, {
                artist: productsDataItem.author.name,
                startSlide: productsDataItem.photoIndex || 0
            });

            build = tp('product', productsDataItem, $fragment);

            itemsCount++;


            var $tags = build.tags;

            a9.each(productsDataItem.tags, function (tag) {
                //console.log(tag);

                tag.pageUrl = nv.settings.controlsDescriptors.site.searchFilterUrlProducts;

                buildTag = tp('tag', tag, $fragmentTag);

                $tags.appendChild($fragmentTag);
            });

        });

        tp('clear', $fragment);

        $products.appendChild($fragment);
    }

    var $products = tp('products', $parent).productsBlocks;

    nv.searchForm($parent, settings.controlsDescriptors.site.searchFilterUrlProducts);

    buildMediaForm(productsData);
};