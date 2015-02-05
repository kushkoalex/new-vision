(function(a9){
    var u;
    a9.validation.microvalidators.isLessMin = function(valueLength, validatorDescriptor, minLength){
        return (('minLength' in validatorDescriptor) && (valueLength < validatorDescriptor.minLength))
                || (minLength !== u ? (valueLength < minLength) : false);
    }

}(A9));

