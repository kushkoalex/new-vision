(function(a9){
    var dateFromAPIDate = a9.dateFromAPIDate,
        validation = a9.validation,
        getUnmaskedValue = validation.helpers.getUnmaskedValue,
        regDate = /[0-9]/g,
        format,
        formatDay = 'DD',
        formatMonth = 'MM',
        formatYear = 'YYYY',
        defaultFormat = formatDay + formatMonth + formatYear,
        u;
    validation.validators.date = function(value, validatorDescriptor, inputSourceNode){
        var date,
            dateTime,
            dayDate,
            month,
            year,
            timestampForCheck;

        if ('format' in validatorDescriptor){
            format = validatorDescriptor.format.join('');
        } else{
            format = defaultFormat;
        }

        value = getUnmaskedValue(value, validatorDescriptor, inputSourceNode);
        regDate.lastIndex = 0;
        if (regDate.test(value)){
            dayDate = +value.substr(format.indexOf(formatDay), 2);
            month = (+value.substr(format.indexOf(formatMonth), 2)) - 1;
            year = +value.substr(format.indexOf(formatYear), 4);

            date = new Date(year, month, dayDate);
            if ((dayDate !== date.getDate())
                || (month !== date.getMonth())
                || (year !== date.getFullYear())){
                validatorDescriptor.invalidReason = 'notExist';
                validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.notExist;
                return false;
            }
            dateTime = date.getTime();

            if ('min' in validatorDescriptor){
                timestampForCheck = dateFromAPIDate(validatorDescriptor.min).getTime();
                if (dateTime < timestampForCheck){
                    validatorDescriptor.invalidReason = 'lessMinDate';
                    validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.lessMinDate;
                    return false;
                }
            }

            if ('max' in validatorDescriptor){
                timestampForCheck = dateFromAPIDate(validatorDescriptor.max).getTime();
                if (dateTime > timestampForCheck){
                    validatorDescriptor.invalidReason = 'moreMaxDate';
                    validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.moreMaxDate;
                    return false;
                }
            }

        } else{
            validatorDescriptor.invalidReason = 'notExist';
            validatorDescriptor.invalidMessage = validatorDescriptor.invalidMessages.notExist;
            return false;
        }
        return true;
    }

}(A9));
