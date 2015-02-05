(function(a9){
    var locales = {
            eng: /[a-z]/ig
        },
        clearCommonSymbolsAndDigits = /[0-9±§<>!@#$£¢€¬√—–«»„“”‘’‹›™¡∞§¶•ªº–≠‚·°‡ﬂ⁄/%^&*()_+№%:;()_+{}[\]\\|'"?,.`~ ≈≠©÷∆…≤≥®åß∂Ωç∫œ∑øπæÅÁ¥‰ÔÓÒÚÆÂ◊ªºµ]/g,

        simpleInstanceBinding = a9.simpleInstanceBinding('data-a9-masking-mismatch-locale');

    function Locale($element, mismatchData, maskingInstance){
        var localeMismatches = this;

        localeMismatches.$element = $element;
        localeMismatches.isMismatching = false;
        localeMismatches.enable = mismatchData.enable;
        localeMismatches.reason = {
            maskName: maskingInstance.maskName,
            n: 'locale',
            message: mismatchData.invalidMessage,
            messageL10nKey: mismatchData.invalidMessageL10nKey || ''
        };

        simpleInstanceBinding.bind($element, localeMismatches);

        a9.addCustomEvent($element, 'masking.editable', onMaskingEditable, localeMismatches);
    }

    function checkForEnableLocales(localeMismatches, symbols){
        var i,
            enable = localeMismatches.enable;
        symbols = symbols.replace(clearCommonSymbolsAndDigits, '');
        if (symbols === ''){
            return true;
        }
        for (i = enable.length; i-- ;){
            if (enable[i] in locales){
                symbols = symbols.replace(locales[enable[i]], '');
                if (symbols === ''){
                    return true;
                }
            } else{
                return true;
            }
        }
        return false;
    }

    function onMaskingEditable(value, maskInfo){
        var localeMismatches = this;

        if (maskInfo.hasMismatchSymbols
            && !checkForEnableLocales(
                localeMismatches,
                maskInfo.mismatchSymbols
            )){
            localeMismatches.isMismatching = true;
            a9.generateCustomEvent(
                localeMismatches.$element,
                'masking.mismatch',
                localeMismatches.reason,
                maskInfo
            );
        } else if (localeMismatches.isMismatching){
            localeMismatches.isMismatching = false;
            a9.generateCustomEvent(
                localeMismatches.$element,
                'masking.match',
                localeMismatches.reason,
                maskInfo
            );
        }
    }

    Locale.destructor = function(){
        var localeMismatches = this,
            $element = localeMismatches.$element;
        simpleInstanceBinding.unbind($element);
        a9.removeCustomEvent($element, 'masking.editable', onMaskingEditable);
        localeMismatches.$element = null;
        localeMismatches.reason = null;
        localeMismatches.enable = null;
    };

    a9.masking.mismatches.locale = function($element, mismatchData, maskingInstance){
        var localeMismatches = simpleInstanceBinding.getByNode($element);
        if (localeMismatches === null){
            return new Locale($element, mismatchData, maskingInstance);
        }
        return localeMismatches;
    }

}(A9));
