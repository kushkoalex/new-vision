(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        createMonoMask = masking.createMonoMask,
        maskInfo = masking.createMaskInfo(),
        number,
        numberCheckReg = /[0-9]/,
        numberClearFormat = /[^0-9]/g;

    masks.number = number = masking.createMaskBasis();

    number.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        numberCheckReg.lastIndex = 0;
        return numberCheckReg.test(value.charAt(i));
    };

    number.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                numberClearFormat,
                numberClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol,
            u;

        if ((maskData !== u) && ('maxLength' in maskData) && (unmaskedLength > maskData.maxLength)){
            unmaskedLength = maskData.maxLength;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        if (unmaskedValue === value){
            maskInfo.isMasked = false;
            maskInfo.unmaskedValue = unmaskedValue;
        } else{
            maskInfo.isMasked = true;
            maskInfo.unmaskedValue = unmaskedValue;
            maskInfo.value = '';
            maskInfo.cursorOffset = 0;
            maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;
            maskInfo.mask = createMonoMask(unmaskedLength, replacedSymbol);
        }

        return maskInfo;
    };
}(A9));