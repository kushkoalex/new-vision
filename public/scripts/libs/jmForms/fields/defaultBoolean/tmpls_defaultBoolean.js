JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        l10n = jmf.global.A9.l10n,
        idIndex = 0;

    tmpls.defaultBoolean = function(fieldModel){
        var result,
            currentId = 'jmfFieldDefaultBoolean_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-boolean-field-wrapper',
            content,
            u;

        idIndex += 1;

        if (fieldModel.isEditable === false){
            a.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-default-checkbox-field-readonly';
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-default-checkbox-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            tmpls.checkbox({
                cVisual: 'jmf-field-checkbox jmf-field-default-checkbox',
                cWrapper: 'jmfValidateInputSourceWrapper jmf-field-default-checkbox-wrapper',
                a: a,
                isChecked: fieldModel.isChecked
            })
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;
    };
});
