(function(a9){
    var global = window,
        masking = a9.masking,
        parseDayFromString = a9.parseDayFromString,
        parseMonthFromString = a9.parseMonthFromString,
        parseYearFromString = a9.parseYearFromString,
        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        mergeWithMask = masking.mergeWithMask,
        maskInfo = masking.createMaskInfo(),
        dateStatic,
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
        maskGroupsParsers = {
            DD: parseDayFromString,
            MM: parseMonthFromString,
            YYYY: parseYearFromString  // todo is current behaviour for year with leading zeroes correct?
        },

        maskDescriptorFullSubMask0 = ['', 1, defaultMaskDescriptorDivider],
        maskDescriptorFullSubMask1 = ['', 1, defaultMaskDescriptorDivider],
        maskDescriptor = [0, maskDescriptorFullSubMask0, 0, maskDescriptorFullSubMask1, 0],

        dataPreviousValueAttribute = 'data-a9-mask-date-previous-value',
        u;

    function createMaskedClearFormat(divider){
        return new RegExp('[^' + divider + '0-9]', 'g');
    }

    function getMaskGroupParsedValue(valueGroups, groupValueIndex, type, value){
        var args = [value],
            month,
            year;
        if (type === 'DD'){
            month = valueGroups[maskDescriptorFormat.indexOf('MM')];
            if ((month !== u) && (month.length === 2)){
                args.push(month);
                year = valueGroups[maskDescriptorFormat.indexOf('YYYY')];
                if ((year !== u) && (year.length === 4)){
                    args.push(year);
                }
            }
        }
        valueGroups[groupValueIndex] =  maskGroupsParsers[type].apply(global, args).toString();
    }

    function generateValueGroups(value){
        var valueGroups,
            valueGroupsLength,
            i;

        // create value groups
        valueGroups = value.split(maskDescriptorDivider);
        valueGroupsLength = valueGroups.length;

        // if last group value is bigger than its max value
        // then this value was pasted or changed from outside and should be stripped
        if ((valueGroupsLength === 1) && (valueGroups[0].length > maskSymbolsLength[maskDescriptorFormat[0]])){
            valueGroups.push(valueGroups[0].substr(2));
            valueGroupsLength = 2;
        }
        if ((valueGroupsLength === 2) && (valueGroups[1].length > maskSymbolsLength[maskDescriptorFormat[1]])){
            valueGroups.push(valueGroups[1].substr(2));
            valueGroupsLength = 3;
        }

        // remove extra groups
        if (valueGroupsLength > 3) {
            valueGroups.length = valueGroupsLength = 3;
        }

        // remove extra symbols in each group
        for (i = 0; i < valueGroupsLength; i += 1) {
            valueGroups[i] = valueGroups[i].substr(0, maskSymbolsLength[maskDescriptorFormat[i]]);
        }

        return valueGroups;
    }

    function parseGroups(value, $input){
        var valueGroups,
            valueGroupsLength,
            dayIndex = maskDescriptorFormat.indexOf('DD'),
            day;

        // clear value from everything except divider and digits
        value = value.replace(dateMaskedClearFormat, '');

        // generate value groups
        valueGroups = generateValueGroups(value);
        valueGroupsLength = valueGroups.length;

        if ((valueGroups[1] !== u) && (valueGroups[1].length !== 0)){
            getMaskGroupParsedValue(valueGroups, 0, maskDescriptorFormat[0], valueGroups[0]);
        }

        if ((valueGroupsLength > 1) && (valueGroups[2] !== u) && (valueGroups[2].length !== 0)){
            getMaskGroupParsedValue(valueGroups, 1, maskDescriptorFormat[1], valueGroups[1]);

            if (valueGroupsLength > 2) {
                getMaskGroupParsedValue(valueGroups, 2, maskDescriptorFormat[2], valueGroups[2]);
            }
        }

        // parse day again in case if month change
        day = valueGroups[dayIndex];
        if ((day !== u) && (day.length === 2)){
            getMaskGroupParsedValue(valueGroups, dayIndex, 'DD', day);
        }
        adjustMaskDescriptor(valueGroups);

        return valueGroups.join(maskDescriptorDivider);
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

    masks.dateStatic = dateStatic = masking.createMaskBasis();

    // check each symbol of input value if it's within the range of allowed characters
    dateStatic.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        dateCheckReg.lastIndex = 0;
        return dateCheckReg.test(value.charAt(i));
    };

    dateStatic.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue,
            replacedSymbol,
            currentMask,
            $input = maskingInstance.e;

        // generate initial mask descriptor based on data provided (or fallback to default DD.MM.YYYY format)
        generateMaskDesciptor(maskData);

        // based on cursor position and diff with previous value:
        //      - adjust masked value
        //      - adjust mask descriptor
        value = parseGroups(value, $input);
        unmaskedValue = value.replace(dateClearFormat, '');

        // get unmasked value and form basic maskInfo
//        unmaskedValue = masking.processingValue(
//            value,
//            maskInfo,
//            maskingInstance,
//            dateClearFormat,
//            dateClearFormat
//        );
        maskInfo.unmaskedValue = unmaskedValue;
        maskInfo.isMasked = true;
        maskInfo.isShowedByMask = true;
        maskInfo.value = value;
        maskInfo.replacedSymbol = replacedSymbol = defaultReplacedSymbol;

        // generate mask
        currentMask = createMask(maskDescriptor, replacedSymbol, unmaskedValue.length, false);
        maskInfo.mask = currentMask;

        // remember current value
        $input.setAttribute(
            dataPreviousValueAttribute,
            mergeWithMask(
                maskInfo.replacedSymbol,
                unmaskedValue,
                currentMask,
                maskInfo.isShowedByMask
            )
        );

        return maskInfo;
    };
}(A9));
