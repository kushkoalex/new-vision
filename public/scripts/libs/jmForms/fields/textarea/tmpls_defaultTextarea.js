JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0;

    tmpls.defaultTextarea = function(fieldModel){
        var result,
            currentId = 'jmfFieldDefaultTextarea_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            textareaSettings = {
                cVisual: 'jmf-field-textarea jmf-field-default-textarea',
                cWrapper: 'jmfValidateTextareaSourceWrapper jmf-field-textarea-wrapper',
                v: fieldModel.value,
                a: a
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-textarea-field-wrapper',
            content,
            u;
        idIndex += 1;

        if (fieldModel.isEditable === false){
            a.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-textarea-field-readonly';
        }

        if ('placeholder' in fieldModel){
            textareaSettings.placeholder = fieldModel.placeholder;
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-textarea-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            tmpls.textarea(textareaSettings)
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;

    };
});
