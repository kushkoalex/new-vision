NV.authorProductsDetails = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
        settings = nv.settings,
        productsData = settings.dataModels.products,
        authorData = settings.dataModels.author,
        $fragment,
        $fragmentTag,
        build,
        $productDetailsAuthorInfoTextContentCloseBtn,
        buildTag,
        itemsInRow = settings.controlsDescriptors.site.authorProductItemsInRowCount,
        itemsCount = 0;



    build = tp('authorProductsDetails',authorData, $parent);

    $productDetailsAuthorInfoTextContentCloseBtn = build.productDetailsAuthorInfoTextContentCloseBtn;

    a9.addEvent($productDetailsAuthorInfoTextContentCloseBtn,eventOnPointerEnd,function(){
        a9.$('productDetailsAuthorInfo').style.display='none';
    });

};