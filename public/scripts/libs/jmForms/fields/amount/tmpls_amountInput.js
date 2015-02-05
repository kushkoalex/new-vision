JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0;

    tmpls.amountInput = function(fieldModel){
        var result,
            currentId = 'jmfFieldAmountInput_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-input-field-wrapper',
            content,
            u;
        idIndex += 1;

        if (fieldModel.isEditable === false){
            a.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-amount-input-field-readonly';
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-amount-input-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            tmpls.input({
                cVisual: 'jmf-field-input jmf-field-amount-input',
                cWrapper: 'jmfValidateInputSourceWrapper jmf-field-amount-input-wrapper',
                v: fieldModel.value,
                a: a,
                innerContent: {c: 'jmf-field-amount-input-currency jmf-field-amount-input-currency_' + fieldModel.currency, t: l10n(fieldModel.currency + '_code')}
            })
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;

    };
});
