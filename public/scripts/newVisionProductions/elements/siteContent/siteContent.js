NV.siteContent = function($parent){
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        siteContentData = settings.dataModels.siteContent,
        $fragment,
        build;


    function buildForm(){
        $fragment = global.document.createDocumentFragment();

        $partnership.appendChild($fragment);
    }
//console.log(settings.dataModels);
    var $partnership = tp('siteContent', siteContentData, $parent).r;
    //buildForm();
};