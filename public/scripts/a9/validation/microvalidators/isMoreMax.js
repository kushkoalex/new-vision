(function(a9){
    var u;
    a9.validation.microvalidators.isMoreMax = function(valueLength, validatorDescriptor, maxLength){
        return (('maxLength' in validatorDescriptor) && (valueLength > validatorDescriptor.maxLength))
                || (maxLength !== u ? (valueLength > maxLength) : false);
    }

}(A9));

