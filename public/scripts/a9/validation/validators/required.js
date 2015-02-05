(function(a9){
    a9.validation.validators.required = function(value, validatorDescriptor, inputSourceNode){
        var isValid;
        if (inputSourceNode.e.type === 'checkbox'){
            isValid = inputSourceNode.e.checked;
        } else{
            isValid = value.length !== 0;
            if (isValid && ('minLength' in validatorDescriptor)){
                isValid = value.length >= validatorDescriptor.minLength;
            }
            if (isValid && ('maxLength' in validatorDescriptor)){
                isValid = value.length <= validatorDescriptor.maxLength;
            }
        }
        return isValid;
    }
}(A9));
