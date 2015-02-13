(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.events = function () {
        return [
            tmpls.header(),
            tmpls.eventsWrapper()
        ]
    };

    tmpls.eventsWrapper = function () {
        return [
            {c: 'events-wrapper', n: 'eventsWrapper'},
            {a: {id: 'footer'}, C: tmpls.footer()}
        ]
    };

    tmpls.event = function (eventData) {
        var controlsDescriptors = nv.settings.controlsDescriptors,
            graphicsContent,
            eventInfo = [],
            eventInfoClass = 'event-info';


        if (eventData.previewContent.contentType == 'image') {
            if (eventData.previewContent.contentImages && eventData.previewContent.contentImages[0]) {
                graphicsContent = {
                    e: 'img',
                    a: {src: controlsDescriptors.site.contentImagesPath + eventData.previewContent.contentImages[0]}
                };
            }
            else {
                graphicsContent = {e: 'img'}
            }
        } else if (eventData.previewContent.contentType == 'video') {
            graphicsContent = {e: 'iframe', a:{width:'788', height:'500', src:eventData.previewContent.videoSrc, frameborder:'0'}}
        }


        if (eventData.highlighted) {
            eventInfoClass += ' with-stripe';
            eventInfo.push({
                c: 'stripe-wrapper', C: [
                    {c: 'stripe left', H: '&nbsp;'},
                    {c:'stripe center',H:eventData.highlightText},
                    {c: 'stripe right', H: '&nbsp;'}
                ]
            })
        }

        eventInfo.push({
            c: 'date-block-wrapper', C: [
                {c: 'title', t: l10n('eventWillBe')},
                {
                    c: 'date-wrapper', C: [
                    {c: 'date wave left'},
                    {c: 'date', t: eventData.date},
                    {c: 'date wave right'}
                ]
                }
            ]
        });

        eventInfo.push({
            c: 'title-wrapper', C: [
                {c: 'title-mini-description', t: eventData.titleDescription},
                {c: 'title', t: eventData.title},
                {c: 'location', H: eventData.location.title}
            ]
        });

        eventInfo.push({c: 'separator-wave'});
        eventInfo.push({c: 'description', H: eventData.description});
        eventInfo.push({
            c: 'buttons-wrapper', C: [
                {e: 'a', h: 'event-details.html', c: 'button left', t: l10n('learnMore')},
                {e: 'a', h: '#', c: 'button right', t: l10n('orderTicket')}
            ]
        });


        return {
            c: 'event', C: [
                {c: 'event-content', C: graphicsContent},
                {
                    c: eventInfoClass, C: eventInfo
                }
            ]
        }
    };

}(NV));