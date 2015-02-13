NV.events = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        eventsData = settings.dataModels.events,


        $fragment,
        build;

    function buildEvensForm(eventsData){
        $fragment = global.document.createDocumentFragment();

        a9.each(eventsData, function(event){
            build = tp('event',event, $fragment)
        });

        $events.appendChild($fragment);
    }


    var $events = tp('events', $parent).eventsWrapper;

    buildEvensForm(eventsData);

};