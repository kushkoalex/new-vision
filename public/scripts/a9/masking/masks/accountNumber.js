(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        maskInfo = masking.createMaskInfo(),
        accountNumber,
        accountNumberCheckReg = /[0-9]/,
        accountNumberClearFormat = /[^0-9]/g,
        accountNumberMaskDescriptor = [4, ' ', 4, ' ', 4, ' ', 4, ' ', 4];

    masks.accountNumber = accountNumber = masking.createMaskBasis();

    accountNumber.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        accountNumberCheckReg.lastIndex = 0;
        return accountNumberCheckReg.test(value.charAt(i));
    };

    accountNumber.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                accountNumberClearFormat,
                accountNumberClearFormat
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
        } else if (unmaskedLength > 20){
            unmaskedLength = 20;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.value = '';
        maskInfo.cursorOffset = 0;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;

        maskInfo.mask = createMask(accountNumberMaskDescriptor, replacedSymbol, unmaskedLength);

        return maskInfo;

    };
}(A9));