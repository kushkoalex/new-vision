NV.authorProductsDetails = function ($parent) {
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



    tp('authorProductsDetails',authorData, $parent)



};