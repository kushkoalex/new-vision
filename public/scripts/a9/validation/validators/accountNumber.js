(function(a9){
    var regInt = /[^0-9]/g,
        defaultLength = 20,
        validation = a9.validation,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        microvalidators = validation.microvalidators,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax,
        startFromAttribute = 'data-a9-validation-accountNumber-startFrom';
    validation.validators.accountNumber = function(value, validatorDescriptor, inputSourceNode){
        var minLength = 'minLength' in validatorDescriptor ? validatorDescriptor.minLength : defaultLength,
            maxLength = 'maxLength' in validatorDescriptor ? validatorDescriptor.maxLength : defaultLength,
            lengthCache,
            valueProcessed,
            startFrom,
            isStartFromValidated = false,
            i;

        value = getUnmaskedValue(value, validatorDescriptor, inputSourceNode);

        startFrom = inputSourceNode.e.getAttribute(startFromAttribute);
        if (startFrom !== null){
            startFrom = startFrom.split(',');
            for (i = startFrom.length; i--;) {
                if (value.indexOf(startFrom[i]) === 0){
                    isStartFromValidated = true;
                    break;
                }
            }
            if (!isStartFromValidated){
                validatorDescriptor.invalidReason = 'incorrectSymbols';
                validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectSymbols;
                return false;
            }
        }

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

        inputSourceNode.e.swf01_validator_accountNumber = value;
        return true;
    }
}(A9));
