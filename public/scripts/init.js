A9.ready(function (a9, global) {
    var nv = global.NV,
        settings = nv.settings,
        $body = global.document.body,
        tp = global.cnCt.tp,
        $ = a9.$,
        $footer = $('footer'),
        $mainPage = $('mainPage'),
        $events = $('events'),
        $media = $('media'),
        $partnership = $('partnership'),
        $news = $('news'),
        $contacts = $('contacts'),

    //domNodesQuery = a9.$cs('showDetails'),
    //$showDetails = domNodesQuery.showDetails,
        i,
        u;


    global.cnCt.bindTemplates(nv.tmpls);

    if ($mainPage !== null) {
        nv.mainPage($mainPage);
    }

    if ($events !== null) {
        nv.events($events);
    }

    if ($media !== null) {
        nv.media($media);
    }

    if ($partnership !== null) {
        nv.partnership($partnership);
    }

    if ($news !== null) {
        nv.news($news);
    }

    if ($contacts !== null) {
        nv.contacts($contacts);
    }


    //console.log(domNodesQuery);
    //
    //if ($showDetails[0] !== u) {
    //    for (i = $showDetails.length; i--;) {
    //        nv.scrollToTop($showDetails[i]);
    //    }
    //}

    if ($footer !== null) {
        tp('footer', $footer);
    }
});