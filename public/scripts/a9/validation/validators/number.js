(function(a9){
    var regNumber = /[^0-9\.-]/g;
    a9.validation.validators.number = function(value, validatorDescriptor, inputSourceNode){
        if (!(value === value.replace(regNumber, ''))){
            validatorDescriptor.invalidReason = 'isNotNumber';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.isNotNumber;
            return false;
        }
        if (a9.validation.microvalidators.isLessMin(value.length, validatorDescriptor)){
            validatorDescriptor.invalidReason = 'lessMinLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinLength;
            return false;
        }
        if (a9.validation.microvalidators.isMoreMax(value.length, validatorDescriptor)){
            validatorDescriptor.invalidReason = 'moreMaxLength';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxLength;
            return false;
        }
        return true;
    }
}(A9));