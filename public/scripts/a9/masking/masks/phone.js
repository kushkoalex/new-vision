(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = '×',
        maskInfo = masking.createMaskInfo(),
        phoneMasks,

        phoneFirstCheckReg = /[0-9+]/,
        phoneCheckReg = /[0-9]/,

        phoneClearFormat = /(^\+)|\D/g,
        phoneClearSubFormat = /\D/g,

        maxLengthWithPlus = 16,
        maxLengthWithoutPlus = maxLengthWithPlus - 1,

        maskDescription = [['', 6, ' '], ['(', 3, ') '], 3, '-', 2, '-', 2],
        ukrainianMobileMaskDescription = [3, [' (', 2, ') ', true], 3, '-', 2, '-', 2],
        ukrainianMobileMaskDescriptionWithPlus = [4, [' (', 2, ') ', true], 3, '-', 2, '-', 2],
        ukrainianMobileCheckers = [
            '039', '050', '063', '066', '067', '068', '091', '092', '093', '094', '095', '096', '097', '098', '099'
        ],
        masksOnValue = [
            '+380 (××) ×××-××-××',
            '380 (××) ×××-××-××',
            '8 (495) ×××-××-××',
            '8 (499) ×××-××-××',
            '8 (812) ×××-××-××',
            '8 (343) ×××-××-××',
            '8 (351) ×××-××-××',
            '8 (342) ×××-××-××',
            '8 (347) ×××-××-××',
            '8 (383) ×××-××-××',
            '8 (391) ×××-××-××',
            '8 (423) ×××-××-××',
            '8 (473) ×××-××-××',
            '8 (861) ×××-××-××',
            '8 (863) ×××-××-××',
            '8 (846) ×××-××-××',
            '8 (831) ×××-××-××',
            '8 (843) ×××-××-××',
            '8 (9××) ×××-××-××',
            '8 (039) ×××-××-××',
            '8 (050) ×××-××-××',
            '8 (063) ×××-××-××',
            '8 (066) ×××-××-××',
            '8 (068) ×××-××-××',
            '8 (091) ×××-××-××',
            '8 (094) ×××-××-××',
            '8 (095) ×××-××-××',
            '8 (096) ×××-××-××',
            '8 (097) ×××-××-××',
            '8 (098) ×××-××-××',
            '8 (099) ×××-××-××',
            '8 ××××××××××',
            '+7 (495) ×××-××-××',
            '+7 (499) ×××-××-××',
            '+7 (812) ×××-××-××',
            '+7 (343) ×××-××-××',
            '+7 (351) ×××-××-××',
            '+7 (342) ×××-××-××',
            '+7 (347) ×××-××-××',
            '+7 (383) ×××-××-××',
            '+7 (391) ×××-××-××',
            '+7 (423) ×××-××-××',
            '+7 (473) ×××-××-××',
            '+7 (861) ×××-××-××',
            '+7 (863) ×××-××-××',
            '+7 (846) ×××-××-××',
            '+7 (831) ×××-××-××',
            '+7 (843) ×××-××-××',
            '+7 (9××) ×××-××-××',
            '+7 ××××××××××',
            '+971 ×××××××××',
            '(495) ×××-××-××',
            '(499) ×××-××-××',
            '(812) ×××-××-××',
            '(343) ×××-××-××',
            '(351) ×××-××-××',
            '(342) ×××-××-××',
            '(347) ×××-××-××',
            '(383) ×××-××-××',
            '(391) ×××-××-××',
            '(423) ×××-××-××',
            '(473) ×××-××-××',
            '(861) ×××-××-××',
            '(863) ×××-××-××',
            '(846) ×××-××-××',
            '(831) ×××-××-××',
            '(843) ×××-××-××',
            '(9××) ×××-××-××'
        ],
        masksOnValueLength,
        masksOnValueSubstrs,
        masksOnValueLengths,
        masksOnValueFinallyMasks,
        maxOnValueTestLength,
        isInit = false;

    function init(){
        var unmaskedSubstrReg = /[^0-9+]/g,
            unmaskedValueReg = /[0-9+]/g,
            checkMaskedSymbolReg = /[^×]/g,
            i,
            length,
            mask;

        masksOnValueLength = masksOnValue.length;
        masksOnValueSubstrs = [];
        masksOnValueLengths = [];
        masksOnValueFinallyMasks = [];
        maxOnValueTestLength = 0;

        for (i = masksOnValueLength; i-- ;){
            mask = masksOnValue[i];
            masksOnValueSubstrs[i] = mask.replace(unmaskedSubstrReg, '');
            masksOnValueFinallyMasks[i] = mask.replace(unmaskedValueReg, defaultReplacedSymbol);
            masksOnValueLengths[i] = length = masksOnValueFinallyMasks[i].replace(checkMaskedSymbolReg, '').length;
            if (length > maxOnValueTestLength){
                maxOnValueTestLength = length;
            }
        }

        isInit = false;
    }

    masks.phone = phoneMasks = masking.createMaskBasis();

    phoneMasks.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        if (i === 0){
            phoneFirstCheckReg.lastIndex = 0;
            return phoneFirstCheckReg.test(value.charAt(i));
        } else if (!(/\d|\+/g).test(value.substr(0, i))
            && (value.charAt(i) === '+')){
            return true;
        }
        phoneCheckReg.lastIndex = 0;
        return phoneCheckReg.test(value.charAt(i));
    };

    function unmaskedRule(value, maskInfo, maskingInstance){
        var i = 0,
            isFromStart = true;
        return value.replace(phoneClearFormat, function(matched, $1, index){
            if (isFromStart && (i === index)){
                i += 1;
                if (matched === '+'){
                    isFromStart = false;
                    return matched;
                }
            } else{
                isFromStart = false;
            }
            return "";
        });
    }

    function correctSymbolsRule(diff, addIncorrect, value, maskInfo, maskingInstance){
        var str2Diff = diff.str2Diff,
            hasDigitsOrPlusBeforeDiff = (/\d|\+/g).test(value.substr(0, diff.diffStart)),
            plusIndex = str2Diff.indexOf('+'),
            isFirst = true;
        if (!hasDigitsOrPlusBeforeDiff
            && (plusIndex !== -1)
            && ((plusIndex === 0)
                || !(/\d|\+/g).test(str2Diff.substr(0, plusIndex)))
            ){
            str2Diff.replace(phoneClearSubFormat, function(mached){
                if (isFirst
                    && (mached === '+')){
                    isFirst = false;
                } else{
                    addIncorrect(mached);
                }
                return '';
            });
        } else{
            str2Diff.replace(phoneClearSubFormat, function(mached){
                addIncorrect(mached);
                return '';
            });
        }
    }


    phoneMasks.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                unmaskedRule,
                correctSymbolsRule
            ),
            isHasPlus = unmaskedValue.charAt(0) === '+',
            currentMask,
            replacedSymbol,
            unmaskedLength = unmaskedValue.length,

            i,
            isMaskReady = false,
            isMaskOnValue = false,

            checkUkrainianOperatorCodeIndex;

        if (!isInit){
            init();
        }

        if (isHasPlus){
            if (unmaskedLength > maxLengthWithPlus){
                unmaskedLength = maxLengthWithPlus;
                unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
                maskInfo.isMoreMax = true;
            }
        } else if (unmaskedLength > maxLengthWithoutPlus){
            unmaskedLength = maxLengthWithoutPlus;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.value = '';
        maskInfo.cursorOffset = 0;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;
        maskInfo.isShowedByMask = false;

        //check ukrainian
        if ((unmaskedValue.indexOf('+38') !== -1)
            || (unmaskedValue.indexOf('38') !== -1)){

            checkUkrainianOperatorCodeIndex = a9.str_indexOfOfList(unmaskedValue, ukrainianMobileCheckers);
            if (checkUkrainianOperatorCodeIndex.isHasIndex){
                if (isHasPlus
                    && (checkUkrainianOperatorCodeIndex.indexInString === 3)
                    && (unmaskedLength === 6)){
                    currentMask = createMask(ukrainianMobileMaskDescriptionWithPlus, replacedSymbol, unmaskedLength);
                    maskInfo.isShowedByMask = true;
                    if (value.length === 8){
                        maskInfo.cursorOffset = 2;
                    }
                    isMaskReady = true;
                } else if (!isHasPlus
                    && (checkUkrainianOperatorCodeIndex.indexInString === 2)
                    && (unmaskedLength === 5)){
                    currentMask = createMask(ukrainianMobileMaskDescription, replacedSymbol, unmaskedLength);
                    maskInfo.isShowedByMask = true;
                    if (value.length === 7){
                        maskInfo.cursorOffset = 2;
                    }
                    isMaskReady = true;
                }
            }

        }

        //check masks by common substr
        if (!isMaskReady
            && (unmaskedLength <= maxOnValueTestLength)){
            for (i = 0; i < masksOnValueLength; i += 1){
                if ((unmaskedValue.indexOf(masksOnValueSubstrs[i]) === 0)
                    && (unmaskedLength <= masksOnValueLengths[i])){
                    isMaskReady = true;
                    currentMask = masksOnValueFinallyMasks[i];
                    break;
                }
            }
        }

        //create common mask
        if (!isMaskReady){
            if (isHasPlus){
                currentMask = createMask(maskDescription, replacedSymbol, unmaskedLength - 1, true);
                currentMask = replacedSymbol + currentMask;
            } else{
                currentMask = createMask(maskDescription, replacedSymbol, unmaskedLength, true);
            }
        }

        maskInfo.mask = currentMask;

        return maskInfo;
    };
}(A9));