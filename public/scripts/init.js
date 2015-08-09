A9.ready(function (a9, global) {
    var nv = global.NV,
        settings = nv.settings,
        $body = global.document.body,
        tp = global.cnCt.tp,
        $ = a9.$,
        $footer = $('footer'),
        $mainPage = $('mainPage'),
        $events = $('events'),
        $eventDetails = $('eventDetails'),
        $media = $('media'),
        $siteContent = $('siteContent'),
        $news = $('news'),
        $newsDetails = $('newsDetails'),
        $contacts = $('contacts'),
        $authors = $('authors'),
        $aboutAuthor = $('aboutAuthor'),
        $authorEvents = $('authorEvents'),
        $products = $('products'),
        $authorProducts = $('authorProducts'),
        $authorProductsDetails = $('authorProductsDetails'),

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

    if ($eventDetails !== null) {
        nv.eventDetails($eventDetails);
    }

    if ($media !== null) {
        nv.media($media);
    }

    if ($siteContent !== null) {
        nv.siteContent($siteContent);
    }

    if ($news !== null) {
        nv.news($news);
    }

    if ($newsDetails !== null) {
        nv.newsDetails($newsDetails);
    }

    if ($contacts !== null) {
        nv.contacts($contacts);
    }

    if ($authors !== null) {
        nv.authors($authors);
    }

    if ($products !== null) {
        nv.products($products);
    }

    if ($aboutAuthor !== null) {
        nv.aboutAuthor($aboutAuthor);
    }

    if ($authorEvents !== null) {
        nv.authorEvents($authorEvents);
    }

    if ($authorProducts !== null) {
        nv.authorProducts($authorProducts);
    }

    if ($authorProductsDetails !== null) {
        nv.authorProductsDetails($authorProductsDetails);
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