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

    tmpls.feedbackForm = function () {
        return {
            e:'form', a:{action:'/feedback'}, c: 'form-feedback', C: [
                {c: 'feedback-title', t: l10n('feedbackTitle')},
                {
                c: 'feedback-fields', C: [
                    {
                        c: 'feedback-field name', C: [
                        {c: 'title', t: l10n('feedbackFields_Name', 'firstUpper')},
                        {c: 'input-wrapper', C: {e: 'input',n:'customerName', a: {type: 'text'}}}
                    ]
                    },
                    {
                        c: 'feedback-field email', C: [
                        {c: 'title', H: l10n('feedbackFields_Email', 'firstUpper')},
                        {c: 'input-wrapper', C: {e: 'input',n:'email', a: {type: 'text'}}}
                    ]
                    },
                    {
                        c: 'feedback-field anti-spam', C: [
                        {c: 'title', H: l10n('feedbackFields_AntiSpam', 'firstUpper')},
                        {c: 'input-wrapper', C: {e: 'input',n:'antiSpam', a: {type: 'text'}}}
                    ]
                    },
                    {
                        c: 'feedback-field question', C: [
                            {c: 'title', t: l10n('feedbackFields_Question', 'firstUpper')},
                            {c: 'input-wrapper', C: {e: 'textarea',n:'question'}}
                        ]
                    }

                ]
            }, {c: 'button', t: 'Отправить', n: 'button'}]
        }
    };

    tmpls.contactsForm = function () {
        return [
            {
                c: 'contacts-form-wrapper', C: [
                {
                    c: 'feedback-form-wrapper', C: {
                    c: 'feedback-form', C: {
                        c: 'feedback-form-content-wrapper', C: [
                            {c: 'title', t: l10n('contactsTitle')},
                            {
                                c: 'text', C: [
                                {c: 'address', H: l10n('address')},

                                {n:'formContainer'}
                            ]
                            }
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

    tmpls.thanks = function(){
        return{c:'thanks',t:l10n('feedbackFields_thanks','firstUpper')}
    };



}(NV));