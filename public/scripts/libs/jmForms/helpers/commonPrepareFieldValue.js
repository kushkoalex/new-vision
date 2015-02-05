JMFORMS.modulesForInit.push(function(jmf){
    var jmfHelpers = jmf.helpers;
    jmfHelpers.commonPrepareFieldValue = function(jmField, fieldModel){
        var defaultValue,
            u;
        if (!('value' in fieldModel) || (fieldModel.value === null)){
            defaultValue = fieldModel.defaultValue;
            if (defaultValue !== u){
                jmField._value = jmfHelpers.commonValueParsers[jmField._valueType](jmField, defaultValue);
                fieldModel.value = jmField.get();
            } else{
                fieldModel.value = '';
            }
        }
    };
});
