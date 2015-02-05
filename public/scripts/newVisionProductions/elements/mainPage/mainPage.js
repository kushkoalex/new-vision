NV.mainPage = function ($parent) {
    var nv = this,
        settings = nv.settings,
        global = nv.global,
        tp = global.cnCt.tp,
        settings = nv.settings,
        mainPageData = settings.dataModels.mainPage;




    //nv.imageFrame($parent);


    tp('imageFrame', mainPageData.mainBanners , $parent);

};