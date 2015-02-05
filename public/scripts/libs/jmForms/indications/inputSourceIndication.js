//todo prepare for jmf
JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        document = global.document,
        a9 = global.A9,
        l10n = a9.l10n,
        eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
        eventOnPointerDown = a9.deviceInfo.eventOnPointerDown,
        $body = document.body,
        cnCt = global.cnCt,
        tp = cnCt.tp,
        parseHTML = cnCt.parseHTML,
        index = 0,
        inputSourceIndicators = [],
        inputSourceIndicatorDataAttribute = 'data-vib-validate-input',
        inputSourceIndicatorHTMLHintAttribute = 'data-vib-validation-hint',
        validationHintBodyAttribute = 'data-vib-validation-hint-body',
        inputSourceIndicatorHTMLHintCloseAttribute = 'data-vib-validation-hint-close',
        warningFieldCSSClass = 'isWarningField',
        showHintCSSClass = 'isShowHint',
        indicationInputWithErrorInFocusedCSSClass = 'isErrorValidationIndicationInputInFocused',
        defaultValueAttribute = 'data-vib-default-value',
        isInit = false,
        u;

    function onValidate(isValid, validationNode){
        var inputSourceIndicator,
            firstInvalid,
            invalidReason,
            validationHTMLHints,
            $validationResult;

        if ((isValid === false) && (validationNode.e.disabled === false)){
            if ((validationNode.firstInvalid.showOn === 'check') && !validationNode.validationInstance.isInCheck){
                return;
            }

            inputSourceIndicator = inputSourceIndicators[+validationNode.e.getAttribute(inputSourceIndicatorDataAttribute)];

            if (!inputSourceIndicator.isResultCheck && (inputSourceIndicator.defaultValue === validationNode.value)){
                return;
            }

            firstInvalid = validationNode.firstInvalid;
            invalidReason = firstInvalid.invalidReason;
            validationHTMLHints = inputSourceIndicator.validationHTMLHints;
            if ((validationHTMLHints !== null) && (invalidReason in validationHTMLHints)){
                $validationResult = validationHTMLHints[invalidReason];
            } else{
                $validationResult = tp('hintWarningText', firstInvalid.invalidMessage).r;
            }

            showWarning(inputSourceIndicator);
            showHintMessage(inputSourceIndicator, '_validation', $validationResult);
        }
    }

    function onClose(){
        hideAll(inputSourceIndicators[+this.getAttribute(inputSourceIndicatorHTMLHintCloseAttribute)]);
    }

    function hintInAction(e){
        var inputSourceIndicator = inputSourceIndicators[+this.getAttribute(validationHintBodyAttribute)];
        if ((inputSourceIndicator.$hintClose !== null)
            && (e.target !== inputSourceIndicator.$hintClose)
            && (e.target.tagName !== 'A')){
            inputSourceIndicator.$input.focus();
        }
    }

    function hideAll(inputSourceIndicator){
        hideAllMessages(inputSourceIndicator);
        hideWarning(inputSourceIndicator);
    }

    function createHint(inputSourceIndicator){
        var hintWarningBuild = tp('hintWarning', inputSourceIndicator.$wrapper),
            $hintClose = hintWarningBuild.close,
            $hint = hintWarningBuild.r;
        $hint.setAttribute(validationHintBodyAttribute, inputSourceIndicator.id);
        a9.addEvent($hint, eventOnPointerEnd, hintInAction);
        $hintClose.setAttribute(inputSourceIndicatorHTMLHintCloseAttribute, inputSourceIndicator.id);
        a9.addEvent($hintClose, eventOnPointerEnd, onClose);
        inputSourceIndicator.$hint = $hint;
        inputSourceIndicator.$hintClose = $hintClose;
        inputSourceIndicator.$hintContent = hintWarningBuild.content;
        return hintWarningBuild;
    }

    function showHintMessage(inputSourceIndicator, messageName, $message){
        var $hintContent,
            hintMessages = inputSourceIndicator.hintMessages;
        showHint(inputSourceIndicator);
        $hintContent = inputSourceIndicator.$hintContent;
        if (messageName in hintMessages){
            $hintContent.removeChild(hintMessages[messageName]);
        } else{
            inputSourceIndicator.hintMessagesLength += 1;
        }
        hintMessages[messageName] = $message;
        $hintContent.appendChild($message);
    }

    function hideHintMessage(inputSourceIndicator, messageName){
        var hintMessages = inputSourceIndicator.hintMessages;
        if (messageName in hintMessages){
            inputSourceIndicator.$hintContent.removeChild(hintMessages[messageName]);
            inputSourceIndicator.hintMessagesLength -= 1;
            delete hintMessages[messageName];
            if (inputSourceIndicator.hintMessagesLength === 0){
                hideHint(inputSourceIndicator);
            }
        }
    }

    function hideAllMessages(inputSourceIndicator){
        var messages = inputSourceIndicator.hintMessages,
            p;
        offMismatchesStates(inputSourceIndicator);
        for (p in messages){
            hideHintMessage(inputSourceIndicator, p);
        }
    }

    function showHint(inputSourceIndicator){
        if (!inputSourceIndicator.isHintShowed){
            createHint(inputSourceIndicator);
            if (document.activeElement === inputSourceIndicator.$input){
                a9.addClass($body, indicationInputWithErrorInFocusedCSSClass);
            }
            a9.addClass(inputSourceIndicator.$wrapper, showHintCSSClass);
            inputSourceIndicator.isHintShowed = true;
        }
    }

    function hideHint(inputSourceIndicator){
        var $wrapper;
        if (inputSourceIndicator.isHintShowed){
            $wrapper = inputSourceIndicator.$wrapper;
            $wrapper.removeChild(inputSourceIndicator.$hint);
            a9.removeEvent(inputSourceIndicator.$hintClose, eventOnPointerEnd, onClose);
            a9.removeClass($wrapper, showHintCSSClass);
            removeIndicationInputWithErrorInFocused(inputSourceIndicator);
            inputSourceIndicator.$hint = null;
            inputSourceIndicator.$hintClose = null;
            inputSourceIndicator.$hintContent = null;
            inputSourceIndicator.isHintShowed = false;
            hideWarning(inputSourceIndicator);
        }
    }

    function showWarning(inputSourceIndicator){
        if (!inputSourceIndicator.isWarningShowed){
            a9.addClass(inputSourceIndicator.$wrapper, warningFieldCSSClass);
            inputSourceIndicator.isWarningShowed = true;
        }
    }

    function hideWarning(inputSourceIndicator){
        if (inputSourceIndicator.isWarningShowed){
            a9.removeClass(inputSourceIndicator.$wrapper, warningFieldCSSClass);
            inputSourceIndicator.isWarningShowed = false;
        }
    }

    function InputSourceIndicator(validationNode){
        var inputSourceIndicator = this,
            $input = validationNode.e,
            $wrapper,
            $validationHTMLHints,
            $validationHTMLHintsList,
            $hint,
            i;

        inputSourceIndicator.isResultCheck = false;
        inputSourceIndicator.isWarningShowed = false;
        inputSourceIndicator.isSetBodyErrorFocused = false;
        inputSourceIndicator.$input = $input;
        inputSourceIndicator.defaultValue = $input.getAttribute(defaultValueAttribute);
        inputSourceIndicator.$wrapper = $wrapper
            = a9.getParentByClass($input, 'jmfValidateInputSourceWrapper')
                || a9.getParentByClass($input, 'jsInputWrapper')
                || a9.getParentByClass($input, 'jsVisualInput');
        inputSourceIndicator.validationNode = validationNode;
        inputSourceIndicator.isHintShowed = false;
        inputSourceIndicator.$hint = null;
        inputSourceIndicator.$hintClose = null;
        inputSourceIndicator.$hintContent = null;
        inputSourceIndicator.hintMessages = {};
        inputSourceIndicator.hintMessagesLength = 0;
        inputSourceIndicator.mismatches = [];

        if ((validationNode.mask !== u)
            && ('mismatches' in validationNode.mask)){
            a9.addCustomEvent($input, 'masking.mismatch', onMismatch, inputSourceIndicator);
            a9.addCustomEvent($input, 'masking.match', onMatch, inputSourceIndicator);
        }

        $validationHTMLHintsList = a9.$c('validationHintContent', $wrapper);
        if ($validationHTMLHintsList.length !== 0){
            inputSourceIndicator.validationHTMLHints = $validationHTMLHints = {};
            for (i = $validationHTMLHintsList.length; i--;) {
                $hint = $validationHTMLHintsList[i];
                $validationHTMLHints[$hint.getAttribute(inputSourceIndicatorHTMLHintAttribute)] = $hint;
            }
        } else{
            inputSourceIndicator.validationHTMLHints = null;
        }

        a9.addCustomEvent(validationNode, 'validate', onValidate);

        if ($input.type === 'checkbox'){
            a9.addCustomEvent($input, '__checkedChange', onValueChange, inputSourceIndicator);
        } else{
            a9.addCustomEvent($input, '__valueChange', onValueChange, inputSourceIndicator);
        }
        a9.addCustomEvent($input, '__disabledChange', onDisabled, inputSourceIndicator);
        a9.addEvent($input, 'focus', onInputFocus);
        a9.addEvent($input, 'blur', onInputBlur);

        inputSourceIndicator.id = '' + index;
        $input.setAttribute(inputSourceIndicatorDataAttribute, inputSourceIndicator.id);
        inputSourceIndicators[index] = inputSourceIndicator;
        index += 1;
    }

    function onDisabled(){
        hideAll(this);
    }

    function onValueChange(){
        var inputSourceIndicator = this,
            messages = inputSourceIndicator.hintMessages,
            mismatches = inputSourceIndicator.mismatches,
            p,
            index;

        for (p in messages){
            index = a9.arrayIndexOf(mismatches, p);
            if (index !== -1){
                a9.arraySlice(mismatches, index, 1);
            } else{
                hideHintMessage(inputSourceIndicator, p);
            }
        }
    }

    function hideMessagesFromInteraction(inputSourceIndicator){
        hideAllMessages(inputSourceIndicator);
    }

    function offMismatchesStates(inputSourceIndicator){
        inputSourceIndicator.mismatches.length = 0;
    }

    function hideMismatches(inputSourceIndicator){
        var messages = inputSourceIndicator.hintMessages,
            p;
        offMismatchesStates(inputSourceIndicator);
        for (p in messages){
            switch (p){
                case 'common':
                case 'moreMax':
                case 'capsLock':
                case 'locale':
                    hideHintMessage(inputSourceIndicator, p);
                    break;
            }
        }
    }

    function onMismatch(reason, maskInfo, maskData){
        var inputSourceIndicator = this,
            $resultMessage,
            mismatchMessageWrapperBuild,
            $mismatchMessageWrapper,
            $mismatchMessageContent,
            reasonName = reason.n;
//        check name
        switch (reasonName){
            case 'common':
                if (reason.messageL10nKey !== ''){
                    $resultMessage = parseHTML(
                        a9.supplant(
                            l10n(
                                reason.messageL10nKey,
                                'oneOrMore',
                                reason.mismatchSymbols.length
                            ),
                            //substr added for https://softweardev.atlassian.net/browse/VIB-38
                            reason.mismatchSymbols.substr(0, 1)
                        )
                    );
                } else{
                    $resultMessage = parseHTML(reason.message);
                }
                break;
            case 'moreMax':
                if (reason.messageL10nKey !== ''){
                    $resultMessage = parseHTML(
                        a9.supplant(
                            l10n(
                                reason.messageL10nKey,
                                'numeral',
                                maskData.maxLength
                            ),
                            maskData.maxLength
                        )
                    );
                } else{
                    $resultMessage = parseHTML(reason.message);
                }
                break;
            case 'capsLock':
            case 'locale':
                if (reason.messageL10nKey !== ''){
                    $resultMessage = parseHTML(l10n(reason.messageL10nKey));
                } else{
                    $resultMessage = parseHTML(reason.message);
                }
                break;
            default:
                return;
        }
//        build mismatchMessage wrapper
        mismatchMessageWrapperBuild = tp('hintWarningMismatchWrapper', reasonName);
        $mismatchMessageWrapper = mismatchMessageWrapperBuild.r;
        $mismatchMessageContent = mismatchMessageWrapperBuild.content;
        $mismatchMessageContent.appendChild($resultMessage);

//        show
        inputSourceIndicator.mismatches.push(reasonName);
        showWarning(inputSourceIndicator);
        showHintMessage(inputSourceIndicator, reasonName, $mismatchMessageWrapper);
    }

    function onMatch(reason, maskInfo){
//        console.log('match ' + reason.n);
    }

    function onInputFocus(){
        var inputSourceIndicator = inputSourceIndicators[+this.getAttribute(inputSourceIndicatorDataAttribute)];
        if (inputSourceIndicator.isHintShowed){
            a9.addClass($body, indicationInputWithErrorInFocusedCSSClass);
        }
    }
    function onInputBlur(){
        var inputSourceIndicator = inputSourceIndicators[+this.getAttribute(inputSourceIndicatorDataAttribute)];
        hideMismatches(inputSourceIndicator);
        removeIndicationInputWithErrorInFocused(inputSourceIndicator);
    }

    function removeIndicationInputWithErrorInFocused(inputSourceIndicator){
        a9.removeClass($body, indicationInputWithErrorInFocusedCSSClass);
    }

    InputSourceIndicator.prototype.destructor = function(){
//        todo
    };

    jmf.indications.inputSource = function(inputSourceNode, tmplsPrefix){
        return new InputSourceIndicator(inputSourceNode, tmplsPrefix || '');
    };

});
