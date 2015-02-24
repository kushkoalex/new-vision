NV.news  = function($parent){
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        $fragment,
        newsData = settings.dataModels.news,
        build;

    function buildNewsForm() {

        $fragment = global.document.createDocumentFragment();

        //console.log(settings.dataModels);

        a9.each(newsData, function(newsDataItem){
            tp('newsBlock',newsDataItem,$fragment);
        });

        tp('clear',$fragment);

        $news.appendChild($fragment);
    }

    var $news = tp('news',$parent).newsBlocks;
    buildNewsForm();
};