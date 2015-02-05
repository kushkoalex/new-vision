(function(a9){
    function init(value, validatorDescriptor, inputSourceNode){
        var regInt = /[^0-9]/g,
            regThanZero = /[^0]/,
            regClearThenInt = /[^0-9|\.]|^0+/g,
            digitFloatSeparator = ',',
            strCache,
            floatAmountValue,
            lastValue,
            isValid;
        if ('l10n' in a9){
            strCache = a9.l10n('digitFloatSeparator');
            if ('digitFloatSeparator' !== strCache){
                digitFloatSeparator = strCache;
            }
        }
        function getFloat(value){
            if (lastValue === value){
                return floatAmountValue;
            } else{
                lastValue = value;
                value = value.replace(digitFloatSeparator, '.');
                value = value.replace(regClearThenInt, '');
                if (value.indexOf('.') === 0){
                    value = 0 + value;
                }
                return floatAmountValue = +value;
            }
        }
        //a9.validation.validators.amount = function(value, validatorDescriptor, inputSourceNode){
        //    regThanZero.lastIndex = 0;
        //    isValid = regThanZero.test(value.replace(regInt, ''));
        //    inputSourceNode.e.swf01_validator_amountValue = getFloat(value);
        //    if (isValid && ('minAmount' in validatorDescriptor)){
        //        isValid = getFloat(value) >= validatorDescriptor.minAmount;
        //        validatorDescriptor.invalidReason = 'lessMinLength';
        //        validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
        //    }
        //    if (isValid && ('maxAmount' in validatorDescriptor)){
        //        isValid = getFloat(value) <= validatorDescriptor.maxAmount;
        //        validatorDescriptor.invalidReason = 'moreMaxLength';
        //        validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
        //    }
        //    return isValid;
        //};

        //a9.validation.validators.amount = function(value, validatorDescriptor, inputSourceNode){
        //    regThanZero.lastIndex = 0;
        //    isValid = regThanZero.test(value.replace(regInt, ''));
        //
        //    if(!isValid)
        //    {
        //        validatorDescriptor.invalidReason = 'zero';
        //        validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.zero;
        //    }
        //    else {
        //        inputSourceNode.e.swf01_validator_amountValue = getFloat(value);
        //        if (isValid && ('minAmount' in validatorDescriptor)) {
        //            isValid = getFloat(value) >= validatorDescriptor.minAmount;
        //            validatorDescriptor.invalidReason = 'lessMinLength';
        //            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
        //        }
        //        if (isValid && ('maxAmount' in validatorDescriptor)) {
        //            isValid = getFloat(value) <= validatorDescriptor.maxAmount;
        //            validatorDescriptor.invalidReason = 'moreMaxLength';
        //            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
        //        }
        //    }
        //    return isValid;
        //};

        a9.validation.validators.amount = function(value, validatorDescriptor, inputSourceNode){
            regThanZero.lastIndex = 0;
            //value = value.replace(regInt, '');
            isValid = true;
            //isValid = regThanZero.test(value.replace(regInt, ''));
            inputSourceNode.e.swf01_validator_amountValue = getFloat(value);
            if (isValid && ('minAmount' in validatorDescriptor)){
                isValid = getFloat(value) >= validatorDescriptor.minAmount;
                validatorDescriptor.invalidReason = 'lessMinLength';
                validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
            }
            if (isValid && ('maxAmount' in validatorDescriptor)){
                isValid = getFloat(value) <= validatorDescriptor.maxAmount;
                validatorDescriptor.invalidReason = 'moreMaxLength';
                validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
            }
            return isValid;
        };



        return a9.validation.validators.amount(value, validatorDescriptor, inputSourceNode);
    }
    a9.validation.validators.amount = init
}(A9));
