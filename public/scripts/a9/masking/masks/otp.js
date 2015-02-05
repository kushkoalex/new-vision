(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        createMonoMask = masking.createMonoMask,
        maskInfo = masking.createMaskInfo(),
        otp,
        otpCheckReg = /[0-9a-z]/i,
        otpClearFormat = /[^0-9a-z]/gi;

    masks.otp = otp = masking.createMaskBasis();

    otp.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        otpCheckReg.lastIndex = 0;
        return otpCheckReg.test(value.charAt(i));
    };

    otp.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                otpClearFormat,
                otpClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol;

        if (unmaskedLength > 10){
            unmaskedLength = 10;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
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