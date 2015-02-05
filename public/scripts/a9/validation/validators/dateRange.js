(function(a9){
    var numberClearFormat = /[^0-9]/g;
    a9.validation.validators.dateRange = function(node, childNode){
        var nodeDateFrom,
            nodeDateTo,
            valueDateFrom,
            valueDateTo,
            validatorDescriptor = node.validatorDescriptor;
        node.isValid = true;
        nodeDateFrom = node.child[0];
        nodeDateTo = node.child[1];
        if (!nodeDateFrom.isValidateOnce || !nodeDateTo.isValidateOnce){
            return;
        }

        valueDateFrom = nodeDateFrom.value.replace(numberClearFormat, '');
        valueDateTo = nodeDateTo.value.replace(numberClearFormat, '');

        if ('maxRangeMS' in validatorDescriptor
            && (a9.dateFromDDMMYYYY(valueDateTo).getTime() - a9.dateFromDDMMYYYY(valueDateFrom).getTime()) > validatorDescriptor.maxRangeMS){
            node.isValid = false;
            node.invalidReason = 'maxDatesRangeExceeded';
            node.invalidMessage = validatorDescriptor.invalidMessages.maxDatesRangeExceeded;
        } else if (validatorDescriptor.isFromTo && (a9.dateFromDDMMYYYY(valueDateFrom) > a9.dateFromDDMMYYYY(valueDateTo))){
            node.isValid = false;
            node.invalidReason = 'dateFromBiggerDateTo';
            node.invalidMessage = validatorDescriptor.invalidMessages.dateFromBiggerDateTo;
        }

        node.isValidateOnce = true;
    }
}(A9));
