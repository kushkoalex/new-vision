(function(a9){
    var dependencyTypes = {};
    a9.validation.validatorsData.dependencyTypes = dependencyTypes;
    a9.validation.validators.dependency = function(value, validationDescriptor, inputSource){
        if (validationDescriptor.fieldForDependency
            && dependencyTypes[validationDescriptor.dependencyType]){
            return dependencyTypes[validationDescriptor.dependencyType](value, validationDescriptor.fieldForDependency._value, validationDescriptor);
        }
        //todo for field
        return true;
    }
}(A9));
