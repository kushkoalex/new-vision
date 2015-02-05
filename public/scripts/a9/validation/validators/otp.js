(function(a9){
    var regInt = /[^0-9a-z]/gi;
    a9.validation.validators.otp = function(value, validatorDescriptor, inputSourceNode){
        if (value !== value.replace(regInt, '')){
            validatorDescriptor.invalidReason = 'incorrectSymbols';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectSymbols;
            return false;
        }
        return true;
    }
}(A9));
