NV.media = function($parent){
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        mediaData = settings.dataModels.media,
        $fragment,
        build;

    function buildMediaForm(mediaData){
        $fragment = global.document.createDocumentFragment();

        a9.each(mediaData, function(mediaItem){
            build = tp('mediaItem',mediaItem, $fragment)
        });

        $media.appendChild($fragment);
    }
    var $media = tp('media', $parent).mediaItems;
    buildMediaForm(mediaData);
};