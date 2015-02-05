(function(a9){
    var simpleInstanceBinding = a9.simpleInstanceBinding('data-a9-masking-mismatch-caps-lock');

    function CapsLock($element, mismatchData, maskingInstance){
        var capsLockMismatch = this;

        capsLockMismatch.$element = $element;
        capsLockMismatch.isMismatching = false;
        capsLockMismatch.isBlockToChange = false;
        capsLockMismatch.reason = {
            maskName: maskingInstance.maskName,
            n: 'capsLock',
            message: mismatchData.invalidMessage,
            messageL10nKey: mismatchData.invalidMessageL10nKey || ''
        };

        simpleInstanceBinding.bind($element, capsLockMismatch);

        a9.addEvent($element, 'keypress', detectCapsLock);
        a9.addCustomEvent($element, 'capsLockModeDetected', onCapsLockDetected, capsLockMismatch);
        a9.addCustomEvent($element, '__valueChange', onValueChange, capsLockMismatch);
    }

    function detectCapsLock(e){
        var keyCode = e.keyCode ? e.keyCode : e.which,
            shiftKey = e.shiftKey ? e.shiftKey : ((keyCode == 16) ? true : false);

        a9.generateCustomEvent(
            this, 
            'capsLockModeDetected',
            //todo add russian and ukrainian alphabets
            (((keyCode >= 65) && (keyCode <= 90))
                && !shiftKey)
            || (((keyCode >= 97) && (keyCode <= 122))
                && shiftKey));
    }

    function onCapsLockDetected(isCapsLockOn){
        var capsLockMismatch = this;
        if (isCapsLockOn){
            capsLockMismatch.isBlockToChange = true;
            capsLockMismatch.isMismatching = true;
            a9.generateCustomEvent(
                capsLockMismatch.$element,
                'masking.mismatch',
                capsLockMismatch.reason
            )
        }
    }

    function onValueChange(){
        var capsLockMismatch = this;
        if (capsLockMismatch.isBlockToChange){
            capsLockMismatch.isBlockToChange = false;
        } else if (capsLockMismatch.isMismatching){
            capsLockMismatch.isMismatching = false;
            a9.generateCustomEvent(
                capsLockMismatch.$element,
                'masking.match',
                capsLockMismatch.reason
            )
        }
    }

    CapsLock.destructor = function(){
        var capsLockMismatch = this,
            $element = capsLockMismatch.$element;

        a9.removeEvent($element, 'keypress', detectCapsLock);
        a9.removeCustomEvent($element, 'capsLockModeDetected', onCapsLockDetected);
        a9.removeCustomEvent($element, '__valueChange', onValueChange);
        capsLockMismatch.$element = null;

        capsLockMismatch.reason = null;
    };



    a9.masking.mismatches.capsLock = function($element, mismatchData, maskingInstance){
        var capsLockMismatchesInstance = simpleInstanceBinding.getByNode($element);
        if (capsLockMismatchesInstance === null){
            return new CapsLock($element, mismatchData, maskingInstance);
        }
        return capsLockMismatchesInstance;
    }
}(A9));
