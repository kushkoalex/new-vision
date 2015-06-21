NV.authors = function($parent){
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        authorsData = settings.dataModels.authors,
        $fragment,
        build;

    function buildMediaForm(authorsData){
        $fragment = global.document.createDocumentFragment();

        //a9.each(mediaData, function(mediaItem){
        //    build = tp('mediaItem',mediaItem, $fragment)
        //});

        $authors.appendChild($fragment);
    }
    var $authors = tp('authors', $parent).authorsBlocks;
    buildMediaForm(authorsData);
};