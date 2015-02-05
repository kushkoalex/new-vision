JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0;

    tmpls.defaultDate = function(fieldModel){
        var result,
            currentId = 'jmfFieldDefaultDate_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-date-field-wrapper',
            content,
            u;

        idIndex += 1;

        if (fieldModel.isEditable === false){
            a.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-default-date-field-readonly';
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-default-date-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            tmpls.input({
                cVisual: 'jmf-field-input jmf-field-default-date-input',
                cWrapper: 'jmfValidateInputSourceWrapper jmf-field-default-date-input-wrapper',
                v: fieldModel.value,
                a: a,
                icon: 'jmf-field-default-date'
            })
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;

    };
});

