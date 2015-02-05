(function(a9){
    var regexp = /^[а-яёєґіїabcehikmopxt]{2}[0-9]{6}$/ig,
        lengthCache,
        requiredLength = 8,
        validation = a9.validation,
        microvalidators = validation.microvalidators,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax,
        u;

    validation.validators.ukrainianPassport = function(value, validatorDescriptor, inputSourceNode){
        value = getUnmaskedValue(value, validatorDescriptor, inputSourceNode);
        lengthCache = value.length;
        if (isLessMin(lengthCache, validatorDescriptor, requiredLength)){
            validatorDescriptor.invalidReason = 'lessMinLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
            return false;
        }
        if (isMoreMax(lengthCache, validatorDescriptor, requiredLength)){
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
