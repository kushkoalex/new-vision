JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0;

    tmpls.mfo = function(fieldModel){
        var result,
            currentId = 'jmfFieldMFOInput_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-input-field-wrapper',
            content,
            u,
            labelAttributes = {'for': currentId};
        idIndex += 1;

        if (fieldModel.isEditable === false){
            a.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-default-input-field-readonly';
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-default-input-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            {c: 'jmfValidateInputSourceWrapper jmf-field-mfo-wrapper', C:[
                tmpls.input({
                    cVisual: 'jmf-field-input jmf-field-mfo-input',
                    cWrapper: 'jmf-field-mfo-input-wrapper',
                    v: fieldModel.value,
                    a: a,
                    innerContent: {
                        e: 'label',
                        a: labelAttributes,
                        c: 'jmf-field-mfo-bank-name-wrapper',
                        C: [
                            {c: 'jmf-field-mfo-bank-name-triangle-wrapper', C:
                                {c: 'jmf-field-mfo-bank-name-triangle'}
                            },
                            {c: 'jmf-field-mfo-bank-name-text-wrapper', n: 'bankNameWrapper', C:
                                {c: 'jmf-field-mfo-bank-name-default-text', n: 'bankNameDefaultText', H: l10n('jmfFieldMFOBankNameDefaultText')}
                            }
                        ]
                    }
                }),
                {e: 'label', a: labelAttributes, c: 'jmf-field-mfo-bank-id-label', t: l10n('jmfFieldMFOBankId')},
                {e: 'label', a: labelAttributes, c: 'jmf-field-mfo-bank-name-label', t: l10n('jmfFieldMFOBankName')}
            ]}
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;

    };

    tmpls.mfoBankNameNone = function(){
        return {c: 'jmf-field-mfo-bank-name-none', n: 'bankNameNone', H: l10n('jmfFieldMFOBankNameNone')};
    };

    tmpls.mfoBankName = function(){
        return {c: 'jmf-field-mfo-bank-name', n: 'bankName'};
    };
});
