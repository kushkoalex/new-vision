(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        maskInfo = masking.createMaskInfo(),
        cardNumber,
        cardNumberCheckReg = /[0-9]/,
        cardNumberClearFormat = /[^0-9]/g,
        cardNumberMaskDescriptor = [4, ' ', 4, ' ', 4, ' ', 6];

    masks.cardNumber = cardNumber = masking.createMaskBasis();

    cardNumber.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        cardNumberCheckReg.lastIndex = 0;
        return cardNumberCheckReg.test(value.charAt(i));
    };

    cardNumber.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                cardNumberClearFormat,
                cardNumberClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol,
            u;

        if ((maskData !== u) && ('maxLength' in maskData)){
            if (unmaskedLength > maskData.maxLength){
                unmaskedLength = maskData.maxLength;
                unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
                maskInfo.isMoreMax = true;
            }
        } else if (unmaskedLength > 18){
            unmaskedLength = 18;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.value = '';
        maskInfo.cursorOffset = 0;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;

        maskInfo.mask = createMask(cardNumberMaskDescriptor, replacedSymbol, unmaskedLength);

        return maskInfo;

    };
}(A9));
