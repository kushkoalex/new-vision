// support IE6+, desktop browsers, iOS, Android

/**
 * Расширение событий input.
 * Создаёт кастомные эвенты:
 * __disabledChange — изменение дизэйбола
 * __valueChange — изменение значения
 * @param {HTMLElement} $input input
 * @param {Function} valuePars функция обработки значения, при его изменении
 *
 * For work need
 * from core:
 *     generateEvent;
 *     addCustomEvent;
 *     generateCustomEvent;
 * from helpers:
 *     repeatedInspections
 */
A9.inputExpandEvents = function($input, valuePars){
    var a9,
        valueCache,
        isDisabledCache,
        u,
        value;
    if (!('a9_inputExpandEventsDestructor' in $input)){
        a9 = this;
        valueCache = $input.value;
        isDisabledCache = $input.disabled;
        function check(){
            if (valueCache !== $input.value){
                value = $input.value;
                if (valuePars !== u){
                    $input.value = valueCache = valuePars($input.value, $input);
                } else{
                    if ('a9_domMaskingOnEvent' in $input){
                        a9.generateCustomEvent($input, 'onValueChanged:beforeInputMasked', value);
                        $input.a9_domMaskingOnEvent();
                    }
                    valueCache = $input.value;
                    a9.generateCustomEvent($input, 'onValueChanged:afterInputMasked', value, valueCache);
                }
                a9.generateCustomEvent($input, '__valueChange', valueCache);
                a9.generateCustomEvent($input, 'valueChange', valueCache);
            }
        }
        $input.a9_setValueParse = function(mask){
            valuePars = mask;
        };
        $input.a9_setDisabled = function(isDisabled){
            if (isDisabled !== isDisabledCache){
                $input.disabled = isDisabledCache = isDisabled;
                a9.generateCustomEvent($input, '__disabledChange', isDisabledCache);
            }
        } ;
        $input.a9_setValue = function(value){
            $input.value = value;
            check();
        };
        a9.repeatedInspections.add(check);
        $input.a9_inputExpandEventsDestructor = function (onDestruction){
            a9.repeatedInspections.remove(check, function(){
                delete $input.a9_inputExpandEventsDestructor;
                delete $input.a9_isExtended;
                delete $input.a9_setValueParse;
                delete $input.a9_setValue;
                delete $input.a9_setDisabled;
                a9 = valueCache = isDisabledCache = check = null;
                if (typeof onDestruction === 'function'){
                    onDestruction();
                }
            });
        };
    }
    return $input.a9_inputExpandEventsDestructor;
};


A9.valuePars = function(object){
    var a9 = this;
    function digit(value){
        if (typeof value !== 'undefined'){
            return value.replace(/\D/,'');
        }
        return '';
    }
    a9.valuePars = function(object){
        if ((object == 'digit') || ((typeof object.className !== 'undefined') && a9.hasClass(object, 'jsOnlyDigits'))){
            return digit;
        }
        return null;
    };
    return a9.valuePars(object);
};
/**
 * Плэйсхолдер
 * @param {HTMLElement} $input
 * @param {HTMLElement} $inputWrapper (необязательный) обёртка для которой будут ставится классы-статусы
 *
 * For work need
 * from core:
 *     generateEvent;
 *     addCustomEvent;
 *     generateCustomEvent;
 * from helpers:
 *     repeatedInspections,
 * from this file:
 *     inputsExpandEvents
 *
 * It's desirable for work:
 * from this file:
 *     valuePars,
 *     placeholderInput
 *
 */
A9.placeholderInput = function(object, inputWrapper){
    var that = this,
        expandEventsDestructor,
        wrapper,
        label,
        valuePars,
        isShow = false;
    if (typeof object.__isPlaceholderInputInit === 'undefined'){
//        wrapper search
        wrapper = inputWrapper || that.getParentByClass(object, 'jsPlaceholderWrapper') || that.getParentByClass(object, 'jsInputWrapper');
//        label search
//        label is placeholder text
        label = that.$tn('label', wrapper)[0];
//        label show/hide function
        function labelView(value){
            if (!isShow && (value.length == 0)){
                isShow = true;
                that.removeClass(wrapper, 'isLabelHide');
            } else if (isShow && (value.length > 0)) {
                isShow = false;
                that.addClass(wrapper, 'isLabelHide');
            }
        }
//        remove placeholder attribute
        object.removeAttribute('placeholder');

//        check label show
        if (object.value.length == 0){
            isShow = true;
            that.addClass(label, 'showPlaceholderLabel');
        }
//        expand events check and init if events hasn’t expand
        expandEventsDestructor = that.inputExpandEvents(object);
//        check value
        if (object.value.length > 0){
            isShow = true;
            labelView(object.value);
        }
//        add value change handler
        that.addCustomEvent(object, '__valueChange', labelView);
//        init flags
        object.__isPlaceholderInputInit = true;
        that.addClass(wrapper, 'isPlaceholderInputInit');
//        destructor
        return function(onDestruction){
            if (typeof expandEventsDestructor === 'function'){
                expandEventsDestructor();
            }
            that.removeCustomEvent(object, '__valueChange', labelView, true);
            that.removeCustomEvent(object, '__disabledChange', undefined, true);
            inputWrapper = that = expandEventsDestructor = wrapper = label = valuePars = isShow = labelView = null;
            if (typeof onDestruction === 'function'){
                onDestruction();
            }
        }
    }
};
/**
 * Кастомный инпут
 * @param {HTMLElement} object
 * @param {HTMLElement} inputWrapper (необязательный) обёртка для которой будут ставится классы-статусы
 *
 * For work need
 * from core:
 *     $p;
 *     generateEvent;
 *     addCustomEvent;
 *     generateCustomEvent;
 * from helpers:
 *     repeatedInspections,
 * from this file:
 *     inputsExpandEvents
 *
 * It's desirable for work:
 * from this file:
 *     valuePars,
 *     placeholderInput
 *
 */
(function(a9){
    a9.input = function(object, inputWrapper){
        var expandEventsDestructor,
            placeholderDestructor,
            valuePars,
            wrapper;
        if (typeof object.a9_isInputInit === 'undefined'){
    //        wrapper search
            wrapper = inputWrapper || a9.getParentByClass(object, 'jsInputWrapper') || a9.getParentByClass(object, 'jsVisualInput');
    //        works functions
            function disabled(isDisabled){
                isDisabled ? a9.addClass(wrapper, 'isDisabled') : a9.removeClass(wrapper, 'isDisabled');
            }
            function focus(){
                a9.addClass(wrapper, 'isFocused');
            }
            function blur(){
                a9.removeClass(wrapper, 'isFocused');
            }
    //        add events
            a9.addEvent(object, 'focus', focus);
            a9.addEvent(object, 'blur', blur);
    //        expand events check and init if events hasn’t expand
            expandEventsDestructor = a9.inputExpandEvents(object);
    //        disabled check
            if (object.disabled){
                disabled(true);
            }
    //        disabled change event
            a9.addCustomEvent(object, '__disabledChange', disabled);
    //        placeholder check and init if input is placeholder
            if (a9.hasClass(object, 'jsRealPlaceholderInput') && a9.placeholderInput){
                placeholderDestructor = a9.placeholderInput(object, wrapper);
            }
    //        init flags
            object.a9_isInputInit = true;
            a9.addClass(wrapper, 'isInit');
    //        destructor
            return {
                destructor: function(onDestruction){
                    if (typeof placeholderDestructor === 'function'){
                        placeholderDestructor();
                    }
                    if (typeof expandEventsDestructor === 'function'){
                        expandEventsDestructor();
                    }
                    a9.removeEvent(object, 'focus', focus);
                    a9.removeEvent(object, 'blur', blur);
                    a9.removeCustomEvent(object, '__valueChange', undefined, true);
                    a9.removeCustomEvent(object, '__disabledChange', disabled);
                    inputWrapper = a9 = expandEventsDestructor = placeholderDestructor = valuePars = wrapper = disabled = focus = blur = null;
                    if (typeof onDestruction === 'function'){
                        onDestruction();
                    }
                }
            };
        }
    };
}(A9));