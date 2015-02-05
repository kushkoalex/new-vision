A9.ready(function (a9, global) {
    var nv = global.NV,
        settings = nv.settings,
        $body = global.document.body,
        tp = global.cnCt.tp,
        $ = a9.$,
        $footer = $('footer'),
        $mainPage = $('mainPage'),
        u;

    global.cnCt.bindTemplates(nv.tmpls);

    if ($mainPage !== null) {
        nv.mainPage($mainPage);
    }

    if ($footer !== null) {
        tp('footer', $footer);
    }


});