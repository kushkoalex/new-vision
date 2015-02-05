JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0;

    tmpls.defaultInput = function(fieldModel){
        var result,
            currentId = 'jmfFieldDefaultInput_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            inputSettings = {
                cVisual: 'jmf-field-input jmf-field-default-input',
                cWrapper: 'jmfValidateInputSourceWrapper jmf-field-default-input-wrapper',
                v: fieldModel.value,
                a: a
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-input-field-wrapper',
            content,
            u;
        idIndex += 1;

        if (fieldModel.isEditable === false){
            a.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-default-input-field-readonly';
        }

        if ('placeholder' in fieldModel){
            inputSettings.placeholder = fieldModel.placeholder;
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-default-input-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            tmpls.input(inputSettings)
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;

    };
});
