(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        maskInfo = masking.createMaskInfo(),
        ukrainianPassport,

        ukrainianPassportClearFormat = /[^0-9а-яёєґіїabcehikmopxt]/ig,

        lettersCheck = /[а-яёєґіїabcehikmopxt]/i,
        lettersReplace = /[^а-яёєґіїabcehikmopxt]/ig,

        intCheck = /[0-9]/,
        intReplace = /[^0-9]/g,

        maskDescriptor = [2, ' ', 6];

    masks.ukrainianPassport = ukrainianPassport = masking.createMaskBasis();

    ukrainianPassport.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        if (i < 2){
            lettersCheck.lastIndex = 0;
            return lettersCheck.test(value.charAt(i));
        } else{
            intCheck.lastIndex = 0;
            return intCheck.test(value.charAt(i));
        }
    };

    ukrainianPassport.getMaskInfo = function(value, maskData, maskingInstance){
        //todo extend functions for processing value
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                ukrainianPassportClearFormat,
                ukrainianPassportClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol,
            letters,
            ints,
            intsLength;

        if (unmaskedLength > 2){
            letters = unmaskedValue.replace(lettersReplace, '');
            if (letters.length < 2){
                unmaskedValue = letters;
                unmaskedLength = letters.length;
            } else{
                ints = unmaskedValue.replace(intReplace, '');
                intsLength = ints.length;
                if (intsLength > 6){
                    intsLength = 6;
                }
                unmaskedValue = letters.substr(0, 2) + ints.substr(0, intsLength);
                unmaskedLength = unmaskedValue.length;
            }
        } else{
            unmaskedValue = unmaskedValue.substr(0, 2).replace(lettersReplace, '');
            unmaskedLength = unmaskedValue.length;
        }

        if (unmaskedLength > 8){
            unmaskedLength = 8;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        unmaskedValue = unmaskedValue.toUpperCase();
        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.value = '';
        maskInfo.cursorOffset = 0;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;

        maskInfo.mask = createMask(maskDescriptor, replacedSymbol, unmaskedLength);

        return maskInfo;
    };
}(A9));

