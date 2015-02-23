(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.partnership = function () {
        return [
            tmpls.header(),
            tmpls.partnershipForm()
        ];
    };

    tmpls.partnershipForm = function () {
        return [
            {
                c: 'contacts-form-wrapper', C: [
                {
                    c: 'feedback-form-wrapper', C: {
                    c: 'feedback-form', C: {
                        c: 'feedback-form-content-wrapper', C: [
                            {c: 'title', t: 'title is not binded to topic\'s name'},
                            {c: 'text',H:'some long long long text some long long long text some long long long text some long long long text '}
                        ]
                    }
                }
                },
                {c: 'map-wrapper', a: {id: 'map'}},
                {c: 'clear'}
            ]
            },
            {a: {id: 'footer'}, C: tmpls.footer()}
        ];
    };

}(NV));