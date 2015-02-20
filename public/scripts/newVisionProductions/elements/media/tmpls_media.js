(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.media = function () {
        return [
            tmpls.header(),
            tmpls.mediaItems()
        ]
    };

    tmpls.mediaItems = function () {
        return [
            {c:'media-items-wrapper',C:{ c: 'media-items', n: 'mediaItems'}},
            {a: {id: 'footer'}, C: tmpls.footer()}
        ]
    };

    tmpls.mediaItem = function (mediaItemData) {
        var controlsDescriptors = nv.settings.controlsDescriptors,
            graphicsContent,
            eventInfo = [],
            eventInfoClass = 'event-info';

        return {
            c: 'media-item', C: [
                {c: 'media-content',C:{e: 'iframe', a:{width:'560', height:'338', src:mediaItemData.mediaSrc, frameborder:'0'}}},
                {
                    c: 'description', C: [
                    {c: 'logo'},
                    {c: 'title', t: mediaItemData.title},
                    {c: 'text', H: mediaItemData.text}
                ]
                },
                {
                    c: 'clear'
                }
            ]
        }
    };

}(NV));