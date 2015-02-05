(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        createMonoMask = masking.createMonoMask,
        maskInfo = masking.createMaskInfo(),
        decimal,
        decimalCheckReg = /[0-9,.]/,
        decimalClearIntFormat = /[^0-9]/g,
        decimalClearFloatFormat = /[^0-9\.,]/g,
        firstDividerReg = /[\.,]/,
        allDividersReg = /[\.,]/g,
        emptyString = '',
        tempReplacer = 'x',
        tempReplacerReg = /x/,
        divider,
        defaultDividerFloat = '.',
        maxFloatLength = 2,
        u;

    function unmaskedRule(value, maskInfo, maskingInstance){
        var dividerPos,
            intPart,
            floatPart,
            maskData = a9.getValueByObjectKeys(maskingInstance, 'data'),
            maxLength;

        value = value.replace(decimalClearFloatFormat, emptyString)
            .replace(firstDividerReg, tempReplacer)
            .replace(allDividersReg, emptyString)
            .replace(tempReplacerReg, divider);
        dividerPos = value.indexOf(divider);
//        if ((dividerPos === 0) || (dividerPos === value.length - 1)){
        if (dividerPos === 0){
            value = value.replace(decimalClearIntFormat, emptyString);
        } else if(dividerPos !== -1){
            floatPart = value.substr(dividerPos + 1);
            intPart = value.substr(0, dividerPos);
            if (floatPart > maxFloatLength){
                floatPart = floatPart.substr(0, maxFloatLength);
                value = intPart + divider + floatPart;
                maskInfo.isMoreMax = true;
            }
        }
        if (maskData && ('maxLength' in maskData)){
            maxLength = maskData.maxLength;
            if (intPart === u){
                intPart = value;
            }
            if (intPart.length > maxLength){
                intPart = intPart.substr(0, maxLength);
                if (floatPart === u){
                    value = intPart;
                } else{
                    value = intPart + divider + floatPart;
                }
            }

        }
        return value;
    }

    function correctSymbolsRule(diff, addIncorrect, value, maskInfo, maskingInstance){
        // todo add mismatches
    }

    masks.decimal = decimal = masking.createMaskBasis();

    decimal.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        decimalCheckReg.lastIndex = 0;
        return decimalCheckReg.test(value.charAt(i));
    };

    decimal.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue,
            unmaskedLength,
            replacedSymbol;

        //todo float length setting
        //todo see swf01.digitFormat (in helpers)
        //todo save true numeral value or null in mask
        //todo check length and on check special symbol
        //todo add max and min
        //todo remove zeros in start
        //todo save number value
        //todo[in next life] add negative check and negative flag
        divider = a9.getValueByObjectKeys(maskData, 'dividerFloat') || defaultDividerFloat;
        unmaskedValue = masking.processingValue(
            value,
            maskInfo,
            maskingInstance,
            unmaskedRule,
            correctSymbolsRule
        );
        unmaskedLength = unmaskedValue.length;

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
