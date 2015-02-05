// todo bug with cursor position when changing groups values with equal numbers
(function(a9){
    var global = window,
        masking = a9.masking,
        a9CursorPosition = a9.cursorPosition,
        processingValueDiffResult = a9.createSubstrDiffObject(),

        parseDayFromString = a9.parseDayFromString,
        parseMonthFromString = a9.parseMonthFromString,
        parseYearFromString = a9.parseYearFromString,
        parseUnfinishedDayFromString = a9.parseUnfinishedDayFromString,
        parseUnfinishedMonthFromString = a9.parseUnfinishedMonthFromString,

        masks = masking.masks,
        createMask = masking.createMask,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        mergeWithMask = masking.mergeWithMask,
        maskInfo = masking.createMaskInfo(),
        trackKeyDownCursorPos = a9.trackLastKeyDownCursorPosition(),
        dateDynamic,
        dateCheckReg = /[0-9]/,

        maskDescriptorDivider,
        replaceableDividers = /[/,.-]/g,
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
        datesPartsParsers = {
            DD: parseDayFromString,
            MM: parseMonthFromString,
            YYYY: parseYearFromString
        },
        datesUnfinishedPartsParsers = {
            DD: parseUnfinishedDayFromString,
            MM: parseUnfinishedMonthFromString,
            YYYY: function(year){return year;}  // year can not be autocompleted
        },

        maskDescriptorFullSubMask0 = ['', 1, defaultMaskDescriptorDivider],
        maskDescriptorFullSubMask1 = ['', 1, defaultMaskDescriptorDivider],
        maskDescriptor = [0, maskDescriptorFullSubMask0, 0, maskDescriptorFullSubMask1, 0],

        dataPreviousValueAttribute = 'data-a9-mask-date-previous-value',
        u;

    function createMaskedClearFormat(divider){
        return new RegExp('[^' + divider + '0-9]', 'g');
    }

    function parseDatePart(valueGroups, type, value){
        var args = [value];

        // if value type is day, get month and year if they are available
        if (type === 'DD'){
            addMonthAndYearIfAvailable(valueGroups, args);
        }
        return datesPartsParsers[type].apply(global, args).toString();
    }

    function parseUnfinishedDatePart(valueGroups, type, value){
        var args = [value];

        // if value type is day, get month and year if they are available
        if (type === 'DD'){
            addMonthAndYearIfAvailable(valueGroups, args);
        }
        return datesUnfinishedPartsParsers[type].apply(global, args).toString();
    }

    function addMonthAndYearIfAvailable(valueGroups, args){
        var month,
            year;
        month = valueGroups[maskDescriptorFormat.indexOf('MM')];
        if ((month !== u) && (month.length === 2)){
            args.push(month);
            year = valueGroups[maskDescriptorFormat.indexOf('YYYY')];
            if ((year !== u) && (year.length === 4)){
                args.push(year);
            }
        }
    }

    function parseGroup(valueGroups, groupValueIndex, groupLastCursorPos, diffStr, diffStart){
        var groupValue = valueGroups[groupValueIndex],
            groupValueLength = groupValue.length,
            groupType = maskDescriptorFormat[groupValueIndex],
            groupValueMaxLength = maskSymbolsLength[groupType],
            parsedValue,
            diff;

        // if group value is unfinished
        if (groupValueLength < groupValueMaxLength) {

            // if its been closed by divider, mark value as finished
            if ((diffStr === maskDescriptorDivider) && (valueGroups.length > (groupValueIndex + 1))) {
                parsedValue = parseDatePart(valueGroups, groupType, groupValue);
                maskInfo.cursorOffset = groupValueMaxLength - groupValueLength;
            } else {
                parsedValue = parseUnfinishedDatePart(valueGroups, groupType, groupValue);
                if (parsedValue !== groupValue){
                    maskInfo.cursorOffset = groupValueMaxLength;
                }
            }

            valueGroups[groupValueIndex] = parsedValue;

        // if group value is finished
        } else{

            // parse finished value
            parsedValue = parseDatePart(valueGroups, groupType, groupValue);

            // move cursor to next group if its on or before last cursor position
            if ((diffStart === groupLastCursorPos) || (diffStart === groupLastCursorPos - 1)){
                maskInfo.cursorOffset = 1;

            // move cursor to next group if value changed more than by 1 symbol
            } else {
                diff = a9.substrDiff(groupValue, valueGroups[groupValueIndex], processingValueDiffResult);
                if (diff.type === 'add') {
                    maskInfo.cursorOffset = groupValueMaxLength;
                }
            }
        }
        valueGroups[groupValueIndex] = parsedValue;
    }

    function generateValueGroups(value, previousValue, diff){
        var valueGroups,
            valueGroupsLength,
            prevValueGroups,
            diffType = diff.type,
            diffStart,
            diffStr,
            groupLastCursorPos,
            i;

        // create value groups
        valueGroups = value.split(maskDescriptorDivider);

        // if last group value is bigger than its max value
        // then this value was pasted or changed from outside and should be stripped
        if ((diffType === 'add') || (diffType === 'replace')){
            if ((valueGroups.length === 1) && (valueGroups[0].length > maskSymbolsLength[maskDescriptorFormat[0]])){
                valueGroups.push(valueGroups[0].substr(2));
            }
            if ((valueGroups.length === 2) && (valueGroups[1].length > maskSymbolsLength[maskDescriptorFormat[1]])){
                valueGroups.push(valueGroups[1].substr(2));
            }
        }

        // ignore divider inside group
        if (diffType === 'add'){
            diffStr = diff.str2Diff;
            if (diffStr === maskDescriptorDivider) {
                diffStart = diff.diffStart;
                prevValueGroups = previousValue.split(maskDescriptorDivider);

                groupLastCursorPos = prevValueGroups[0].length;
                if (diffStart < groupLastCursorPos){
                    return prevValueGroups;
                } else if (diffStart > groupLastCursorPos){
                    groupLastCursorPos += prevValueGroups[1].length + 1;
                    if (diffStart < groupLastCursorPos){
                        return prevValueGroups;
                    } else if (diffStart > groupLastCursorPos){
                        groupLastCursorPos += prevValueGroups[2].length + 1;
                        if (diffStart < groupLastCursorPos){
                            return prevValueGroups;
                        }
                    }
                }

            }
        }

        // remove extra groups
        removeExtraGroups(valueGroups);
        valueGroupsLength = valueGroups.length;

        // remove extra symbols in each group
        for (i = 0; i < valueGroupsLength; i += 1) {
            valueGroups[i] = valueGroups[i].substr(0, maskSymbolsLength[maskDescriptorFormat[i]]);
        }

        return valueGroups;
    }

    function removeExtraGroups(valueGroups){
        var valueGroupsLength = valueGroups.length,
            isEmptyGroup = false,
            i;
        if (valueGroupsLength > 3) {
            for (i = valueGroupsLength; i--;) {
                if (valueGroups[i] === ''){
                    isEmptyGroup = true;
                    a9.deleteElementsInArray(valueGroups, valueGroups[i]);
                    break;
                }
            }
            if (!isEmptyGroup){
                valueGroups.length = 3;
            } else {
                removeExtraGroups(valueGroups);
            }
        }
    }

    function parseGroups(value, $input){
        var valueGroups,
            valueGroupsLength,
            previousValue = $input.getAttribute(dataPreviousValueAttribute) || '',
            diff,
            diffType,
            diffStart,
            diffStr,
            cursorPos = a9CursorPosition.get($input),
            dayIndex,
            day,

            processedValue,
            groupLastCursorPos,
            groupValue,
            groupType,
            i,
            keyDownCursorPos;

        // replace all replaceable dividers
        value = value.replace(replaceableDividers, maskDescriptorDivider);

        // clear value from everything except divider and digits
        value = value.replace(dateMaskedClearFormat, '');

        // if cleared value is the same as previous
        if (value === previousValue){

            // fix cursor position when adding symbols in the end of the value
            if (cursorPos > value.length){
                maskInfo.cursorOffset = 1;
            }
            processedValue = value;

        // if cleared value is different
        } else {
            dayIndex = maskDescriptorFormat.indexOf('DD');

            // generate diff
            diff = a9.substrDiff(previousValue, value, processingValueDiffResult);
            diffType = diff.type;
            diffStart = diff.diffStart;

            // generate value groups
            valueGroups = generateValueGroups(value, previousValue, diff);
            processedValue = valueGroups.join(maskDescriptorDivider);
            diffStr = diff.str2Diff;

            // if value changed after groups processing or divider was added
            if ((diffStr === maskDescriptorDivider) || (processedValue !== previousValue)){
                valueGroupsLength = valueGroups.length;

                if (diffType === 'add' || diffType === 'replace'){

                    // fix diffStart in case of changing 12 -> 11 or 11 -> 11
                    if (cursorPos <= diffStart){
                        if (diffStart === cursorPos){
                            diffStart -= 1;
                        } else{
                            diffStart = cursorPos - 1;
                        }
                    }

                    // fix cursor position if descriptor added
                    if (diffStr === maskDescriptorDivider) {
                        maskInfo.cursorOffset = 1;
                    }

                    // validate value of each group
                    groupLastCursorPos = valueGroups[0].length;
                    parseGroup(valueGroups, 0, groupLastCursorPos, diffStr, diffStart);

                    if (valueGroupsLength > 1){
                        groupLastCursorPos += valueGroups[1].length + 1;
                        parseGroup(valueGroups, 1, groupLastCursorPos, diffStr, diffStart);

                        if (valueGroupsLength > 2) {
                            groupLastCursorPos += valueGroups[2].length + 1;
                            parseGroup(valueGroups, 2, groupLastCursorPos, diffStr, diffStart);
                        }
                    }

                } else if (diffType === 'remove') {

                    diffStr = diff.str1Diff;

                    // fix diffStart in case of changing 11 -> 1 or 2222 -> 222 (removing symbol from group with equal symbols)
                    if (cursorPos < diffStart){
                        diffStart = cursorPos;
                    }

                    keyDownCursorPos = trackKeyDownCursorPos.get($input);

                    // if divider was removed, remove last symbol of group before this divider
                    if (diffStr === maskDescriptorDivider){

                        // get value groups from previous value
                        valueGroups = previousValue.split(maskDescriptorDivider);

                        // first divider
                        groupLastCursorPos = valueGroups[0].length;
                        if (diffStart === groupLastCursorPos){

                            // if symbol removed before cursor
                            if (keyDownCursorPos > diffStart) {
                                valueGroups[0] = valueGroups[0].substr(0, valueGroups[0].length - 1);
                                if (valueGroups[0].length === 0) {
                                    maskInfo.cursorOffset = 1;
                                }

                            // if symbol removed after cursor
                            } else {
                                valueGroups[1] = valueGroups[1].substr(1, valueGroups[1].length);
                                if (valueGroups[1].length === 0) {
                                    maskInfo.cursorOffset = 2;
                                } else {
                                    maskInfo.cursorOffset = 1;
                                }
                            }

                        // second divider
                        } else{
                            groupLastCursorPos += valueGroups[1].length + 1;
                            if (diffStart === groupLastCursorPos){

                                // if symbol removed before cursor
                                if (keyDownCursorPos > diffStart) {
                                    valueGroups[1] = valueGroups[1].substr(0, valueGroups[1].length - 1);
                                    if (valueGroups[1].length === 0) {
                                        maskInfo.cursorOffset = 1;
                                    }

                                // if symbol removed after cursor
                                } else {
                                    valueGroups[2] = valueGroups[2].substr(1, valueGroups[2].length);
                                    if (valueGroups[2].length === 0 || valueGroups[1].length === 0) {
                                        maskInfo.cursorOffset = 2;
                                    } else {
                                        maskInfo.cursorOffset = 1;
                                    }
                                }
                            }
                        }

                    // if symbol after divider removed, fix cursor position
                    } else{

                        // symbol from group 2 removed
                        groupLastCursorPos = valueGroups[0].length;
                        if (diffStart === groupLastCursorPos + 1){
                            maskInfo.cursorOffset = 1;

                        // symbol from group 3 removed
                        } else if (valueGroupsLength > 1) {
                            groupLastCursorPos += valueGroups[1].length + 1;
                            if (diffStart === groupLastCursorPos + 1){

                                // if symbol removed after cursor
                                if (diffStart === keyDownCursorPos){
                                    maskInfo.cursorOffset = 2;

                                // if symbol removed before cursor
                                } else {
                                    maskInfo.cursorOffset = 1;
                                }
                            }
                        }
                    }

                    // validate value of each group if its finished
                    for (i = 0; i < valueGroupsLength; i += 1){
                        groupValue = valueGroups[i];
                        groupType = maskDescriptorFormat[i];
                        if (groupValue.length === maskSymbolsLength[groupType]){
                            valueGroups[i] = parseDatePart(valueGroups, groupType, groupValue);
                        }
                    }

                // fix cursor position when:
                //      (entering symbol not in mask
                //      && cursor after last symbol
                //      && cursor after divider)
                } else if (diffType === 'none'){
                    if (cursorPos - 1 === value.length){
                        maskInfo.cursorOffset = 1;
                    }
                }

                // parse day again in case if month change
                day = valueGroups[dayIndex];
                if ((day !== u) && (day.length === 2)){
                    valueGroups[dayIndex] = parseDatePart(valueGroups, 'DD', day);
                }
                adjustMaskDescriptor(valueGroups);
                processedValue = valueGroups.join(maskDescriptorDivider);

            // if value hasn't chaned, just move cursor
            } else{
                maskInfo.cursorOffset = 1;
            }
        }

        return processedValue;
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

    masks.dateDynamic = dateDynamic = masking.createMaskBasis();

    // check each symbol of input value if it's within the range of allowed characters
    dateDynamic.checkMaskedSymbol = function(value, i, maskInfo, maskData, maskingInstance){
        dateCheckReg.lastIndex = 0;
        return dateCheckReg.test(value.charAt(i));
    };

    dateDynamic.getMaskInfo = function(value, maskData, maskingInstance){
        var unmaskedValue,
            replacedSymbol,
            currentMask,
            $input = maskingInstance.e;

        // generate initial mask descriptor based on data provided (or fallback to default DD.MM.YYYY format)
        generateMaskDesciptor(maskData);

        // based on cursor position and diff with previous value:
        //      - adjust masked value
        //      - adjust mask descriptor
        maskInfo.cursorOffset = 0;
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
