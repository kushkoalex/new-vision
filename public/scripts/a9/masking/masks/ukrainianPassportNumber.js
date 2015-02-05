(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMonoMask = masking.createMonoMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        maskInfo = masking.createMaskInfo(),
        ukrainianPassportNumber,

        uaPassportNumberClearFormat = /[^0-9]/g,

        intCheck = /[0-9]/;

    masks.ukrainianPassportNumber = ukrainianPassportNumber = masking.createMaskBasis();

    ukrainianPassportNumber.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        intCheck.lastIndex = 0;
        return intCheck.test(value.charAt(i));
    };

    ukrainianPassportNumber.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                uaPassportNumberClearFormat,
                uaPassportNumberClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol;

        if (unmaskedLength > 6){
            unmaskedLength = 6;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.value = '';
        maskInfo.cursorOffset = 0;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;

        maskInfo.mask = createMonoMask(unmaskedLength, replacedSymbol);

        return maskInfo;
    };
}(A9));

