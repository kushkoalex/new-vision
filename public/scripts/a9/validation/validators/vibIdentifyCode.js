(function(a9){
    var regexp = /^[0-9]*$/g,
        lengthCache,
        requiredLength = 10,
        validation = a9.validation,
        microvalidators = validation.microvalidators,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax,
        u;

    function checkControlSum(value){
        var code = value.split(''),
            x;
        x = code[0] * (-1) + code[1] * 5 + code[2] * 7 + code[3] * 9 + code[4] * 4 + code[5] * 6 + code[6] * 10 + code[7] * 5 + code[8] * 7;
        if (x % 11 === 10){
            x = (x % 11) % 10;
        } else{
            x = x - (11 * Math.floor(x / 11));
        }
        return +code[9] === x;
    }

    validation.validators.vibIdentifyCode = function(value, validatorDescriptor, inputSourceNode){
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
            validatorDescriptor.invalidReason = 'onlyNumbersAllowed';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.onlyNumbersAllowed;
            return false;
        }
        if (!checkControlSum(value)){
            validatorDescriptor.invalidReason = 'checkControlSum';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.checkControlSum;
            return false;
        }
        return true;
    }

}(A9));
