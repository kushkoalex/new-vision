(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        createMonoMask = masking.createMonoMask,
        maskInfo = masking.createMaskInfo(),
        password,
        passwordCheckReg = /[0-9a-z]/i,
        passwordClearFormat = /[^0-9a-z]/gi,
        passwordCheckRegSpecialSymbols = /[0-9a-z\-=~!@#$%^&*()_+{}[\]:;.,<>?]/i,
        passwordClearFormatSpecialSymbols = /[^0-9a-z\-=~!@#$%^&*()_+{}[\]:;.,<>?]/gi,
        u;

    masks.password = password = masking.createMaskBasis();

    function checkMaskedSymbol(value, i){
        passwordCheckReg.lastIndex = 0;
        return passwordCheckReg.test(value.charAt(i));
    }

    function checkMaskedSymbolSpecial(value, i){
        passwordCheckRegSpecialSymbols.lastIndex = 0;
        return passwordCheckRegSpecialSymbols.test(value.charAt(i));
    }

    password.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        return maskData.specialSymbols ? checkMaskedSymbolSpecial(value, i) : checkMaskedSymbol(value, i);
    };

    password.getMaskInfo = function(value, maskData, maskingInstance){
        var clearFormat = maskData.specialSymbols ? passwordClearFormatSpecialSymbols : passwordClearFormat,
            unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                clearFormat,
                clearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol;

        if ((maskData !== u) && ('maxLength' in maskData)){
            if (unmaskedLength > maskData.maxLength){
                unmaskedLength = maskData.maxLength;
                unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
                maskInfo.isMoreMax = true;
            }
//        } else if (unmaskedLength > 32){
//            unmaskedLength = 32;
//            maskInfo.maxLength = unmaskedLength;
//            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
//            maskInfo.isMoreMax = true;
        }

        if (unmaskedValue === value){
            maskInfo.unmaskedValue = unmaskedValue;
            maskInfo.isMasked = false;
        } else{
            maskInfo.unmaskedValue = unmaskedValue;
            maskInfo.isMasked = true;
            maskInfo.value = '';
            maskInfo.cursorOffset = 0;
            maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;
            maskInfo.mask = createMonoMask(unmaskedLength, replacedSymbol);
        }

        return maskInfo;
    };


}(A9));
