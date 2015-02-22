(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n,
        u;

    tmpls.contacts = function () {
        return [
            tmpls.header(),
            tmpls.contactsForm()
        ];
    };

    tmpls.contactsForm = function () {
        return [
            {
                c: 'contacts-form-wrapper', C: [
                {c: 'feedback-form-wrapper',C:{
                    c: 'feedback-form', C: {
                        c: 'feedback-form-content-wrapper', C: [
                            {c: 'title', t: l10n('contactsTitle')},
                            {c: 'text',C:[
                                {c:'address'},
                                {c:'feedback-title'},
                                {c:'feedback-fields',C:[
                                    {C:[{c:'title'},{e:'input',a:{type:'text'}}]}
                                ]}
                            ]}
                        ]
                    }
                }},
                {c: 'map-wrapper'},
                {c:'clear'}
            ]
            },
            {a: {id: 'footer'}, C: tmpls.footer()}
        ];
    };


}(NV));