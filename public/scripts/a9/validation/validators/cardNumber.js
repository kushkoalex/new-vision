(function(a9){
    var panReg = /[^0-9]/g,
        valueProcessed,
        lengthCache,
        defaultLength = 16,
        minLength,
        maxLength,
        validation = a9.validation,
        microvalidators = validation.microvalidators,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax;

    validation.validators.cardNumber = function(value, validatorDescriptor, inputSourceNode){
        minLength = 'minLength' in validatorDescriptor ? validatorDescriptor.minLength : defaultLength;
        maxLength = 'maxLength' in validatorDescriptor ? validatorDescriptor.maxLength : defaultLength;

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
        valueProcessed = value.replace(panReg, '');
        inputSourceNode.e.swf01_validator_panValue = valueProcessed;
        if (value !== valueProcessed){
            validatorDescriptor.invalidReason = 'incorrectSymbols';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectSymbols;
            return false;
        }

        // Check card number with Luhn algorithm
        var cardNumArray = valueProcessed.split("");
        var checkSymbol = cardNumArray.pop();
        var checkSum = 0;
        cardNumArray.reverse();
        for(var i = 0; i < cardNumArray.length; i++) {
            if((i + 1) % 2 == 1) {
                cardNumArray[i] = (+cardNumArray[i]) * 2;
            }
            if((+cardNumArray[i]) > 9) {
                cardNumArray[i] = (+cardNumArray[i]) - 9;
            }
            checkSum += (+cardNumArray[i]);
        }
        if((checkSum % 10) !== (+checkSymbol)) {
            validatorDescriptor.invalidReason = 'invalidCardNum';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectCardNumber;
            return false;
        }

        return true;
    }
}(A9));
