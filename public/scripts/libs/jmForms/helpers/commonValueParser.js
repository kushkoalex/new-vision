JMFORMS.modulesForInit.push(function(jmf){
    var numbersRegExp = /\D/g;

    function parseNumberValue(numberValue){
        var value = +numberValue;
        if (isNaN(value)){
            return null;
        }
        //todo float set length
        return numberValue;
    }

    jmf.helpers.commonValueParsers = {
        'string': function(jmfField, value){
            if (value === null){
                return '';
            }
            return value;
        },
        'numbersString': function(jmfField, value){
            if (value === null){
                return '';
            }
            return value.replace(numbersRegExp, '');
        },
        'number': function(jmfField, value){
            if (value === null){
                return 0;
            }
            return parseNumberValue(value);
        },
        'decimal': function(jmfField, value){
            if (value === null){
                return 0;
            }
            return parseNumberValue(value);
        }
    };
});
