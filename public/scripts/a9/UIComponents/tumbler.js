(function(global, a9){
    var simpleInstanceBinding,
        eventOnPointerDown = a9.deviceInfo.eventOnPointerDown,
        eventOnPointerUp = a9.deviceInfo.eventOnPointerUp,
        initCCSClass = 'isInit',
        checkedCSSClass = 'isTumblerChecked',
        focusedCSSClass = 'isTumblerFocused',
        pressedCSSClass = 'isTumblerPressed',
        isInit = false,
        $body,
        bodyHover,
        createTumbler;


    function Tumbler($realTumbler){
        var tumbler = this,
            $carriage,
            $statesLayer,
            $visual,
            $wrapper;

        tumbler.$realTumbler = $realTumbler;
        tumbler.$carriage = $carriage = a9.getParentByClass($realTumbler, 'jsTumblerCarriage');
        tumbler.$statesLayer = $statesLayer = a9.getParentByClass($carriage, 'jsTumblerStatesLayer');
        $visual = a9.getParentByClass($statesLayer, 'jsTumblerVisual');
        tumbler.$wrapper = $wrapper = a9.getParentByClass($visual, 'jsTumblerWrapper') || $visual;

        simpleInstanceBinding.bind($realTumbler, tumbler);
        simpleInstanceBinding.bind($visual, tumbler);

        tumbler._isFocused = false;
        tumbler._isChecked = $realTumbler.checked;
        tumbler._isPointerDown = false;
        tumbler._isHovered = false;
        tumbler._isIgnoreCheckedChange = false;
        tumbler._isPressed = false;

        tumbler._checkBoxExpandEvents = a9.checkboxExpandEvents($realTumbler);
        a9.addCustomEvent($realTumbler, 'checkedChange', checkboxCheckedChange, tumbler);
        a9.addEvent($realTumbler, 'focus', focus);
        a9.addEvent($realTumbler, 'blur', blur);
        a9.addEvent($visual, eventOnPointerDown, pointerDown);
        a9.addEvent($visual, eventOnPointerUp, pointerUp);
        tumbler._hover = a9.hover($visual, hoverIn, hoverOut);

        a9.addCustomEvent(tumbler, 'checkedChange', checkedChange);
        a9.addCustomEvent(createTumbler, 'globalPointerUp', globalPointerUp, tumbler);

        if (tumbler._isChecked){
            a9.addClass($wrapper, checkedCSSClass);
        }
        a9.addClass($wrapper, initCCSClass);
    }

    function hoverIn(){
        var tumbler = simpleInstanceBinding.getByNode(this);
        tumbler._isHovered = true;
        if (tumbler._isPointerDown){
            setPressed(tumbler);
        }
    }

    function hoverOut(){
        var tumbler = simpleInstanceBinding.getByNode(this);
        tumbler._isHovered = false;
        if (tumbler._isPointerDown){
            removePressed(tumbler);
        }
    }


    function pointerDown(e){
        var tumbler = simpleInstanceBinding.getByNode(this);
        if (!tumbler._isFocused){
            tumbler.$realTumbler.focus();
        }
        e.preventDefault();
        tumbler._isPointerDown = true;
        setPressed(tumbler)
    }

    function setPressed(tumbler){
        tumbler._isPressed = true;
        a9.addClass(tumbler.$wrapper, pressedCSSClass);
    }
    function removePressed(tumbler){
        if (tumbler._isPressed){
            tumbler._isPressed = false;
            a9.removeClass(tumbler.$wrapper, pressedCSSClass);
        }
    }

    function pointerUp(){
        var tumbler = simpleInstanceBinding.getByNode(this);
        removePressed(tumbler);
        if (tumbler._isPointerDown && tumbler._isHovered){
            setChecked(tumbler, !tumbler._isChecked, false);
        }
        tumbler._isPointerDown = false;
    }

    function globalPointerUp(){
        var tumbler = this;
        tumbler._isPointerDown = false;
    }

    function focus(){
        var tumbler = simpleInstanceBinding.getByNode(this);
        tumbler._isFocused = true;
        a9.addClass(tumbler.$wrapper, focusedCSSClass);
    }

    function blur(){
        var tumbler = simpleInstanceBinding.getByNode(this);
        tumbler._isFocused = false;
        a9.removeClass(tumbler.$wrapper, focusedCSSClass);
    }

    function setChecked(tumbler, isChecked, isFromInput){
        var _isChecked = tumbler._isChecked;
        if (_isChecked !== isChecked){
            tumbler._isChecked = isChecked;
            if (!isFromInput){
                tumbler._isIgnoreCheckedChange = true;
                tumbler.$realTumbler.checked = isChecked;
            }
            a9.generateCustomEvent(tumbler, 'checkedChange', isChecked)
        }
        return isChecked;
    }

    function checkboxCheckedChange(isChecked){
        var tumbler = this;
        if (tumbler._isIgnoreCheckedChange){
            tumbler._isIgnoreCheckedChange = false;
        } else{
            setChecked(tumbler, isChecked, true);
        }
    }

    function checkedChange(isChecked){
        var tumbler = this;
        if (isChecked){
            a9.addClass(tumbler.$wrapper, checkedCSSClass);
        } else{
            a9.removeClass(tumbler.$wrapper, checkedCSSClass);
        }
    }

    Tumbler.prototype = {
        set: function(isChecked){
            var tumbler = this;
            return setChecked(tumbler, isChecked, false);
        },
        destructor: function(){
//            todo
        }
    };

    function onBodyPointerUp(){
        a9.generateCustomEvent(createTumbler, 'globalPointerUp');
    }
    function onBodyHoverOut(){
        a9.generateCustomEvent(createTumbler, 'globalPointerUp');
    }

    createTumbler = a9.tumbler = function($realTumbler){
        var u,
            tumbler;
        if (!isInit){
            simpleInstanceBinding = a9.simpleInstanceBinding('data-a9-ui-tumbler');
            $body = global.document.body;
            a9.addEvent($body, eventOnPointerUp, onBodyPointerUp);
            bodyHover = a9.hover($body, u, onBodyHoverOut);
            isInit = true;
        }
        tumbler = simpleInstanceBinding.getByNode($realTumbler);
        if (tumbler === null){
            tumbler = new Tumbler($realTumbler);
        }
        return tumbler;
    };

}(this, A9));