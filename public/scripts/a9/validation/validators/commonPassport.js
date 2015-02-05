(function(a9){
    var regexp = /^[0-9a-zа-яёєґії\-/]{5,10}$/ig,
        lengthCache,
        minLength = 5,
        maxLength = 10,
        validation = a9.validation,
        microvalidators = validation.microvalidators,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax,
        u;

    validation.validators.commonPassport = function(value, validatorDescriptor, inputSourceNode){
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
        regexp.lastIndex = 0;
        if (!regexp.test(value)){
            validatorDescriptor.invalidReason = 'incorrectFormat';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectFormat;
            return false;
        }
        return true;
    }

}(A9));

