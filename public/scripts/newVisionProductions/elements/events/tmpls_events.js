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
            eventInfoClass = 'event-info',
            orderButtonText,
            orderButton,
            eventExpiredClass='',
            dateWrapperClass,
            eventDateText;

        if(eventData.expired){
            eventExpiredClass=' expired';
        }

        switch (eventData.ticketOrderType) {
            case 'order':
                orderButtonText = l10n('ticketType_orderTicket');
                orderButton = {e: 'a', h: '#', c: 'button right'+eventExpiredClass, t: orderButtonText}
                break;
            case 'free':
                orderButtonText = l10n('ticketType_eventIsFree');
                orderButton = {c: 'button right'+eventExpiredClass, t: orderButtonText}
                break;
            case 'invite':
                orderButtonText = l10n('ticketType_getInvite');
                orderButton = {c: 'button right'+eventExpiredClass, t: orderButtonText}
                break;
            case 'noSeats':
                orderButtonText = l10n('ticketType_noSeats');
                orderButton = {c: 'button right no-seats', t: orderButtonText};
                break;
            default :
                orderButtonText = l10n('ticketType_orderTicket');
                orderButton = {c: 'button right'+eventExpiredClass, t: orderButtonText};
                break;
        }


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
            graphicsContent = {
                e: 'iframe',
                a: {width: '788', height: '500', src: eventData.previewContent.videoSrc, frameborder: '0'}
            }
        }


        if (eventData.highlighted) {
            eventInfoClass += ' with-stripe';
            eventInfo.push({
                c: 'stripe-wrapper', C: [
                    {c: 'stripe left', H: '&nbsp;'},
                    {c: 'stripe center', H: eventData.highlightText},
                    {c: 'stripe right', H: '&nbsp;'}
                ]
            })
        }

        dateWrapperClass ='date-block-wrapper';


        if(eventData.expired){
            dateWrapperClass+=' expired';
            eventDateText=l10n('eventPass');
        }
        else{
            eventDateText=l10n('eventWillBe');
        }

        eventInfo.push({
            c: dateWrapperClass, C: [
                {c: 'title', t: eventDateText},
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
                {
                    c: 'location',
                    H: eventData.location.title + ' ',
                    C: {e: 'span', C: {e: 'a', h:eventData.location.addressMapUrl, a: { target:'_blank'}, t: eventData.location.address}}
                }
            ]
        });

        eventInfo.push({c: 'separator-wave'});
        eventInfo.push({c: 'description', H: eventData.description});
        eventInfo.push({
            c: 'buttons-wrapper', C: [
                {
                    e: 'a',
                    h: a9.supplant(controlsDescriptors.site.eventDetailsPageUrl, {id: eventData.id}),
                    c: 'button left',
                    t: l10n('learnMore')
                },
                orderButton
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