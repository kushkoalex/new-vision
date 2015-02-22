NV.contacts = function($parent){
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        $fragment,
        build;


    function buildContactsForm(){
        $fragment = global.document.createDocumentFragment();

        //a9.each(mediaData, function(mediaItem){
        //    build = tp('mediaItem',mediaItem, $fragment)
        //});

        $contacts.appendChild($fragment);
    }
    var $contacts = tp('contacts', $parent).r;
    buildContactsForm();

};
