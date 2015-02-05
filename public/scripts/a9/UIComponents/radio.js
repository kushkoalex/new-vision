/**
 * @param {HTMLElement} object checkbox
 */
A9.radioExpandEvents = function(object){
    var a9 = this,
        ieLoad,
        isDisabled = object.disabled,
        isChecked = object.checked,
        isIEInit = a9.deviceInfo.isIE;
    function check(){
        if (isDisabled !== object.disabled){
            isDisabled = object.disabled;
            a9.generateCustomEvent(object, 'disabledChange', isDisabled);
        }
        if (isIEInit && (isChecked !== object.checked)){
            isIEInit = false;
            if (!isChecked){
                isChecked = true;
            }
        } else if (isChecked !== object.checked){
            isChecked = object.checked;
            a9.generateCustomEvent(object, 'checkedChange', isChecked);
        }
    }
    object.setChecked = function(isCheck){
        if (isCheck !== isChecked){
            object.checked = isCheck;
            a9.generateCustomEvent(object, 'checkedChange', isChecked);
        }

    };
    a9.repeatedInspections.add(check);
    if (isIEInit){
        ieLoad = function(){
            isIEInit = false;
            a9.removeEvent(window, 'load', ieLoad);
        };
        a9.addEvent(window, 'load', ieLoad);
    }
    return {
        destructor: function(onDestruction){
            a9.repeatedInspections.remove(check, function(){
                delete object.setChecked;
                if (typeof onDestruction === 'function'){
                    onDestruction();
                }
            });
        }
    }
};

/**
 * Custom radio
 * @param {HTMLElement} object checkbox
 * @param {HTMLElement} visualRadio
 * @param {HTMLElement} radioWrapper
 */
A9.radio = function(object, visualRadio, radioWrapper){
    var a9 = this,
        expandEvents,
        hoverDestructor,
        radio,
        wrapper,
        isHover = false,
        isPressed = false,
        isKeyDown = false,
        isFocused = false,
        isCheckedCache = false,
        isDisabledCache = false;
    if (typeof object.__isRadioInit === 'undefined'){
//        search visual radio
        radio = visualRadio || a9.getParentByClass(object, 'jsVisualRadio');
//        search wrapper
        wrapper = radioWrapper || a9.getParentByClass(radio, 'jsRadioWrapper') || radio;
//        states repaint functions
        function disabled(isDisabled){
            isDisabledCache = isDisabled;
            if (isDisabledCache){
                a9.addClass(wrapper, isCheckedCache ? 'isBothCheckedDisabled' : 'isDisabled');
            } else{
                a9.removeClass(wrapper, isCheckedCache ? 'isBothCheckedDisabled' : 'isDisabled');
            }
        }
        function checked(isChecked){
            isCheckedCache = isChecked;
            a9.removeClasses(wrapper, 'isChecked', 'isBothCheckedDisabled', 'isBothCheckedFocused');
            if (isCheckedCache){
                if (isDisabledCache){
                    a9.addClass(wrapper, 'isBothCheckedDisabled');
                } else{
                    a9.addClass(wrapper, 'isChecked');
                }
                if (isFocused){
                    a9.addClass(wrapper, 'isBothCheckedFocused');
                }
            }
        }
        function press(){
            a9.addClass(wrapper, isCheckedCache ? 'isBothCheckedPressed' : 'isPressed');
        }
        function removePress(){
            a9.removeClasses(wrapper, 'isBothCheckedPressed', 'isPressed');
        }
        function hoverIn(){
            isHover = true;
            if (isPressed){
                press();
            }
        }
//        events functions
//        keyboard
        function keyDown(e){
            if ((e.keyCode == 32) || (e.which == 32)){
                e.preventDefault();
                e.stopPropagation();
                isKeyDown = true;
                press();
            }
        }
        function keyUp(e){
            if (e.keyCode == 32){
                e.preventDefault();
                e.stopPropagation();
                isKeyDown = false;
                if (!isDisabledCache && !isPressed){
                    removePress();
                    if (!isCheckedCache){
                        object.checked = true;
                    }
                } else if (!isDisabledCache && !isHover){
                    removePress();
                }
            }
        }
//        touch
        function touchStart(e){
            e.preventDefault();
            if (!isDisabledCache){
                isPressed = true;
                if (!isFocused){
                    object.focus();
                }
                press();
            }
        }
        function touchEnd(){
            if (!isDisabledCache && isPressed && a9.testParentOf(a9.cache.touchOnElement, radio)){
                isPressed = false;
                removePress();
                if (!isCheckedCache){
                    object.checked = true;
                }
            }
        }
//        mouse
        function mouseDown(e){
            e.preventDefault();
            if (!isDisabledCache){
                isPressed = true;
                if (!isFocused){
                    object.focus();
                }
                press();
            }
        }
        function mouseUp(e){
            e.preventDefault();
            if (!isDisabledCache){
                isPressed = false;
                if (!isKeyDown){
                    if (!isCheckedCache){
                        object.checked = true;
                    }
                    removePress();
                }
            }
        }
        function documentMouseUp(){
            isPressed = false;
            removePress();
        }
//        object events
        function focus(){
            isFocused = true;
            a9.addClass(wrapper, isCheckedCache ? 'isBothCheckedFocused' : 'isFocused');
        }
        function blur(){
            isFocused = isPressed = isKeyDown = false;
            a9.removeClasses(wrapper, 'isFocused', 'isBothCheckedFocused', 'isPressed', 'isBothCheckedPressed');
        }
//        add events
//        for keyboard
        if (a9.deviceInfo.isOpera){
            a9.addEvent(object, 'keypress', keyDown);
        } else if (a9.deviceInfo.isFx){
            a9.addEvent(object, 'keypress', keyDown);
        } else{
            a9.addEvent(object, 'keydown', keyDown);
        }
        a9.addEvent(object, 'keyup', keyUp);
        if (a9.deviceInfo.isTouch){
//            for touch
            a9.addEvent(radio, 'touchstart', touchStart);
            a9.addEvent(document.body, 'touchend', touchEnd);

        } else{
//            for mouse
            a9.addEvent(radio, 'mousedown', mouseDown);
            a9.addEvent(radio, 'mouseup', mouseUp);
            a9.addEvent(document, 'mouseup', documentMouseUp);

        }
//        focus
        a9.addEvent(object, 'focus', focus);
        a9.addEvent(object, 'blur', blur);
//        hover for correct repaint radio press states
        hoverDestructor = a9.hover(radio, function(){
            if (!isHover){
                hoverIn();
            }
        }, function(){
            if (isHover){
                isHover = false;
                if (isPressed && !isKeyDown){
                    removePress();
                }
            }
        }, function(){
            if (!isHover){
                hoverIn();
            }
        });
//        disabled check
        if (object.disabled){
            disabled(true);
        }
//        checked check
        if (object.checked){
            checked(true);
        }
//        expand events
        expandEvents = a9.radioExpandEvents(object);
        a9.addCustomEvent(object, '__disabledChange', disabled);
        a9.addCustomEvent(object, '__checkedChange', checked);
//        init flags
        a9.addClass(wrapper, 'isInit');
        object.__isRadioInit = true;
        return {
            destructor: function(onDestruction){
                hoverDestructor();
                expandEvents.destructor();
                a9.removeCustomEvent(object, '__disabledChange', disabled, true);
                a9.removeCustomEvent(object, '__checkedChange', checked, true);
                if (a9.deviceInfo.isOpera){
                    a9.removeEvent(object, 'keypress', keyDown);
                } else if (a9.deviceInfo.isFx){
                    a9.removeEvent(object, 'keypress', keyDown);
                } else{
                    a9.removeEvent(object, 'keydown', keyDown);
                }
                a9.removeEvent(object, 'keyup', keyUp);
                if (a9.deviceInfo.isTouch){
                    a9.removeEvent(radio, 'touchstart', touchStart);
                    a9.removeEvent(document.body, 'touchend', touchEnd);
                } else{
                    a9.removeEvent(radio, 'mousedown', mouseDown);
                    a9.removeEvent(radio, 'mouseup', mouseUp);
                    a9.removeEvent(document, 'mouseup', documentMouseUp);
                }
                a9.removeEvent(object, 'focus', focus);
                a9.removeEvent(object, 'blur', blur);
                radioWrapper = visualRadio = object = a9 = expandEvents = hoverDestructor = radio = wrapper = isHover = isCheckedCache = isPressed = isKeyDown = isFocused = isDisabledCache = disabled = checked = press = removePress = hoverIn = keyDown = keyUp = touchStart = touchEnd = mouseDown = mouseUp = documentMouseUp = focus = blur = null;
                if (typeof onDestruction === 'function'){
                    onDestruction();
                }
            }
        }
    }
};