(function(a9){
    var microvalidators = a9.validation.microvalidators,
        isLessMin = microvalidators.isLessMin,
        isMoreMax = microvalidators.isMoreMax;

    a9.validation.validators.length = function(value, validatorDescriptor){
        var valueLength = value.length;
        if (isLessMin(valueLength, validatorDescriptor)){
            validatorDescriptor.invalidReason = 'lessMinLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
            return false;
        }
        if (isMoreMax(valueLength, validatorDescriptor)){
            validatorDescriptor.invalidReason = 'moreMaxLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
            return false;
        }
        return true;
    }

}(A9));