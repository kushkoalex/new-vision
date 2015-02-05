(function(a9){
    var regInt = /[^0-9//]/g,
        minLength = 5;
    a9.validation.validators.cardExpire = function(value, validatorDescriptor, inputSourceNode){
        if ('minLength' in validatorDescriptor){
            minLength = validatorDescriptor.minLength;
        } else{
            minLength = 5;
        }
        value = value.replace(regInt, '');
        inputSourceNode.e.swf01_validator_cardExpireValue = value;
        return value.length >= minLength;
    }
}(A9));