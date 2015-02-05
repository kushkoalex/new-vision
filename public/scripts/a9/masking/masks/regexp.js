(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMonoMask = masking.createMonoMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        maskInfo = masking.createMaskInfo(),
        regexp;

    masks.regexp = regexp = masking.createMaskBasis();

    regexp.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        var isCorrect = new RegExp(maskData.regexp, maskData.regexpFlags).test(value.charAt(i));
        if (maskData.isReverse){
            isCorrect = !isCorrect;
        }
        return isCorrect;
    };


    function unmaskedRule (value, maskInfo, maskingInstance){
        var maskData = maskingInstance.data,
            regexp = new RegExp(maskData.regexp, maskData.regexpFlags),
            result = '';

        a9.each(value, function(char){
            var isCorrect = regexp.test(char);
            regexp.lastIndex = 0;
            if (maskData.isReverse){
                isCorrect = !isCorrect;
            }
            if (isCorrect){
                result += char;
            }
        });

        return result;

    }

    function correctSymbolsRule (diff, fn, value, maskInfo, maskingInstance){
        var maskData = maskingInstance.data,
            regexp = new RegExp(maskData.regexp, maskData.regexpFlags);

        a9.each(diff.str2Diff, function(char){
            var isCorrect = regexp.test(char);
            regexp.lastIndex = 0;
            if (maskData.isReverse){
                isCorrect = !isCorrect;
            }
            if (!isCorrect){
                fn(char);
            }
        });

    }


    regexp.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                unmaskedRule,
                correctSymbolsRule
            ),
            unmaskedLength = unmaskedValue.length,
            replacedSymbol;

        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.value = '';
        maskInfo.cursorOffset = 0;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;
        maskInfo.mask = createMonoMask(unmaskedLength, replacedSymbol);

        return maskInfo;
    };
}(A9));
