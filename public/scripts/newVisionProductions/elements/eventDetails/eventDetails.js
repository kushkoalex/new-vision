NV.eventDetails = function($parent){
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        eventData = settings.dataModels.event,


        $fragment,
        build;

    function buildEvensForm(eventData){
        $fragment = global.document.createDocumentFragment();

        build = tp('eventDetails', eventData, $fragment);

        //a9.each(eventData, function(event){
        //    build = tp('event',event, $fragment)
        //});

        $eventDetails.appendChild($fragment);
    }


    var $eventDetails = tp('eventDetailsContent', $parent).eventWrapper;

    buildEvensForm(eventData);
};