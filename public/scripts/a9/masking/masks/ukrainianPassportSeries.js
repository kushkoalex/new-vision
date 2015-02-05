(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMonoMask = masking.createMonoMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        maskInfo = masking.createMaskInfo(),
        ukrainianPassportSeries,

        uaPassportSeriesClearFormat = /[^а-яёєґіїabcehikmopxt]/ig,

        checkUnmasked = /[а-яёєґіїabcehikmopxt]/i;

    masks.ukrainianPassportSeries = ukrainianPassportSeries = masking.createMaskBasis();

    ukrainianPassportSeries.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        checkUnmasked.lastIndex = 0;
        return checkUnmasked.test(value.charAt(i));
    };

    ukrainianPassportSeries.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                uaPassportSeriesClearFormat,
                uaPassportSeriesClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol;

        if (unmaskedLength > 2){
            unmaskedLength = 2;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        unmaskedValue = unmaskedValue.toUpperCase();
        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.value = '';
        maskInfo.cursorOffset = 0;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;
        maskInfo.mask = createMonoMask(unmaskedLength, replacedSymbol);

        return maskInfo;
    };
}(A9));