//RUS only
(function(a9){
    var regLetters = /А|В|Е|К|М|Н|О|Р|С|Т|У|Х/,
        regNumber = /^[0-9]+$/;
    a9.validation.validators.carRegistrationNumber = function(value){
//        check length
        var isValid = value.length === 6,
            _value;

//        lettersTest
        if (isValid){
            _value = value.toUpperCase();
            regLetters.lastIndex = 0;
            isValid =
                regLetters.test(_value.charAt(0))
                && regLetters.test(_value.charAt(1))
                && regLetters.test(_value.charAt(5));
        }

//        numbers test
        if (isValid){
            regNumber.lastIndex = 0;
            isValid = regNumber.test(value.substr(2, 3))
        }

        return isValid;
    }
}(A9));