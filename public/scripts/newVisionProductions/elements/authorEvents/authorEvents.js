NV.authorEvents = function ($parent) {
    var nv = this,
        global = nv.global,
        tp = global.cnCt.tp,
        settings = nv.settings,
        authorData = settings.dataModels.author;
    tp('authorEvents', authorData, $parent);
};