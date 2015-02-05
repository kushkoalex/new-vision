(function(a9){
    var simpleInstanceBinding = a9.simpleInstanceBinding('data-a9-masking-mismatch-common');

    function Common($element, mismatchData, maskingInstance){
        var commonMismatch = this;
        commonMismatch.$element = $element;
        commonMismatch.isMismatching = false;
        commonMismatch.reason = {
            maskName: maskingInstance.maskName,
            n: 'common',
            message: mismatchData.invalidMessage,
            messageL10nKey: mismatchData.invalidMessageL10nKey || '',
            mismatchSymbols: ''
        };
        simpleInstanceBinding.bind($element, commonMismatch);
        a9.addCustomEvent($element, 'masking.editable', onMaskingEditable, commonMismatch);
    }

    function onMaskingEditable(value, maskInfo){
        var commonMismatch = this,
            reason;
        if (maskInfo.hasMismatchSymbols){
            commonMismatch.isMismatching = true;
            reason = commonMismatch.reason;
            reason.mismatchSymbols = maskInfo.mismatchSymbols;
            a9.generateCustomEvent(
                commonMismatch.$element,
                'masking.mismatch',
                reason,
                maskInfo
            );
        } else if (commonMismatch.isMismatching){
            commonMismatch.isMismatching = false;
            a9.generateCustomEvent(
                commonMismatch.$element,
                'masking.match',
                commonMismatch.reason,
                maskInfo
            )
        }
    }

    Common.prototype.destructor = function(){
        var commonMismatch = this,
            $element = commonMismatch.$element;
        simpleInstanceBinding.unbind($element);
        a9.removeCustomEvent($element, 'masking.editable', onMaskingEditable);
        commonMismatch.$element = null;
        commonMismatch.reason = null;
    };

    a9.masking.mismatches.common = function($element, mismatchData, maskingInstance){
        var commonMismatchesInstance = simpleInstanceBinding.getByNode($element);
        if (commonMismatchesInstance === null){
            return new Common($element, mismatchData, maskingInstance);
        }
        return commonMismatchesInstance;
    }
}(A9));
