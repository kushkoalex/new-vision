(function(a9){
    var regexp = /^[0-9]*$/g,
        lengthCache,
        requiredMinLength = 8,
        requiredMaxLength = 10,
        validation = a9.validation,
        microvalidators = validation.microvalidators,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax,
        u;



    function checkControlSumPhysical(value){
        var code = a9.strToNumbersArray(value),
            x;
        x = code[0] * (-1) + code[1] * 5 + code[2] * 7 + code[3] * 9 + code[4] * 4 + code[5] * 6 + code[6] * 10 + code[7] * 5 + code[8] * 7;
        if (x % 11 === 10){
            x = (x % 11) % 10;
        } else{
            x = x - (11 * Math.floor(x / 11));
        }
        return +code[9] === x;
    }



    function checkControlSumJuridical(value){
        var code = a9.strToNumbersArray(value),
            numericValue = +value,
            x;

        //24432974 и 32855961

        if ((numericValue < 30000000) || (numericValue > 60000000)){
            x = code[0] + code[1] * 2 + code[2] * 3 + code[3] * 4 + code[4] * 5 + code[5] * 6 + code[6] * 7;
        } else{
            x = code[0] * 7 + code[1] + code[2] * 2 + code[3] * 3 + code[4] * 4 + code[5] * 5 + code[6] * 6;
        }

        x = x - (11 * Math.floor(x / 11));
        if (x === 10){
            if ((numericValue < 30000000) || (numericValue > 60000000)){
                x = code[0] * 3 + code[1] * 4 + code[2] * 5 + code[3] * 6 + code[4] * 7 + code[5] * 8 + code[6] * 9;
            } else{
                x = code[0] * 9 + code[1] * 3 + code[2] * 4 + code[3] * 5 + code[4] * 6 + code[5] * 7 + code[6] * 8;
            }
            x = x - (11 * Math.floor(x / 11));
            if (x === 10){
                x = 0;
            }
        }

        return +code[7] === x;
    }

    validation.validators.vibIdentifyCommonCode = function(value, validatorDescriptor, inputSourceNode){
        value = getUnmaskedValue(value, validatorDescriptor, inputSourceNode);
        lengthCache = value.length;

        if ((value === '000000000') || (value === '99999')){
            return true;
        }

        if (isLessMin(lengthCache, validatorDescriptor, requiredMinLength)){
            validatorDescriptor.invalidReason = 'lessMinLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
            return false;
        }
        if (isMoreMax(lengthCache, validatorDescriptor, requiredMaxLength)){
            validatorDescriptor.invalidReason = 'moreMaxLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
            return false;
        }
        if (lengthCache === 9){
            validatorDescriptor.invalidReason = 'invalidLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.invalidLength;
            return false;
        }
        regexp.lastIndex = 0;
        if (!regexp.test(value)){
            validatorDescriptor.invalidReason = 'onlyNumbersAllowed';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.onlyNumbersAllowed;
            return false;
        }
        if (((lengthCache === 10) && !checkControlSumPhysical(value))
            || ((lengthCache === 8) && !checkControlSumJuridical(value))){
                validatorDescriptor.invalidReason = 'checkControlSum';
                validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.checkControlSum;
                return false;
        }
        return true;
    }

}(A9));
