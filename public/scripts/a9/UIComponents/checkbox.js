(function(a9){
    a9.checkboxExpandEvents = function(object){
        var isCacheDisabled = object.disabled,
            isCacheChecked = object.checked;
        function check(){
            if (isCacheDisabled !== object.disabled){
                isCacheDisabled = object.disabled;
                a9.generateCustomEvent(object, '__disabledChange', isCacheDisabled);
            }
            if (isCacheChecked !== object.checked){
                isCacheChecked = object.checked;
                a9.generateCustomEvent(object, 'beforeCheckedChange', isCacheChecked);
                if (object !== null){
                    if (object.checked === isCacheChecked){
                        a9.generateCustomEvent(object, '__checkedChange', isCacheChecked);
                        a9.generateCustomEvent(object, 'checkedChange', isCacheChecked);
                    } else{
                        isCacheChecked = object.checked;
                    }
                }
            }
        }
        object.setChecked = function(isChecked){
            if (isChecked !== isCacheChecked){
                object.checked = isCacheChecked = isChecked;
                a9.generateCustomEvent(object, 'beforeCheckedChange', isCacheChecked);
                if (object !== null){
                    if (object.checked === isCacheChecked){
                        a9.generateCustomEvent(object, '__checkedChange', isCacheChecked);
                        a9.generateCustomEvent(object, 'checkedChange', isCacheChecked);
                    } else{
                        isCacheChecked = object.checked;
                    }
                }
            }
        };
        a9.repeatedInspections.add(check);
        return {
            destructor: function(onDestruction){
                a9.repeatedInspections.remove(check, function(){
                    delete object.setChecked;
                    object = isCacheDisabled = isCacheChecked = null;
                    if (typeof onDestruction === 'function'){
                        onDestruction();
                    }
                });
            }
        }
    };
}(A9));

(function(global, a9){
    a9.checkbox = function(object, visualCheckbox, checkBoxWrapper){
        var expandEvents,
            hover,
            checkbox,
            wrapper,
            isHover = false,
            isCheckedCache = false,
            isPressed = false,
            isKeyDown = false,
            isFocused = false,
            isDisabledCache = false;
        if (typeof object.__isCheckboxInit === 'undefined'){
            checkbox = visualCheckbox || a9.getParentByClass(object, 'jsVisualCheckbox');
            wrapper = checkBoxWrapper || a9.getParentByClass(checkbox, 'jsCheckboxWrapper') || checkbox;
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
                } else if (isFocused){
                    a9.addClass(wrapper, 'isFocused');
                }
            }
            function press(){
                a9.addClass(wrapper, isCheckedCache ? 'isBothCheckedPressed' : 'isPressed');
            }
            function removePress(){
                if (!isKeyDown){
                    a9.removeClasses(wrapper, 'isBothCheckedPressed', 'isPressed');
                }
            }
            function hoverIn(){
                isHover = true;
                if (isPressed){
                    press();
                }
            }
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
                        object.checked = !isCheckedCache;
                    } else if (!isDisabledCache && !isHover){
                        removePress();
                    }
                }
            }
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
                if (!isDisabledCache && isPressed && a9.testParentOf(a9.store.touchOnElement, checkbox)){
                    isPressed = false;
                    removePress();
                    object.checked = !isCheckedCache;
                }
            }
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
                        object.checked = !isCheckedCache;
                        removePress();
                    }
                }
            }
            function documentMouseUp(){
                isPressed = false;
                removePress();
            }
            function focus(){
                isFocused = true;
                a9.addClass(wrapper, isCheckedCache ? 'isBothCheckedFocused' : 'isFocused');
            }
            function blur(){
                isFocused = isPressed = isKeyDown = false;
                a9.removeClasses(wrapper, 'isFocused', 'isBothCheckedFocused', 'isPressed', 'isBothCheckedPressed');
            }
            if (a9.deviceInfo.isOpera){
                a9.addEvent(object, 'keypress', keyDown);
            } else if (a9.deviceInfo.isFx){
                a9.addEvent(object, 'keypress', keyDown);
            } else{
                a9.addEvent(object, 'keydown', keyDown);
            }
            a9.addEvent(object, 'keyup', keyUp);
            if (a9.deviceInfo.isTouch){
                a9.addEvent(checkbox, 'touchstart', touchStart);
                a9.addEvent(global.document.body, 'touchend', touchEnd);

            } else{
                a9.addEvent(checkbox, 'mousedown', mouseDown);
                a9.addEvent(checkbox, 'mouseup', mouseUp);
                a9.addEvent(global.document, 'mouseup', documentMouseUp);

            }
            a9.addEvent(object, 'focus', focus);
            a9.addEvent(object, 'blur', blur);
            hover = a9.hover(checkbox, function(){
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
            if (object.disabled){
                disabled(true);
            }
            if (object.checked){
                checked(true);
            }
            expandEvents = a9.checkboxExpandEvents(object);
            a9.addCustomEvent(object, '__disabledChange', disabled);
            a9.addCustomEvent(object, '__checkedChange', checked);
            a9.addClass(wrapper, 'isInit');
            object.__isCheckboxInit = true;
            return {
                destructor: function(onDestruction){
                    hover.destructor();
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
                        a9.removeEvent(checkbox, 'touchstart', touchStart);
                        a9.removeEvent(global.document.body, 'touchend', touchEnd);
                    } else{
                        a9.removeEvent(checkbox, 'mousedown', mouseDown);
                        a9.removeEvent(checkbox, 'mouseup', mouseUp);
                        a9.removeEvent(global.document, 'mouseup', documentMouseUp);
                    }
                    a9.removeEvent(object, 'focus', focus);
                    a9.removeEvent(object, 'blur', blur);
                    checkBoxWrapper = visualCheckbox = object = expandEvents = hover = checkbox = wrapper = isHover = isCheckedCache = isPressed = isKeyDown = isFocused = isDisabledCache = disabled = checked = press = removePress = hoverIn = keyDown = keyUp = touchStart = touchEnd = mouseDown = mouseUp = documentMouseUp = focus = blur = null;
                    if (typeof onDestruction === 'function'){
                        onDestruction();
                    }
                }
            }
        }
    };
}(this, A9));