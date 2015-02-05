(function(global, a9){
    var buttons = [],
        hovers = [],
        index = 0,
        prototype,
        deviceInfo = a9.deviceInfo,
        addEvent = a9.addEvent,
        isTouch = deviceInfo.isTouch,
        eventOnPointerEnd = deviceInfo.eventOnPointerEnd,
        document = global.document,
        pressedCSSClass = 'isPressed',
        focusCSSClass = 'isFocused',
        disabledCSSClass = 'isDisabled',
        buttonAttribute = 'data-a9-button-id',
        formHiddenSubmitAttribute = 'data-a9-form-hidden-submit',
        u;

    a9.store.formHiddenSubmitAttribute = formHiddenSubmitAttribute;

    function CustomButton($realButton, action){
        var button = this,
            $visualButton,
            $wrapper,
            instanceIndex;

        $visualButton = a9.getParentByClass($realButton, 'jsVisualButton');
        $wrapper = a9.getParentByClass($visualButton, 'jsButtonWrapper') || $visualButton;

        instanceIndex = index.toString();
        $realButton.setAttribute(buttonAttribute, instanceIndex);
        $visualButton.setAttribute(buttonAttribute, instanceIndex);
        buttons[index] = button;
        button.index = index;


//        todo action for router link
        if (action !== u){
            button.action = action;
        } else if (($realButton.tagName === 'A') && ($realButton.href.length > 0) && !a9.hasAttribute($realButton, 'data-router-link')){
            button.action = actionLink;
        } else if (($realButton.tagName === 'INPUT') && ($realButton.type === 'submit')){
            button.action = trySubmitForm;
        } else{
            button.action = pointerEnd;
        }

        //elements
        button.$b = $realButton;
        button.$v = $visualButton;
        button.$w = $wrapper;

        //states
        button.isPointerPressed = false;
        button.isKeyPressed = false;
        button.isHovered = false;
        button.isFocused = false;
        if (($realButton.disabled === true) || ($realButton.getAttribute('disabled') === 'disabled')){
            button.isDisabled = true;
            a9.addClass($wrapper, disabledCSSClass);
        } else{
            button.isDisabled = false;
        }

        button.keyDownCode = 0;

        hovers[index] = a9.hover($visualButton, hoverIn, hoverOut);

        addEvent($realButton, 'focus', onFocus);
        addEvent($realButton, 'blur', onBlur);

        if (isTouch){
            addEvent($visualButton, 'touchstart', onMouseDown);
            addEvent($visualButton, 'touchend', onMouseUp);
        } else{
            addEvent($visualButton, 'mousedown', onMouseDown);
            addEvent($visualButton, 'mouseup', onMouseUp);
            addEvent($visualButton, 'contextmenu', blockContextMenu);
        }
        addEvent($realButton, 'keyup', onKeyUp);
        if (deviceInfo.isFx){
            addEvent($realButton, 'keypress', onFXKeyPress);
        } else if (deviceInfo.isOpera){
            addEvent($realButton, 'keypress', onKeyDown);
        } else{
            addEvent($realButton, 'keydown', onKeyDown);
        }

        index += 1;

    }
    prototype = CustomButton.prototype;

    function pointerEnd(e){
        var button = this;
        a9.generateEvent(button.$b, eventOnPointerEnd, e);
        return button;
    }

    function trySubmitForm(e){
        var button = this,
            $form = a9.getParentBy(button.$b, 'tagName', 'FORM');
        if ($form !== null){
            if ($form.getAttribute(formHiddenSubmitAttribute) !== null){
                a9.generateCustomEvent($form, 'hiddenSubmit', e);
            } else{
                $form.submit();
            }
            return button;
        }
        return pointerEnd.call(button, e);
    }

    function actionLink(){
        var button = this,
            $realButton = button.$b;
        if (($realButton.target !== '')
            || a9.testPressedKey('cmd')
            || (deviceInfo.isWindows && a9.testPressedKey('ctrl'))){
            global.open($realButton.href, '_blank');
        } else{
            document.location.href = $realButton.href;
        }
        return button;
    }

    function blockContextMenu(e){
        e.preventDefault();
    }

    function onFocus(){
        var button = buttons[+this.getAttribute(buttonAttribute)];
        a9.addClass(button.$w, focusCSSClass);
        button.isFocused = true;

    }
    function onBlur(){
        var button = buttons[+this.getAttribute(buttonAttribute)];
        if (deviceInfo.isOldIE && !button.isDisabled && button.isHovered && (button.keyDownCode !== 9)){
            button.$b.focus();
        } else{
            button.keyDownCode = 0;
            a9.removeClass(button.$w, focusCSSClass);
            button.isFocused = false;
        }

    }
    if (isTouch){

    } else{
        addEvent(document, 'mousedown', function(){
            for (var i = buttons.length; i-- ;){
                documentMouseDown(buttons[i]);
            }
        });
        addEvent(document, 'mouseup', function(){
            for (var i = buttons.length; i-- ;){
                documentMouseUp(buttons[i]);
            }
        });
        function onMouseDown(e){
            var button = buttons[+this.getAttribute(buttonAttribute)];
            if (!button.isDisabled){
                e.preventDefault();
                if (!button.isKeyPressed){
                    a9.addClass(button.$w, pressedCSSClass);
                }
                if (!button.isFocused){
                    button.$b.focus();
                }
                button.isPointerPressed = true;
            }
        }
        function onMouseUp(e){
            var button = buttons[+this.getAttribute(buttonAttribute)];
            if (!button.isDisabled){
                if (!button.isFocused){
                    button.$b.focus();
                }
                if (button.isPointerPressed && !button.isKeyPressed){
                    a9.removeClass(button.$w, pressedCSSClass);
                    button.action(e);
                }
                button.isPointerPressed = false;
            }

        }
        function documentMouseUp(button){
            if (button.isPointerPressed){
                button.isPointerPressed = false;
            }
        }
        function documentMouseDown(button){
            if (!button.isPointerPressed){
                button.isPointerPressed = true;
            }
        }
    }

    function onKeyUp(e){
        var button = buttons[+this.getAttribute(buttonAttribute)];
        if (!button.isDisabled && ((e.keyCode === 32) || (e.keyCode === 13))){
            e.preventDefault();
            if (!button.isPointerPressed || (button.isPointerPressed && !button.isHovered)){
                a9.removeClass(button.$w, pressedCSSClass);
                button.action(e);
            }
            button.keyDownCode = 0;
            button.isKeyPressed = false;
        }
    }
    function keyDown(button, e, keyCode){
        button.keyDownCode = keyCode;
        if (!button.isDisabled && ((keyCode === 32) || (keyCode === 13))){
            e.preventDefault();
            if (!button.isPointerPressed){
                a9.addClass(button.$w, pressedCSSClass);
            }
            button.isKeyPressed = true;
        }
    }
    function onKeyDown(e){
        keyDown(buttons[+this.getAttribute(buttonAttribute)], e, e.keyCode);
    }
    function onFXKeyPress(e){
        keyDown(buttons[+this.getAttribute(buttonAttribute)], e, e.which);
    }

    function hoverIn(){
        var button = buttons[+this.getAttribute(buttonAttribute)];
        button.isHovered = true;
        if (button.isPointerPressed && !button.isKeyPressed){
            a9.addClass(button.$w, pressedCSSClass);
        }
    }
    function hoverOut(){
        var button = buttons[+this.getAttribute(buttonAttribute)];
        button.isHovered = false;
        if (button.isPointerPressed && !button.isKeyPressed){
            a9.removeClass(button.$w, pressedCSSClass);
        }
    }

    prototype.setDisabled = function(isDisabled){
        var button = this;
        a9.buttonSetDisabled(button.$b, isDisabled);
        return button;
    };
    prototype.destructor = function(){
//        todo
    };

    a9.button = function($realButton, action){
        if ($realButton.hasAttribute(buttonAttribute)){
            return buttons[+$realButton.getAttribute(buttonAttribute)];
        }
        return new CustomButton($realButton, action);
    };

    a9.buttonSetDisabled = function($button, isDisabled){
        var button = buttons[+$button.getAttribute(buttonAttribute)],
            $wrapper = button.$w;
        button.isDisabled = isDisabled;
        $button.disabled = isDisabled;
        if (isDisabled){
            if (button.isPointerPressed){
                a9.removeClass($wrapper, pressedCSSClass);
                button.isPointerPressed = false;
            }
            if (button.isKeyPressed){
                a9.removeClass($wrapper, pressedCSSClass);
                button.isKeyPressed = false;
            }
            a9.addClass($wrapper, disabledCSSClass);
        } else{
            a9.removeClass($wrapper, disabledCSSClass);
        }

    };

    a9.buttonSetAction = function($button, action){
        var button = buttons[+$button.getAttribute(buttonAttribute)];
        button.action = action;
    };

    a9.getButton = function($node){
        var button = buttons[+$node.getAttribute(buttonAttribute)];
        if (button === u){
            return null;
        } else{
            return button;
        }
    };

}(this, A9));