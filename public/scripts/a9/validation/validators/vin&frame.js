(function(a9){
    var vinReg = /I|O|Q|[^&A-Z&0-9]/g,
        frameReg = /[^&A-Z&0-9&\-]/g;
    a9.validation.validators['vin&frame'] = function(value, validatorDescriptor, inputSourceNode){
        var valueLength = value.length;
        if (valueLength === 17){
            inputSourceNode.e.swf01_validator_isVIN = true;
            return value === value.toUpperCase().replace(vinReg, '');
        } else if ((value.length >= 10) && (value.length <= 13)){
            inputSourceNode.e.swf01_validator_isVIN = false;
            return value === value.toUpperCase().replace(frameReg, '');
        }
        return false;
    };
}(A9));
