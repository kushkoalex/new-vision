(function(a9){
    var regInt = /[^а-яёєґії ]/ig,
        defaultMinLength = 10,
        defaultMaxLength = 256,
        validation = a9.validation,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        microvalidators = validation.microvalidators,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax;
    validation.validators.fullName = function(value, validatorDescriptor, inputSourceNode){
        var minLength = 'minLength' in validatorDescriptor ? validatorDescriptor.minLength : defaultMinLength,
            maxLength = 'maxLength' in validatorDescriptor ? validatorDescriptor.maxLength : defaultMaxLength,
            lengthCache,
            valueProcessed;

        value = getUnmaskedValue(value, validatorDescriptor, inputSourceNode);
        lengthCache = value.length;
        if (isLessMin(lengthCache, validatorDescriptor, minLength)){
            validatorDescriptor.invalidReason = 'lessMinLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
            return false;
        }
        if (isMoreMax(lengthCache, validatorDescriptor, maxLength)){
            validatorDescriptor.invalidReason = 'moreMaxLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
            return false;
        }

        valueProcessed = value.replace(regInt);
        if (value !== valueProcessed){
            validatorDescriptor.invalidReason = 'incorrectSymbols';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectSymbols;
            return false;
        }
//        todo check full

        inputSourceNode.e.swf01_validator_accountNumber = value;
        return true;
    }
}(A9));
