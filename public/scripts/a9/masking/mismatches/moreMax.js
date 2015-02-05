(function(a9){
    var simpleInstanceBinding = a9.simpleInstanceBinding('data-a9-masking-mismatch-more-max');

    function MoreMax($element, mismatchData, maskingInstance){
        var moreMaxMismatch = this;

        moreMaxMismatch.$element = $element;
        moreMaxMismatch.isMismatching = false;
        moreMaxMismatch.reason = {
            maskName: maskingInstance.maskName,
            n: 'moreMax',
            message: mismatchData.invalidMessage,
            messageL10nKey: mismatchData.invalidMessageL10nKey || ''
        };

        simpleInstanceBinding.bind($element, moreMaxMismatch);

        a9.addCustomEvent($element, 'masking.editable', onMaskingEditable, moreMaxMismatch);
    }

    function onMaskingEditable(value, maskInfo, maskData){
        var moreMaxMismatch = this;
        if (maskInfo.isMoreMax){
            moreMaxMismatch.isMismatching = true;
            a9.generateCustomEvent(
                moreMaxMismatch.$element,
                'masking.mismatch',
                moreMaxMismatch.reason,
                maskInfo,
                maskData
            );
        } else if (moreMaxMismatch.isMismatching){
            moreMaxMismatch.isMismatching = false;
            a9.generateCustomEvent(
                moreMaxMismatch.$element,
                'masking.match',
                moreMaxMismatch.reason,
                maskInfo,
                maskData
            );
        }
    }

    MoreMax.destructor = function(){
        var moreMaxMismatch = this,
            $element = moreMaxMismatch.$element;
        simpleInstanceBinding.unbind($element);
        a9.removeCustomEvent($element, 'masking.editable', onMaskingEditable);
        moreMaxMismatch.$element = null;
        moreMaxMismatch.reason = null;
    };

    a9.masking.mismatches.moreMax = function($element, mismatchData, maskingInstance){
        var moreMaxMismatchesInstance = simpleInstanceBinding.getByNode($element);
        if (moreMaxMismatchesInstance === null){
            return new MoreMax($element, mismatchData, maskingInstance);
        }
        return moreMaxMismatchesInstance;
    }
}(A9));
