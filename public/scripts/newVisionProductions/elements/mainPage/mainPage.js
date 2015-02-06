NV.mainPage = function ($parent) {
    var nv = this,
        global = nv.global,
        tp = global.cnCt.tp,
        settings = nv.settings,
        mainPageData = settings.dataModels.mainPage;
    tp('mainPage', mainPageData , $parent);
};