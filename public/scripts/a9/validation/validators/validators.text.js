(function(a9){
    var textCheckReg = /[0-9]/g;
    a9.validation.validators.text = function(value, validatorDescriptor, inputSourceNode){
        return value === value.replace(textCheckReg, '');
    }
}(A9));