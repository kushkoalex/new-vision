(function (a9) {

    function checkLength(value) {
        var valueLength = value.length,
            result = 0;


        if (valueLength < 8) {
            result = 0;
        } else {
            result = 20 + ((valueLength - 8) * 5);
        }
        return result;
    }

    function checkLetters(value) {
        if ((/[a-z]/i).test(value)) {
            return 5;
        }
        return -100;
    }

    function checkLowercase(value) {
        if ((/[a-z]/).test(value)) {
            return 5;
        }
        return -100;
    }

    function checkUppercase(value) {
        if ((/[A-Z]/).test(value)) {
            return 5;
        }
        return -100;
    }

    function checkDigits(value) {
        if ((/[0-9]/).test(value)) {
            return 5;
        }
        return -100;
    }

    function checkSpecialSymbols(value) {
        if ((/[\-=~!@#$%^&*()_+{}[\]:;.,<>?]/).test(value)) {
            return 5;
        }
        return 0;
    }

    function checkLettersPercent(value) {
        var lettersPercent = value.replace(/[^a-z]/gi, '').length / (value.length * .01);
        //console.log(lettersPercent);
        if ((lettersPercent >= 60) && (lettersPercent <= 80)) {
            return 5;
        }
        return 0;
    }

    function checkDigitPercent(value) {
        var digitsPercent = value.replace(/[^0-9]/g, '').length / (value.length * .01);
        if ((digitsPercent >= 20) && (digitsPercent >= 30)) {
            return 5;
        }
        return 0;
    }

    function checkSpecialSymbolsPercent(value) {
        var specialSymbolsPercent = value.replace(/[^\-=~!@#$%^&*()_+{}[\]:;.,<>?]/g, '').length / (value.length * .01);
        if ((specialSymbolsPercent >= 20) && (specialSymbolsPercent <= 30)) {
            return 5;
        }
        return 0;
    }

    function checkDiversity(value) {
        var diversityArray = [],
            i,
            symbol,
            valueLength = value.length;

        for (i = valueLength; i--;) {
            symbol = value.charAt(i);
            if (a9.arrayIndexOf(diversityArray, symbol) === -1) {
                diversityArray.push(symbol);
            }
        }

        if ((diversityArray.length / valueLength) >= 0.7) {
            return 5;
        }
        return 0;
    }


    function checkRepetition(value) {
        var valueLength = value.length,
            isHasRepetition = false;

        value.replace(/[^0-9a-zA-Z\-=~!@#$%^&*()_+{}[\]:;.,<>?]/g, function (char, position, value) {
            if ((position < (valueLength - 2))
                && ((char === value.charAt(position + 1))
                && (char === value.charAt(position + 2)))) {
                isHasRepetition = true;
            }
        });

        if (isHasRepetition) {
            return 0;
        }
        return 5;

    }

    a9.checkPasswordSecurity = function (password) {
        var result = 0,
            valueLength = password.length;
        if (valueLength === 0) {
            result -= 100;
        } else {
            result += checkLength(password);
            //console.log('checkLength: '+checkLength(password));
            result += checkLetters(password);
            //console.log('checkLetters: '+checkLetters(password));
            result += checkLowercase(password);
            //console.log('checkLowercase: '+checkLowercase(password));
            result += checkUppercase(password);
            //console.log('checkUppercase: '+checkUppercase(password));
            result += checkDigits(password);
            //console.log('checkDigits: '+checkDigits(password));
            result += checkSpecialSymbols(password);
            //console.log('checkSpecialSymbols: '+checkSpecialSymbols(password));
            result += checkLettersPercent(password);
            //console.log('checkLettersPercent: '+checkLettersPercent(password));
            result += checkDigitPercent(password);
            //console.log('checkDigitPercent: '+checkDigitPercent(password));
            result += checkSpecialSymbolsPercent(password);
            //console.log('checkSpecialSymbolsPercent: '+checkSpecialSymbolsPercent(password));
            result += checkDiversity(password);
            //console.log('checkDiversity: '+checkDiversity(password));

            //result += checkRepetition(password);

            //console.log(result);
        }

        if (result < 0) {
            result = 0;
        } else if (result > 100) {
            result = 100;
        }
        return result;
    };
}(A9));
