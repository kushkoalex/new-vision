(function(a9){
    var clearPhoneReg = /\+|\(|\)|\s|-|\./g,
        testOnPhone = /^\+?[0-9]*$/,
        validators = a9.validation.validators;
    validators['email&phone'] = function(value, validatorDescriptor, inputSourceNode){
        var _value = value.replace(clearPhoneReg, '');
        testOnPhone.lastIndex = 0;
        if (testOnPhone.test(_value)){
            inputSourceNode.e.swf01_validator_isPhone = true;
            return validators.phone(value, validatorDescriptor, inputSourceNode)
        }
        inputSourceNode.e.swf01_validator_isPhone = false;
        return validators.email(value, validatorDescriptor, inputSourceNode);
    };

}(A9));