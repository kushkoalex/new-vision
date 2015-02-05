(function(a9){
    var dependencyTypes = a9.validation.validatorsData.dependencyTypes;
    dependencyTypes.less =
        dependencyTypes['<'] =
            function(value, valueForDependency, validatorDescriptor){
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
            };
}(A9));