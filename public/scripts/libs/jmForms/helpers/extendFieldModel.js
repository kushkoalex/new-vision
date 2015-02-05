JMFORMS.modulesForInit.push(function(jmf){
    jmf.helpers.extendFieldModel = function(fieldModel){
        if (!('validateOn' in fieldModel)){
            fieldModel.validateOn = 'blur';
        }
        if (!('maskOn' in fieldModel)){
            fieldModel.maskOn = 'change';
        }
        return fieldModel;
    };

});
