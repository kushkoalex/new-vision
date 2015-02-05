(function(a9){
    var regInt = /[0-9]/g,
        testFirsSymbolReg = /[0-9+]/,
        minLength = 9,
        maxLength = 16,
        lengthCache,
        validation = a9.validation,
        microvalidators = validation.microvalidators,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax,
        u;

    validation.validators.phone = function(value, validatorDescriptor, inputSourceNode){
        value = getUnmaskedValue(value, validatorDescriptor, inputSourceNode);
        lengthCache = value.length;
        inputSourceNode.e.swf01_validator_phoneValue = value;

        if (isLessMin(lengthCache, validatorDescriptor, minLength)){
            validatorDescriptor.invalidReason = 'lessMinLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
            return false;
        }

        if (isMoreMax(lengthCache, validatorDescriptor, maxLength)) {
            validatorDescriptor.invalidReason = 'moreMaxLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
            return false;
        }

        testFirsSymbolReg.lastIndex = 0;
        if (!testFirsSymbolReg.test(value.charAt(0))){
            validatorDescriptor.invalidReason = 'incorrectStartSymbol';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectStartSymbol;
            return false;
        }

        regInt.lastIndex = 0;
        if (!regInt.test(value)){
            validatorDescriptor.invalidReason = 'incorrectSymbols';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectSymbols;
            return false;
        }

        return true;
    }
}(A9));
