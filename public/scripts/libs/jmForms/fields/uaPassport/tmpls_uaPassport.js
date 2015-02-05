JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        idIndex = 0,
        u;

    tmpls.uaPassport = function(fieldModel){
        var result,
            currentId = 'jmfFieldPassport_' + idIndex,
            currentIdSeries = 'jmfFieldPassportSeries_' + idIndex,
            currentIdNumber = 'jmfFieldPassportNumber_' + idIndex,
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-input-field-wrapper',
            content,
            a = {};

        idIndex += 1;

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-default-input-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            {c: 'jmf-field-ua-passport-wrapper jsInputWrapper', C:[
                tmpls.input({
                    cVisual: 'jmf-field-input jmf-field-default-input jmf-field-ua-passport-series-input',
                    v: fieldModel.value,
                    i: currentIdSeries,
                    n: 'series'
                }),
                tmpls.input({
                    cVisual: 'jmf-field-input jmf-field-default-input jmf-field-ua-passport-number-input',
                    v: fieldModel.value,
                    i: currentIdNumber,
                    n: 'number'
                }),
                {e: 'label', a: {for: currentIdSeries}, c: 'jmf-field-passport-series-label', t: l10n('jmfFieldPassportSeries')},
                {e: 'label', a: {for: currentIdNumber}, c: 'jmf-field-passport-number-label', t: l10n('jmfFieldPassportNumber')}
            ]}
        ];

        a.name = fieldModel.name;
        a.id = currentId;
        content.push(tmpls.input({
            cVisual: 'jmf-field-input jmf-field-default-input jmf-field-ua-passport-input',
            cWrapper: 'jmfValidateInputSourceWrapper jmf-field-default-input-wrapper',
            v: fieldModel.value,
            a: a,
            n: 'passportValue'
        }));

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;
    };
});
