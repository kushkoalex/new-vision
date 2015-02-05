(function(a9){
    var dependencyTypes = {
        '<': function(value, valueForDependency, validatorDescriptor){
            var parsedValue = parseFloat(value),
                parsedValueForDependency = parseFloat(valueForDependency),
                hasValue = !isNaN(parsedValue),
                hasValueForDependency = !isNaN(parsedValueForDependency);

            if (hasValue
                && hasValueForDependency
                && (parsedValue >= parsedValueForDependency)){
                validatorDescriptor.invalidReason = 'incorrectDependency';
                return false;
            }
            return true;
        }
    };
    a9.validation.validators.dependency = function(value, validationDescriptor, inputSource){
        if (validationDescriptor.fieldForDependency
            && dependencyTypes[validationDescriptor.dependencyType]){
            return dependencyTypes[validationDescriptor.dependencyType](value, validationDescriptor.fieldForDependency._value, validationDescriptor);
        }
        //todo for field
        return true;
    }
}(A9));
