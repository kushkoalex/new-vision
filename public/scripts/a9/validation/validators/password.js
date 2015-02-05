(function (a9) {
    var passwordReg = /[^0-9a-z\-=~!@#$%^&*()_+{}[\]:;.,<>?]/gi,
        testChar = /[a-z]/i,
        testlowerChar = /[a-z]/,
        testUpperChar = /[A-Z]/,
        testSpecialSymbol = /[\-=~!@#$%^&*()_+{}[\]:;.,<>?]/,
        testDigit = /[0-9]/,
        validation = a9.validation,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        checkPasswordSecurity = a9.checkPasswordSecurity,
        securityIndex,
        u;

    validation.validators.password = function (value, validatorDescriptor, inputSourceNode) {
        value = getUnmaskedValue(value, validatorDescriptor, inputSourceNode);

        securityIndex = checkPasswordSecurity(value);




        testChar.lastIndex = 0;
        if (!testChar.test(value)) {
            validatorDescriptor.invalidReason = 'hasNotChars';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.hasNotChars;
            return false;
        }

        testlowerChar.lastIndex = 0;
        if (!testlowerChar.test(value)) {
            validatorDescriptor.invalidReason = 'hasNotLowerChars';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.hasNotLowerChars;
            return false;
        }

        testUpperChar.lastIndex = 0;
        if (!testUpperChar.test(value)) {
            validatorDescriptor.invalidReason = 'hasNotUpperChars';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.hasNotUpperChars;
            return false;
        }

        testDigit.lastIndex = 0;
        if (!testDigit.test(value)) {
            validatorDescriptor.invalidReason = 'hasNotDigit';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.hasNotDigit;
            return false;
        }

        //if (validatorDescriptor.specialSymbols) {

        if (securityIndex < 45) {
            testSpecialSymbol.lastIndex = 0;
            if (!testSpecialSymbol.test(value)) {
                validatorDescriptor.invalidReason = 'hasNotSpecialSymbol';
                validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.hasNotSpecialSymbol;
                return false;
            }
        }


        //}







        if (value.replace(passwordReg, '') !== value) {
            validatorDescriptor.invalidReason = 'incorrectSymbols';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.incorrectSymbols;
            return false;
        }

        return true;
    }

}(A9));
