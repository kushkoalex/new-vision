NV.partnership = function($parent){
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        $fragment,
        build;


    function buildForm(){
        $fragment = global.document.createDocumentFragment();



        $partnership.appendChild($fragment);
    }


    var $partnership = tp('partnership', $parent).r;

    buildForm();

};