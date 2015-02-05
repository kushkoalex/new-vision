JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0;

    tmpls.countryCode = function(fieldModel){
        var result,
            currentId = 'jmfFieldCountryCodeInput_' + idIndex,
            attributes = {
                id: currentId
            },
            realInputAttributes = {
                name: fieldModel.name
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-input-field-wrapper',
            content,
            u,
            labelAttributes = {'for': currentId};
        idIndex += 1;

        if (fieldModel.isEditable === false){
            attributes.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-default-input-field-readonly';
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-default-input-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            {c: 'jmfValidateInputSourceWrapper jmf-field-country-code-wrapper', C:[
                tmpls.input({
                    T: 'hidden',
                    n: 'countryCode',
                    a: realInputAttributes
                }),
                tmpls.input({
                    cVisual: 'jmf-field-input jmf-field-country-code-input',
                    cWrapper: 'jmf-field-country-code-input-wrapper',
                    v: fieldModel.value,
                    a: attributes,
                    n: 'countryName',
                    innerContent: {
                        e: 'label',
                        a: labelAttributes,
                        c: 'jmf-field-country-code-country-name-wrapper',
                        C: [
                            {c: 'jmf-field-country-code-country-name-triangle-wrapper', C:
                                {c: 'jmf-field-country-code-country-name-triangle'}
                            },
                            {c: 'jmf-field-country-code-country-name-text-wrapper', n: 'countryNameWrapper', C:
                                {c: 'jmf-field-country-code-country-name-default-text', n: 'countryNameDefaultText', H: l10n('jmfFieldCountryCodeCountryNameDefaultText')}
                            }
                        ]
                    }
                }),
                {e: 'label', a: labelAttributes, c: 'jmf-field-country-code-country-name-label', t: l10n('jmfFieldCountryCodeCountryName')},
                {e: 'label', a: labelAttributes, c: 'jmf-field-country-code-country-id-label', t: l10n('jmfFieldCountryCodeCountryId')}
            ]}
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;

    };

    tmpls.countryCodeCountryNameNone = function(){
        return {c: 'jmf-field-country-code-country-name-none', n: 'countryNameNone', H: l10n('jmfFieldCountryCodeCountryNameNone')};
    };

    tmpls.countryCodeCountryName = function(){
        return {c: 'jmf-field-country-code-country-name', n: 'countryName'};
    };
});
