(function(a9){
    a9.validation.validators.regexp = function(value, validatorDescriptor, inputSourceNode){
        var regexp = new RegExp(validatorDescriptor.regexp, validatorDescriptor.regexpFlags);
        if (!regexp.test(value)){
            validatorDescriptor.invalidReason = 'incorrectSymbols';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectSymbols;
            return false;
        }
        return true;
    }
}(A9));
