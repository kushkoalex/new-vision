(function(a9){
    a9.validation.helpers.addValidatorToValidatorDescriptor = function(validatorDescriptor, validator){
        var validators = validatorDescriptor.validators,
            validatorSearch = a9.getObjectOfList(validators, 'n', validator.n);
        if (validatorSearch === null){
            validators.push(validator);
        }
    };
}(A9));

