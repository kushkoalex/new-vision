(function(global, a9){
    var masking = {
            mismatches: {},
            helpers: {},
            masks: {},
            on: {},
            off: {},
            defaultReplacedSymbol: '×',
            make: function($element, maskName, on, isMaskOnInit, data){
                return new MaskingInstance($element, maskName, on, isMaskOnInit, data);
            }
//            ,
//            createMaskBasis: null,
//            createMaskInfo: null,
//            createMask: null,
//            createMonoMask: null,
//            mergeWithMask: null,
//            getMaskInfoForInstance: null,
//            processingValue: null
        },
        maskingInstancePrototype = MaskingInstance.prototype,
        masks = masking.masks;

    function MaskingInstance($element, maskName, on, isMaskOnInit, data){



        var maskingInstance = this,
            initMismatches,
            mismatchesData,
            i,
            iMax,
            hasData = a9.isObject(data);


        if(a9.deviceInfo.isIE) {
            a9.addEvent($element, 'focus', function () {
                a9.cursorPosition.set($element, $element.value.length);
            });
        }


        maskingInstance.e = $element;
        if (!('a9_masking_instances' in $element)){
            $element.a9_masking_instances = [];
            a9.addCustomEvent($element, 'masking.element.event', domMaskingOnEvents);
        }
        $element.a9_masking_instances.push(maskingInstance);
        if ('a9_setValue' in $element){
            $element.a9_setValue = setValue;
        }
        maskingInstance.value = $element.value;
        if (hasData){
            maskingInstance.data = data;
        } else{
            maskingInstance.data = {};
        }
        maskingInstance.maskName = maskName;

        if (hasData
            && ('mismatches' in data)){
            mismatchesData = data.mismatches;
            initMismatches = [];
            for (i = 0, iMax = mismatchesData.length; i < iMax; i += 1){
                if (mismatchesData[i].n in masking.mismatches){
                    initMismatches.push(
                        masking.mismatches[mismatchesData[i].n](
                            $element,
                            mismatchesData[i],
                            maskingInstance
                        )
                    );
                }
            }
            if (initMismatches.length !== 0){
                maskingInstance.mismatches = initMismatches;
            } else{
                maskingInstance.mismatches = null;
            }
        } else{
            maskingInstance.mismatches = null;
        }

        if (!(on in masking.on)){
            on = 'blur';
        }
        masking.on[on]($element);
        maskingInstance.on = on;
        maskingInstance.off = masking.off[on];

        if ((isMaskOnInit === true) && (maskingInstance.value.length !== 0)){
            domMaskingOnEvent($element, maskingInstance);
        }
    }

    function setValue(value){
        this.value = value;
    }

    function domMaskingOnEvents($element, event){
        var i,
            a9_masking_instances = $element.a9_masking_instances;
        for (i = a9_masking_instances.length; i--;) {
            if (a9_masking_instances[i].on === event){
                domMaskingOnEvent($element, a9_masking_instances[i]);
            }
        }
    }
    function domMaskingOnEvent($element, maskingInstance){
        masks[maskingInstance.maskName].editable($element, maskingInstance.data, maskingInstance);
    }

    maskingInstancePrototype.destructor = function(){
        var maskingInstance = this,
            i,
            mismatches,
            a9_masking_instances,
            $element = maskingInstance.e;

        maskingInstance.off = null;
        if ($element.a9_setValue === setValue){
            delete $element.a9_setValue;
        }
        a9_masking_instances = $element.a9_masking_instances;
        a9.deleteElementsInArray(a9_masking_instances, maskingInstance);
        if (a9_masking_instances.length === 0){
            delete $element.a9_masking_instances;
        }

        maskingInstance.e = null;
        maskingInstance.value = null;
        maskingInstance.data = null;
        maskingInstance.maskName = null;
        if (maskingInstance.mismatches !== null){
            mismatches = maskingInstance.mismatches;
            for (i = mismatches.length; i-- ;){
                mismatches.destructor();
            }
        }

    };

    a9.masking = masking;

}(this, A9));

//(on/off)
(function(a9){
    a9.masking.addMaskDOMEvent = function(event, onAdd, onRemove){
        var storeManager = null;

        function generate(){
            var $element = this;
            a9.generateCustomEvent($element, 'masking.element.event', $element, event);
        }

        a9.masking.on[event] = function($element){
            if (storeManager === null){
                storeManager = a9.storeManager(onAdd, onRemove, generate);
            }
            storeManager.add($element);
        };
        a9.masking.off[event] = function($element){
            storeManager.remove($element);
            if (storeManager.isEmpty()){
                storeManager.destructor();
                storeManager = null;
            }
        };
    };
}(A9));

//(on/off)
(function(a9){
    a9.masking.addMaskDOMEvent(
        'blur',
        function(generate){
            a9.addEvent(this, 'blur', generate);
        },
        function(generate){
            a9.removeEvent(this, 'blur', generate);
        }
    );
}(A9));

(function(a9){
    a9.masking.addMaskDOMEvent(
        'focus',
        function(generate){
            a9.addEvent(this, 'focus', generate);
        },
        function(generate){
            a9.removeEvent(this, 'focus', generate);
        }
    );
}(A9));

(function(a9){
    a9.masking.addMaskDOMEvent(
        'change',
        function(generate){
            this.a9_domMaskingOnEvent = generate;
        },
        function(){
            delete this.a9_domMaskingOnEvent;
        }
    );
}(A9));

//createMask
(function(a9){
    a9.masking.createMask = function(maskDescription, replacedSymbol, unmaskedLength, isRightToLeft){
        var currentMask = '',
            subMask,
            currentUnmaskedSize = 0,
            i,
            j;
        if (isRightToLeft === true){
            for (i = maskDescription.length - 1; currentUnmaskedSize < unmaskedLength; i--){
                switch (typeof maskDescription[i]){
                    case 'number':
                        for (j = maskDescription[i]; (currentUnmaskedSize < unmaskedLength) && (j !== 0); j--){
                            currentMask = replacedSymbol + currentMask;
                            currentUnmaskedSize += 1;
                        }
                        break;
                    case 'string':
                        currentMask = maskDescription[i] + currentMask;
                        break;
                    default:
                        subMask = maskDescription[i];
                        currentMask = subMask[2] + currentMask;
                        for (j = subMask[1]; (currentUnmaskedSize < unmaskedLength) && (j !== 0); j--){
                            currentMask = replacedSymbol + currentMask;
                            currentUnmaskedSize += 1;
                        }
                        if ((j === 0)
                            || (subMask[3] !== true)){
                            currentMask = subMask[0] + currentMask;
                        }
                }
            }
        } else{
            for (i = 0; currentUnmaskedSize < unmaskedLength; i += 1){
                switch (typeof maskDescription[i]){
                    case 'number':
                        for (j = maskDescription[i]; (currentUnmaskedSize < unmaskedLength) && (j !== 0); j--){
                            currentMask += replacedSymbol;
                            currentUnmaskedSize += 1;
                        }
                        break;
                    case 'string':
                        currentMask += maskDescription[i];
                        break;
                    default:
                        subMask = maskDescription[i];
                        currentMask += subMask[0];
                        for (j = subMask[1]; (currentUnmaskedSize < unmaskedLength) && (j !== 0); j--){
                            currentMask += replacedSymbol;
                            currentUnmaskedSize += 1;
                        }
                        if ((j === 0)
                            || (subMask[3] !== true)){
                            currentMask += subMask[2];
                        }

                }
            }
        }
        return currentMask;
    }
}(A9));

(function(a9){
    a9.masking.createMonoMask = function(length, replacedSymbol){
        var mask = '';
        for (; length-- ;){
            mask += replacedSymbol;
        }
        return mask;
    }
}(A9));

//mergeWithMask
(function(a9){
    a9.masking.mergeWithMask = function(replacedMaskSymbol, unmaskedValue, mask, isMergeByMask, onUnmaskedChar, onMaskedChar){
        var result = '',
            i = 0,
            unmaskedValueCharPosition = 0,
            iMax,
            u,
            isHasOnUnmasked = onUnmaskedChar !== u,
            isHasOnMasked = onMaskedChar !== u;

        if (isMergeByMask === true){
            iMax = mask.length;
            for (; i < iMax; i += 1){
                if (mask.charAt(i) === replacedMaskSymbol){
                    result += unmaskedValue.charAt(unmaskedValueCharPosition);
                    unmaskedValueCharPosition += 1;
                    if (isHasOnUnmasked){
                        onUnmaskedChar();
                    }
                } else{
                    result += mask.charAt(i);
                    if (isHasOnMasked){
                        onMaskedChar();
                    }
                }
            }
        } else{
            iMax = unmaskedValue.length;
            for (; unmaskedValueCharPosition < iMax; i += 1){
                if (mask.charAt(i) === replacedMaskSymbol){
                    result += unmaskedValue.charAt(unmaskedValueCharPosition);
                    unmaskedValueCharPosition += 1;
                    if (isHasOnUnmasked){
                        onUnmaskedChar();
                    }
                } else{
                    result += mask.charAt(i);
                    if (isHasOnMasked){
                        onMaskedChar();
                    }
                }
            }
        }

        return result;
    }
}(A9));

//create mask info
(function(a9){
    function MaskInfo(){
        var maskInfo = this;
        maskInfo.isMasked = false;
        maskInfo.value = '';
        maskInfo.mask = '';
        maskInfo.replacedSymbol = '';
        maskInfo.cursorOffset = 0;
        maskInfo.unmaskedValue = '';

        maskInfo.lastValue = '';
        maskInfo.inputValue = '';
        maskInfo.outputValue = '';

        maskInfo.hasMismatchSymbols = false;
        maskInfo.mismatchSymbols = '';

        maskInfo.isMoreMax = false;

        maskInfo.inputDiff = null;

        maskInfo.data = null;
    }
    a9.masking.createMaskInfo = function(){
        return new MaskInfo();
    };
}(A9));

(function(a9){
    a9.masking.getMaskInfoForInstance = function(maskInstance, value){
        return a9.masking.masks[maskInstance.maskName].getMaskInfo(
            value || maskInstance.value,
            maskInstance.data,
            maskInstance,
            true
        );
    }
}(A9));

//processing value
(function(a9){
    var processingValueDiffResult = a9.createSubstrDiffObject();

    /**
     * processing value
     * @param {String} value
     * @param {MaskInfo} maskInfo
     * @param {MaskingInstance} maskingInstance
     * @param {RegExp|Function} unmaskedRule
     * @param {RegExp|Function} correctSymbolsRule
     * @returns {String} unmaskedValue
     */
    a9.masking.processingValue = function(value, maskInfo, maskingInstance, unmaskedRule, correctSymbolsRule){
        var u,
            mismatchSymbols,
            unmaskedValue,
            diff;

        maskInfo.inputValue = value;

        if (maskingInstance !== u){
            diff = a9.substrDiff(maskingInstance.value, value, processingValueDiffResult);
            if ((diff.type === 'add') || (diff.type === 'replace')){
                mismatchSymbols = '';
                if (typeof correctSymbolsRule === 'function'){
                    correctSymbolsRule(
                        diff,
                        function(incorrectSymbol){
                            mismatchSymbols += incorrectSymbol;
                        },
                        value,
                        maskInfo,
                        maskingInstance
                    );
                } else if (correctSymbolsRule !== u){
                    diff.str2Diff.replace(correctSymbolsRule, function(incorrectSymbol){
                        mismatchSymbols += incorrectSymbol;
                        return '';
                    });
                }
                if (mismatchSymbols === ''){
                    maskInfo.hasMismatchSymbols = false;
                    maskInfo.mismatchSymbols = '';
                } else{
                    maskInfo.hasMismatchSymbols = true;
                    maskInfo.mismatchSymbols = mismatchSymbols;
                    maskInfo.inputDiff = diff;
                }
            } else{
                maskInfo.hasMismatchSymbols = false;
                maskInfo.mismatchSymbols = '';
            }
        }

        if (typeof unmaskedRule === 'function'){
            unmaskedValue = unmaskedRule(value, maskInfo, maskingInstance);
        } else{
            unmaskedValue = value.replace(unmaskedRule, '');
        }

        return unmaskedValue;
    }
}(A9));

//maskBasis
(function(global, a9){
    var document = global.document,
        a9CursorPosition = a9.cursorPosition,
        maskBasisPrototype,
        editableCursorPosition = 0,
        editableUnmaskedCursorPosition = 0,
        masking = a9.masking,
        defaultReplacedSymbol = masking.defaultReplacedSymbol,
        mergeWithMask = masking.mergeWithMask;

    masking.createMaskBasis = function(){
        return new MaskBasis();
    };

    function MaskBasis(){
        this.getMaskInfo = null;
        this.checkMaskedSymbol = null;
    }

    maskBasisPrototype = MaskBasis.prototype;

    maskBasisPrototype.statical = function(value, data){
        var maskInfo = this.getMaskInfo(value, data),
            unmaskedValue = maskInfo.unmaskedValue;

        if (maskInfo.isMasked){
            value = mergeWithMask(
                maskInfo.replacedSymbol || defaultReplacedSymbol,
                unmaskedValue,
                maskInfo.mask,
                maskInfo.isShowedByMask
            );
        } else{
            value = unmaskedValue;
        }
        maskInfo.outputValue = value;
        return value;
    };


    function editableOnUnmasked(){
        if (editableUnmaskedCursorPosition !== 0){
            editableUnmaskedCursorPosition -= 1;
            editableCursorPosition += 1;
        }
    }

    function editableOnMasked(){
        if (editableUnmaskedCursorPosition !== 0){
            editableCursorPosition += 1;
        }
    }

    maskBasisPrototype.editable = function($input, data, maskingInstance){
        var mask = this,
            value = $input.value,
            cursorPosition,
            i,
            unmaskedCursorPosition,
            maskInfo = mask.getMaskInfo(value, maskingInstance.data, maskingInstance),
            unmaskedValue = maskInfo.unmaskedValue;

        value = maskInfo.value || value;

        if (document.activeElement === $input){
//            get cursor
            cursorPosition = a9CursorPosition.get($input);
            unmaskedCursorPosition = 0;

//            get unmasked cursor position
            for (i = 0; i < cursorPosition; i += 1){
                if (mask.checkMaskedSymbol(value, i, maskInfo, maskingInstance.data, maskingInstance)){
                    unmaskedCursorPosition += 1;
                }
            }

//            merge with current mask
            if (maskInfo.isMasked){
                editableCursorPosition = maskInfo.cursorOffset || 0;
                editableUnmaskedCursorPosition = unmaskedCursorPosition;

                value = mergeWithMask(
                    maskInfo.replacedSymbol || defaultReplacedSymbol,
                    unmaskedValue,
                    maskInfo.mask,
                    maskInfo.isShowedByMask,
                    editableOnUnmasked,
                    editableOnMasked
                );

                cursorPosition = editableCursorPosition;
            } else{
                value = unmaskedValue;
                cursorPosition = unmaskedCursorPosition;
            }

//            set value
            $input.a9_unmasked_value = unmaskedValue;
            $input.value = value;

//            set cursor
            a9CursorPosition.set($input, cursorPosition);
        } else{
            if (maskInfo.isMasked){
                value = mergeWithMask(
                    maskInfo.replacedSymbol || defaultReplacedSymbol,
                    unmaskedValue,
                    maskInfo.mask,
                    maskInfo.isShowedByMask
                );
            } else{
                value = unmaskedValue;
            }

            $input.a9_unmasked_value = unmaskedValue;
            $input.value = value;
        }
        maskInfo.lastValue = maskingInstance.value;
        maskInfo.outputValue = value;
        maskingInstance.value = value;
        a9.generateCustomEvent($input, 'masking.editable', value, maskInfo, data);
        maskInfo.inputDiff = null;
        maskInfo.data = null;
        maskInfo.isMoreMax = false;
        return value;
    };

}(this, A9));
