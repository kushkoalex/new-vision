(function(a9){
    function init(value, validatorDescriptor, inputSourceNode){
        var regInt = /[^0-9]/g,
            regThanZero = /[^0]/,
            regClearThenInt = /[^0-9|\.]|^0+/g,
            digitFloatSeparator = ',',
            strCache,
            floatAmountValue,
            lastValue,
            isValid;
        if ('l10n' in a9){
            strCache = a9.l10n('digitFloatSeparator');
            if ('digitFloatSeparator' !== strCache){
                digitFloatSeparator = strCache;
            }
        }
        function getFloat(value){
            if (lastValue === value){
                return floatAmountValue;
            } else{
                lastValue = value;
                value = value.replace(digitFloatSeparator, '.');
                value = value.replace(regClearThenInt, '');
                if (value.indexOf('.') === 0){
                    value = 0 + value;
                }
                return floatAmountValue = +value;
            }
        }
        a9.validation.validators.formattedNumber = function(value, validatorDescriptor, inputSourceNode){
            regThanZero.lastIndex = 0;
            isValid = (value === a9.formatDigit(value, 'floatLength' in validatorDescriptor ? validatorDescriptor.floatLength : 2)) && regThanZero.test(value.replace(regInt, ''));
            inputSourceNode.e.swf01_validator_formattedNumber = getFloat(value);
            if (isValid && ('min' in validatorDescriptor)){
                isValid = getFloat(value) >= validatorDescriptor.min;
            }
            if (isValid && ('max' in validatorDescriptor)){
                isValid = getFloat(value) <= validatorDescriptor.max;
            }
            return isValid;
        };
        return a9.validation.validators.formattedNumber(value, validatorDescriptor, inputSourceNode);
    }
    a9.validation.validators.formattedNumber = init
}(A9));