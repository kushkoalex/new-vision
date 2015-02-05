// this mask is for backward compatibility
// todo delete
(function(a9){
    var masking = a9.masking,
        dateFromDDMMYYYY = a9.dateFromDDMMYYYY,
        dateToDDMMYYYY = a9.dateToDDMMYYYY,
        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        mergeWithMask = masking.mergeWithMask,
        maskInfo = masking.createMaskInfo(),
        date,
        dateCheckReg = /[0-9]/,

        dateClearFormat = /[^0-9]/g,

        maskDescriptorFullSubMask = ['', 1, '.'],
        maskDescriptorSubMaskIgnore = 1,
        maskDescriptor = [1, maskDescriptorFullSubMask, 1, maskDescriptorFullSubMask, 4],

        dataPreviousValueAttribute = 'data-a9-mask-date-previous-value';

    masks.date = date = masking.createMaskBasis();


    date.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        dateCheckReg.lastIndex = 0;
        return dateCheckReg.test(value.charAt(i));
    };


    date.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue = masking.processingValue(
                value,
                maskInfo,
                maskingInstance,
                dateClearFormat,
                dateClearFormat
            ),
            unmaskedLength = unmaskedValue.length,
            previousValue,
            replacedSymbol,
            currentMask,
            u;

        if (unmaskedLength > 8){
            unmaskedLength = 8;
            unmaskedValue = unmaskedValue.substr(0, unmaskedLength);
            maskInfo.isMoreMax = true;
        }

        if (unmaskedLength === 8){
            unmaskedValue = dateToDDMMYYYY(dateFromDDMMYYYY(unmaskedValue));
        }


        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.isShowedByMask = true;
        maskInfo.value = '';

        if ((unmaskedLength === 2) || (unmaskedLength === 4)){
            maskInfo.cursorOffset = 1;
        } else{
            maskInfo.cursorOffset = 0;
        }

        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;

//        todo common
        if (maskingInstance !== u){
            previousValue = maskingInstance.e.getAttribute(dataPreviousValueAttribute);
            if ((previousValue !== null)){
                if ((value.length === 2) && (previousValue.length === 3)){
                    maskDescriptor[1] = maskDescriptorSubMaskIgnore;
                    currentMask = createMask(maskDescriptor, replacedSymbol, unmaskedLength, replacedSymbol);
                    maskDescriptor[1] = maskDescriptorFullSubMask;
                } else if ((value.length === 5) && (previousValue.length === 6)){
                    maskDescriptor[3] = maskDescriptorSubMaskIgnore;
                    currentMask = createMask(maskDescriptor, replacedSymbol, unmaskedLength, replacedSymbol);
                    maskDescriptor[3] = maskDescriptorFullSubMask;
                } else{
                    currentMask = createMask(maskDescriptor, replacedSymbol, unmaskedLength, replacedSymbol);
                }
            } else{
                currentMask = createMask(maskDescriptor, replacedSymbol, unmaskedLength, replacedSymbol);
            }
            maskingInstance.e.setAttribute(
                dataPreviousValueAttribute,
                mergeWithMask(
                    maskInfo.replacedSymbol,
                    unmaskedValue,
                    currentMask,
                    maskInfo.isShowedByMask
                )
            );
        } else{
            currentMask = createMask(maskDescriptor, replacedSymbol, unmaskedLength, replacedSymbol);
        }

        maskInfo.mask = currentMask;

        return maskInfo;

    };
}(A9));
