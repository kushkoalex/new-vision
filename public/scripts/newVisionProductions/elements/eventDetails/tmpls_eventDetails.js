(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;


    tmpls.eventDetailsContent = function () {
        return [
            tmpls.header(),
            tmpls.eventDetailsWrapper()
        ]
    };

    tmpls.eventDetails = function (eventData) {
        var
            controlsDescriptors = nv.settings.controlsDescriptors,
            imagesContent = [],
            eventImages = eventData.images;

        for (var i = 0; i < eventImages.length; i++) {
            imagesContent.push({
                e: 'li',
                C: {e: 'img', a: {src: controlsDescriptors.site.contentImagesPath + eventImages[i]}}
            })
        }


        return [
            {
                c: 'title-container', C: [
                {
                    c: 'title-wrapper', C: [
                    {c: 'title-mini-description', t: eventData.titleDescription},
                    {c: 'title', t: eventData.title},
                    {c: 'location', H: eventData.location.title}
                ]
                },
                {
                    c: 'get-invite-wrapper', C: [
                    {c: 'get-invite left', H: '&nbsp;'},
                    {c: 'get-invite center', t: 'получить пригласительный'},
                    {c: 'get-invite right', H: '&nbsp;'}]
                }
            ]
            },
            {
                c: 'event-properties-container', C: {
                c: 'event-properties-wrapper', C: [
                    {
                        c: 'event-property', C: [
                        {c: 'property-title', t: 'проект состоится:'},
                        {
                            c: 'event-property-wrapper', C: [
                            {c: 'event-property-inner left', H: '&nbsp;'},
                            {c: 'event-property-inner center', t: eventData.date},
                            {c: 'event-property-inner right', H: '&nbsp;'}
                        ]
                        }
                    ]
                    },
                    {
                        c: 'event-property', C: [
                        {c: 'property-title', t: 'длительность действа:'},
                        {
                            c: 'event-property-wrapper', C: [
                            {c: 'event-property-inner left', H: '&nbsp;'},
                            {c: 'event-property-inner center', t: eventData.duration},
                            {c: 'event-property-inner right', H: '&nbsp;'}
                        ]
                        }
                    ]
                    },
                    {
                        c: 'event-property', C: [
                        //{c:'property-title',t:'проект состоится:'},
                        {
                            c: 'event-property-wrapper', C: [
                            {c: 'event-property-inner left', H: '&nbsp;'},
                            {c: 'event-property-inner center', t: eventData.intervalQuantity},
                            {c: 'event-property-inner right', H: '&nbsp;'}
                        ]
                        }
                    ]
                    },
                    {
                        c: 'event-property', C: [
                        {c: 'property-title', t: 'цены на билеты:'},
                        {
                            c: 'event-property-wrapper', C: [
                            {c: 'event-property-inner left', H: '&nbsp;'},
                            {c: 'event-property-inner center', t: eventData.price},
                            {c: 'event-property-inner right', H: '&nbsp;'}
                        ]
                        }
                    ]
                    }
                ]
            }
            },
            {c: 'image-slider', C: {e: 'ul', c: 'bxslider', C: imagesContent}},
            {
                c: 'event-description-container', C: [
                {
                    c: 'event-description-item', C: [
                    {c: 'title', t: 'действо'},
                    {c: 'text', H: eventData.content.action},
                    {c: 'show-more-button-container', C: [{c: 'grad-panel'}, {c: 'show-more-button'}]},
                    {c: 'bottom-logo-container', C: {c: 'bottom-logo'}}

                ]
                },
                {
                    c: 'event-description-item', C: [
                    {c: 'title', t: 'локация'},
                    {c: 'text', H: eventData.content.location},
                    {c: 'show-more-button-container', C: [{c: 'grad-panel'}, {c: 'show-more-button'}]},
                    {c: 'bottom-logo-container', C: {c: 'bottom-logo'}}

                ]
                },
                {
                    c: 'event-description-item', C: [
                    {c: 'title', t: 'арт группа'},
                    {c: 'text', H: eventData.content.artGroup},
                    {c: 'show-more-button-container', C: [{c: 'grad-panel'}, {c: 'show-more-button'}]},
                    {c: 'bottom-logo-container', C: {c: 'bottom-logo'}}

                ]
                }
            ]
            }
        ];
    };

    tmpls.eventDetailsWrapper = function () {
        return [
            {c: 'event-details', n: 'eventWrapper'},
            {a: {id: 'footer'}, C: tmpls.footer()}
        ]
    };

}(NV));