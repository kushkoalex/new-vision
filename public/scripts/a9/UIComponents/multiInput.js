(function(a9){
    var a9CursorPosition = a9.cursorPosition,
        testEventOfKeyName = a9.testEventOfKeyName,
        MultiInputPrototype,
        MultiInputItemPrototype,
        simpleInstanceBinding = a9.simpleInstanceBinding('data-a9-multi-input-item-index');

    function bind(_fn, ctx){
       return function(){
          _fn.apply(ctx, arguments);
       };
    }

    a9.multiInput = function($inputs, inputsLengths){
        if ($inputs.length > 1){
            return new MultiInput($inputs, inputsLengths);
        } else{
            //console.log('error: there are should be at least two inputs for multiInput component');
            return null;
        }
    };

    function MultiInput($inputs, inputsLengths){
        var multiInput = this,
            i,
            lastInputIndex,
            inputsCount = $inputs.length,
            multiInputItems;

        multiInput.$inputs = $inputs;
        multiInput.multiInputItems = [];
        multiInputItems = multiInput.multiInputItems;

        multiInputItems.push(new MultiInputItem({
            $input: $inputs[0],
            maxValueLength: inputsLengths[0],
            $nextInput: $inputs[1],
            multiInput: multiInput
        }));

        lastInputIndex = inputsCount - 1;
        if (inputsCount > 2){
            for (i = 1; i < lastInputIndex; i += 1){
                multiInputItems.push(new MultiInputItem({
                    $input: $inputs[i],
                    maxValueLength: inputsLengths[i],
                    $prevInput: $inputs[i - 1],
                    $nextInput: $inputs[i + 1],
                    multiInput: multiInput
                }));
            }
        }

        multiInputItems.push(new MultiInputItem({
            $input: $inputs[lastInputIndex],
            maxValueLength: inputsLengths[lastInputIndex],
            $prevInput: $inputs[lastInputIndex - 1],
            multiInput: multiInput
        }));

        multiInput.combineValues();

        return multiInput;
    }

    MultiInputPrototype = MultiInput.prototype;

    MultiInputPrototype.combineValues = function(){
        var multiInput = this,
            i,
            value = '',
            $inputs = multiInput.$inputs,
            inputsCount = $inputs.length;
        for (i = 0; i < inputsCount; i += 1) {
            value += $inputs[i].value;
        }
        a9.generateCustomEvent(multiInput, 'valueChange', value);
    };

    MultiInputPrototype.destructor = function(){
        var multiInput = this,
            multiInputItems = multiInput.multiInputItems,
            i;
        for (i = multiInputItems.length; i--;) {
            multiInputItems[i].destructor();
        }
        multiInputItems.length = 0;
        multiInput.$inputs = null;
        multiInput.multiInputItems = null;
    };

    function MultiInputItem(options){
        var input = this,
            $input = options.$input;

        simpleInstanceBinding.bind($input, input);

        input.$input = $input;
        input.currentValue = $input.value;
        input.multiInput = options.multiInput;

        input.maxValueLength = options.maxValueLength;

        if ('$prevInput' in options){
            input.$prevInput = options.$prevInput;
            input.valueOnKeyDown = $input.value;
            // todo remove bind
            input.goToPrevInputByBackspace = bind(goToPrevInputByBackspace, input);
            a9.addEvent($input, 'keydown', input.goToPrevInputByCursor);
        }
        if ('$nextInput' in options){
            input.$nextInput = options.$nextInput;
            a9.addEvent($input, 'keydown', input.goToNextInputByCursor);

            // if value is pasted into series input, remember its unmasked state
            if ('a9_domMaskingOnEvent' in $input){
                a9.addCustomEvent($input, 'onValueChanged:beforeInputMasked', input.checkPastedValueBeforeMasking);
            }

            // depending on value length and cursor position in series field jump to number field
            a9.addCustomEvent($input, '__valueChange', input.goToNextInputByValueChange);
        }

        // update real value on fields change
        a9.addCustomEvent($input, '__valueChange', input.updateValue);
        return input;
    }

    MultiInputItemPrototype = MultiInputItem.prototype;

    MultiInputItemPrototype.updateValue = function(value){
        var $input = this,
            input = simpleInstanceBinding.getByNode($input),
            maxLength = input.maxValueLength,
            cursorPositionCache;

        if (value.length > maxLength) {
            cursorPositionCache = a9CursorPosition.get($input);
            $input.value = value.substr(0, maxLength);
            a9CursorPosition.set($input, cursorPositionCache);
            if ('$nextInput' in input){
                input.rememberUnmaskedValue($input, value);
            }
        } else{
            input.currentValue = value;
            input.multiInput.combineValues();
        }
    };

    MultiInputItemPrototype.goToPrevInputByCursor = function(e){
        var $input = this,
            input = simpleInstanceBinding.getByNode($input),
            $prevInput;

        input.valueOnKeyDown = input.currentValue;

        if (a9CursorPosition.get($input) === 0){
            if (testEventOfKeyName(e, 'back')){
                setTimeout(input.goToPrevInputByBackspace, 17);
            } else if (testEventOfKeyName(e, 'aLeft')) {
                e.preventDefault();
                $prevInput = input.$prevInput;
                $prevInput.focus();
                a9CursorPosition.set($prevInput, $prevInput.value.length);
            }
        }
    };

    MultiInputItemPrototype.goToNextInputByCursor = function(e){
        var $input = this,
            input = simpleInstanceBinding.getByNode($input),
            $nextInput;
        if (testEventOfKeyName(e, 'aRight') && (a9CursorPosition.get($input) === $input.value.length)){
            $nextInput = input.$nextInput;
            $nextInput.focus();
            e.preventDefault();
            a9CursorPosition.set($nextInput, 0);
        }
    };

    MultiInputItemPrototype.checkPastedValueBeforeMasking = function(value){
        var $input = this,
            input = simpleInstanceBinding.getByNode($input);
        if (value.length > input.maxValueLength){
            input.rememberUnmaskedValue($input, value);
        }
    };

    MultiInputItemPrototype.rememberUnmaskedValue = function($input, value){
        this.$nextInput.a9_multi_input_is_value_pasted = true;
        $input.a9_multi_input_unmasked_value = value;
    };

    MultiInputItemPrototype.goToNextInputByValueChange = function(value){
        var $input = this,
            input = simpleInstanceBinding.getByNode($input),
            $nextInput,
            maxLength = input.maxValueLength;

        if ((value.length === maxLength) && (a9CursorPosition.get($input) === maxLength)){
            $nextInput = input.$nextInput;
            $nextInput.focus();
            if ($nextInput.a9_multi_input_is_value_pasted){
                $nextInput.value = getUnmaskedValueLeftover(value, $input.a9_multi_input_unmasked_value) + $nextInput.value;
                $nextInput.a9_multi_input_is_value_pasted = false;
            } else{
                a9CursorPosition.set($nextInput, 0);
            }
        }
    };

    MultiInputItemPrototype.destructor = function(){
        var input = this,
            $input = input.$input;

        simpleInstanceBinding.unbind($input, input);

        if ('$prevInput' in input){
            a9.removeEvent($input, 'keydown', input.goToPrevInputByCursor);
            input.$prevInput = null;
            input.goToPrevInputByBackspace = null;
            input.valueOnKeyDown = null;
        }
        if ('$nextInput' in input){
            a9.removeEvent($input, 'keydown', input.goToNextInputByCursor);
            if ('a9_domMaskingOnEvent' in $input){
                a9.removeCustomEvent($input, 'onValueChanged:beforeInputMasked', input.checkPastedValueBeforeMasking);
            }
            a9.removeCustomEvent($input, '__valueChange', input.goToNextInputByValueChange);
            input.$nextInput = null;
        }

        a9.removeCustomEvent($input, '__valueChange', input.updateValue);

        input.$input = null;
        input.currentValue = null;
        input.maxValueLength = null;
        input.multiInput = null;
    };

    function getUnmaskedValueLeftover(maskedValue, unmaskedValue){
        var maskedValueLength = maskedValue.length,
            i,
            iMax,
            searchableMaskedValue = maskedValue.toLowerCase(),
            searchableUnmaskedValue = unmaskedValue.toLowerCase(),
            index,
            realIndex = 0;

        for (i = 0, iMax = maskedValueLength; i < iMax; i += 1){
            index = searchableUnmaskedValue.indexOf(searchableMaskedValue[i]) + 1;
            realIndex += index;
            searchableUnmaskedValue = searchableUnmaskedValue.substr(index);
        }

        return unmaskedValue.substr(realIndex);
    }

    function goToPrevInputByBackspace(){
        var input = this,
            $prevInput;
        if ((a9CursorPosition.get(input.$input) === 0) && (input.valueOnKeyDown === input.currentValue)){
            $prevInput = input.$prevInput;
            $prevInput.focus();
            $prevInput.value = $prevInput.value.substr(0, $prevInput.value.length - 1);
            a9CursorPosition.set($prevInput, $prevInput.value.length);
        }
    }
}(A9));
