(function(a9){
    a9.validation.validators.requiredMultiSelect = function(value, validatorDescriptor, inputSourceNode){
        value = inputSourceNode.e.getAttribute('data-value');
        var isValid = value.length !== 0;
        if (isValid && ('minLength' in validatorDescriptor)){
            isValid = value.length >= validatorDescriptor.minLength;
        }
        if (isValid && ('maxLength' in validatorDescriptor)){
            isValid = value.length <= validatorDescriptor.maxLength;
        }
        return isValid;
    }
}(A9));