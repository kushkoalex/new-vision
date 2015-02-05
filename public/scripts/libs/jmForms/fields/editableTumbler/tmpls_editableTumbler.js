JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0;

    //console.log(jmf);

    tmpls.editableTumbler = function(fieldModel){
        var result,
            currentId = 'jmfFieldTumblerInput_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-input-field-wrapper',
            content,
            u,
            onText = fieldModel.onText,
            offText = fieldModel.offText;
        idIndex += 1;

        if (onText !== u){
            onText = l10n(onText);
        } else{
            onText = '';
        }
        if (offText !== u){
            offText = l10n(offText);
        } else{
            offText = '';
        }

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
            tmpls.input({
                cVisual: 'jmf-field-input jmf-field-tumbler-input',
                cWrapper: 'jmfValidateInputSourceWrapper jmf-field-tumbler-input-wrapper',
                v: fieldModel.value,
                a: a,
                innerContent: {c: 'jmf-field-tumbler-tumbler-wrapper', C:
                    tmpls.tumbler({
                        name: fieldModel.tumblerName,
                        isChecked: fieldModel.isTumblerChecked || false,
                        onText: onText,
                        offText: offText
                    })
                }
            })
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;

    };
});
