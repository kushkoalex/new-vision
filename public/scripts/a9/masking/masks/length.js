(function(a9){
    var masking = a9.masking,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        createMonoMask = masking.createMonoMask,
        maskInfo = masking.createMaskInfo(),
        length;

    masking.masks.length = length = masking.createMaskBasis();

    length.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        return true;
    };

    length.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = value,
            unmaskedLength = unmaskedValue.length,
            maxLength = maskData.maxLength;

        if (unmaskedLength > maxLength){
            unmaskedLength = maxLength;
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
            maskInfo.replacedSymbol = defaultReplacedSymbol;
            maskInfo.mask = createMonoMask(unmaskedLength, defaultReplacedSymbol);
        }

        return maskInfo;
    };
}(A9));
