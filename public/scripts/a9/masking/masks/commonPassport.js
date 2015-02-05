(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        createMonoMask = masking.createMonoMask,
        maskInfo = masking.createMaskInfo(),
        commonPassport,
        commonPassportCheckReg = /[0-9a-zа-яёєґії\-/]/i,
        commonPassportClearFormat = /[^0-9a-zа-яёєґії\-/]/gi;

    masks.commonPassport = commonPassport = masking.createMaskBasis();

    commonPassport.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        commonPassportCheckReg.lastIndex = 0;
        return commonPassportCheckReg.test(value.charAt(i));
    };

    commonPassport.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                commonPassportClearFormat,
                commonPassportClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol;

        if (unmaskedLength > 10){
            unmaskedLength = 10;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        unmaskedValue = unmaskedValue.toUpperCase();

        if (unmaskedValue === value){
            maskInfo.isMasked = false;
            maskInfo.unmaskedValue = unmaskedValue;
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