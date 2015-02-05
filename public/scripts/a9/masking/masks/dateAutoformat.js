(function(a9){
    var masking = a9.masking,
        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        maskInfo = masking.createMaskInfo(),
        dateAutoformat,
        dateCheckReg = /[0-9]/,

        maskDescriptorDivider,
        defaultMaskDescriptorDivider = '.',

        dateMaskedClearFormat,
        defaultDateMaskedClearFormat = createMaskedClearFormat(defaultMaskDescriptorDivider),
        dateClearFormat = /[^0-9]/g,

        maskDescriptorFormat,
        defaultMaskDescriptorFormat = ['DD','MM','YYYY'],
        maskSymbolsLength = {
            DD: 2,
            MM: 2,
            YYYY: 4
        },

        maskDescriptorFullSubMask0 = ['', 1, defaultMaskDescriptorDivider],
        maskDescriptorFullSubMask1 = ['', 1, defaultMaskDescriptorDivider],
        maskDescriptor = [0, maskDescriptorFullSubMask0, 0, maskDescriptorFullSubMask1, 0];

    function createMaskedClearFormat(divider){
        return new RegExp('[^' + divider + '0-9]', 'g');
    }

    /**
     * change mask descriptor based on how much symbols there are in each group
     * @param valueGroups
     */
    function adjustMaskDescriptor(valueGroups){
        var valueGroupsLength = valueGroups.length,
            groupLength,
            groupMaxLength;

        // first group descriptor
        groupLength = valueGroups[0].length;
        groupMaxLength = maskSymbolsLength[maskDescriptorFormat[0]];
        if (groupLength < groupMaxLength){
            maskDescriptorFullSubMask0[1] = 0;
            maskDescriptor[0] = groupLength;
        }

        // second group descriptor
        if (valueGroupsLength > 1){
            groupLength = valueGroups[1].length;
            groupMaxLength = maskSymbolsLength[maskDescriptorFormat[1]];
            if (groupLength < groupMaxLength){
                maskDescriptorFullSubMask1[1] = 0;
                maskDescriptor[2] = groupLength;
            }
        }

        // third group descriptor
        if (valueGroupsLength > 2) {
            maskDescriptor[4] = valueGroups[2].length;
        }
    }

    function generateMaskDesciptor(maskData){
        if ('divider' in maskData && maskData.divider !== defaultMaskDescriptorDivider){
            maskDescriptorDivider = maskData.divider.substr(0, 1);
            dateMaskedClearFormat = createMaskedClearFormat(maskDescriptorDivider);
        } else{
            maskDescriptorDivider = defaultMaskDescriptorDivider;
            dateMaskedClearFormat = defaultDateMaskedClearFormat;
        }
        maskDescriptorFormat = maskData.format || defaultMaskDescriptorFormat;

        maskDescriptorFullSubMask0[1] = maskDescriptorFullSubMask1[1] = 1;
        maskDescriptorFullSubMask0[2] = maskDescriptorFullSubMask1[2] = maskDescriptorDivider;

        maskDescriptor[0] = maskSymbolsLength[maskDescriptorFormat[0]] - 1;
        maskDescriptor[2] = maskSymbolsLength[maskDescriptorFormat[1]] - 1;
        maskDescriptor[4] = maskSymbolsLength[maskDescriptorFormat[2]];
    }

    masks.dateAutoformat = dateAutoformat = masking.createMaskBasis();

    // check each symbol of input value if it's within the range of allowed characters
    dateAutoformat.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        dateCheckReg.lastIndex = 0;
        return dateCheckReg.test(value.charAt(i));
    };

    dateAutoformat.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue;

        // generate initial mask descriptor based on data provided (or fallback to default DD.MM.YYYY format)
        generateMaskDesciptor(maskData);

        // based on cursor position and diff with previous value:
        //      - adjust masked value
        //      - adjust mask descriptor
        unmaskedValue = value.replace(dateClearFormat, '');

        // get unmasked value and form basic maskInfo
        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.isShowedByMask = true;
        maskInfo.value = value;
        maskInfo.replacedSymbol = defaultReplacedSymbol;

        // maxLength cut

        // if <maxLength

        // __.__.____
        // __.__.__**
        // **.*_.____
        // **.**.****

        // generate mask
        maskInfo.mask = createMask(maskDescriptor, defaultReplacedSymbol, unmaskedValue.length, false);

        return maskInfo;
    };
}(A9));
