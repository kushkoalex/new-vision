(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n;


    tmpls.pageFooter = function(){
        //console.log('pageFooter');
      return {a: {id: 'footer'}, C: tmpls.footer()}
    };

    tmpls.footer = function () {
        var controlsDescriptors = nv.settings.controlsDescriptors;

        return [
            {c: 'copyright', H: a9.supplant(l10n('copyright'), '2015')},
            {
                c: 'em',
                H: l10n('emMadeIn', 'firstUpper'),
                C: [
                    {e: 'br'},
                    {e: 'a', h:controlsDescriptors.site.urlEM,t:l10n('emStudio','firstUpper')}
                ]
            }
        ];
    };
}(NV));