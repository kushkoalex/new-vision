JMFORMS.modulesForInit.push(function(jmf){
    var a9 = jmf.global.A9;
    jmf.helpers.prepareFieldMask = function(jmField, fieldModel){
        var validatorDescriptor = jmField.validatorDescriptor,
            hasValidator = validatorDescriptor !== null,
            valueType = jmField._valueType,
            mask,
            isNeedMask = false;

        switch (valueType){
            case "number":
                mask = {n: 'number', on: fieldModel.maskOn};
                isNeedMask = true;
                break;
            case "decimal":
                //todo parameters
                mask = {n: 'decimal', on: fieldModel.maskOn};
                isNeedMask = true;
                break;
            case "date":
                //todo parameters
                mask = {n: 'date', on: fieldModel.maskOn};
                isNeedMask = true;
                break;
            case "calendar":
                //todo parameters
                mask = [
                    {n: 'dateStatic', on: 'blur', divider: '.', format: ['DD','MM','YYYY']},
                    {n: 'dateDynamic', on: 'change', divider: '.', format: ['DD','MM','YYYY']}
                ];
                isNeedMask = true;
                break;
        }

        if (isNeedMask){
            if (hasValidator){
                a9.validation.helpers.addMaskToValidatorDescriptor(validatorDescriptor, mask);
            } else{
                jmField._maskInsatance = a9.masking.make(jmField.$input, mask.n, fieldModel.maskOn, true, mask);
            }
        }
    };
});
