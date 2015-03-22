NV.newsDetails = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        newsData = settings.dataModels.newsDetails,
        $fragment,
        build;

    function buildNewsForm(newsData){
        $fragment = global.document.createDocumentFragment();



        build = tp('newsDetails', newsData, $fragment);

        //a9.each(eventData, function(event){
        //    build = tp('event',event, $fragment)
        //});

        $newsDetails.appendChild($fragment);
    }

    var $newsDetails = tp('newsDetailsContent', $parent).newsWrapper;

    buildNewsForm(newsData);
};