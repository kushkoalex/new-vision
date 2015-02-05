A9.ready(function (a9, global) {
    var nv = global.NV,
        settings = nv.settings,
        $body = global.document.body,
        tp = global.cnCt.tp,
        $ = a9.$,


        $footer = $('footer'),

        u;

    global.cnCt.bindTemplates(nv.tmpls);



    if($footer!==null){



        //nv.footer($footer);
        tp('footer','',$footer);
    }


});