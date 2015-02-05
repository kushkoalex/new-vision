//RUS only
(function(a9){
    var regNumber = /^[0-9]+$/,
        u;
    a9.validation.validators.carRegistrationNumberRegion = function(value, validatorDescriptor){
//        check length
        var length = value.length,
            isValid =
                (length > 0)
                && (length <= 3);
//        check number
        if (isValid){
            regNumber.lastIndex = 0;
            isValid = regNumber.test(value);
        }
        if ((validatorDescriptor !== u) && (validatorDescriptor.regionsCodes !== u)){
            isValid = value in validatorDescriptor.regionsCodes;
        }
        return isValid;
    }
}(A9));