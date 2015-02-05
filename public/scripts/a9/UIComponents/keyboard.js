//A9 virtual keyboard

/*need binding tmpls in cnCt
* {prefix}keyboard
* {prefix}keyboardLayout
* {prefix}keyboardRow
* {prefix}keyboardDefaultKey
* {prefix}keyboardLinkKey
* {prefix}keyboardModeKey
* {prefix}keyboardEventKey
* */

(function(global, a9){
    var tp,

        a9Store = a9.store,

        deviceInfo = a9.deviceInfo,
        isTouch = deviceInfo.isTouch,
        eventOnPointerDown = deviceInfo.eventOnPointerDown,
        eventOnPointerUp = deviceInfo.eventOnPointerUp,

        keyboardAttribute = 'data-a9-keyboard',
        keyOfKeyboardAttribute = 'data-a9-key-of-keyboard',

        keyboardIndex = 0,
        keyboardCounter = 0,
        keyboards = [],
        keysIndex = 0,
        keys = [],

        layouts = {},

        isHaveKeyboards = false,
        globalHover,
        isGlobalHovered = false,
        isGlobalPressed = false,

        keyPressedCssClass = 'isPressedKeyboardKey',

        keyboardPrototype = Keyboard.prototype,

        defaultKeyPrototype = DefaultKey.prototype,

        modeKeyPrototype = ModeKey.prototype,
        keyboardActiveModeCSSClassPrefix = 'keyboardActiveMode_',

        linkKeyPrototype = LinkKey.prototype,

        eventKeyPrototype = EventKey.prototype,

        isInit;


    function Keyboard(settings){
        var keyboard = this,
            layoutsFromSettings = settings.layouts,
            activeLayout = settings.defaultLayout,

            workingLayout,
            workingRow,

            i,
            iMax,

            j,
            jMax,

            q,
            qMax,

            keysCounter = 0,

            tmplsPrefix = settings.tmplsPrefix || '',

            keyboardLayoutTmplName = tmplsPrefix + 'keyboardLayout',
            keyboardRowTmplName = tmplsPrefix + 'keyboardRow',

            $keyboard,
            $layoutContent,
            $layouts = {},
            $rowContent,

            key,
            keys = [],
            $visualKeys = [],

            keyboardIDStr = '' + keyboardIndex,

            build;

        keyboard._id = keyboardIndex;

        keyboard.keys = keys;
        keyboard.$visualKeys = $visualKeys;

        keyboard.modes = {
            shift: false,
            capsLock: false
        };

        keyboard._isShiftMode = false;
        keyboard._isCapsLoskMode = false;

        keyboard._isPressed = false;
        keyboard._pressedKey = null;

        keyboard.$layouts = $layouts;

        build = tp(tmplsPrefix + 'keyboard');

        keyboard.$r = $keyboard = build.r;
        keyboard.$close = build.close;
        keyboard.$layoutContainer = build.layoutContainer;

        $keyboard.setAttribute(keyboardAttribute, keyboardIDStr);
        a9.addEvent($keyboard, eventOnPointerDown, onKeyboardPressedDown);
        if (isTouch){
            a9.addEvent($keyboard, eventOnPointerUp, onKeyboardTouchUp);
        }

        for (i = 0, iMax = layoutsFromSettings.length; i < iMax; i += 1){
            workingLayout = layouts[layoutsFromSettings[i]];
            build = tp(keyboardLayoutTmplName);
            $layouts[layoutsFromSettings[i]] = build.r;
            $layoutContent = build.layoutContent;

            for (j = 0, jMax = workingLayout.length; j < jMax; j += 1){
                workingRow = workingLayout[j];
                build = tp(keyboardRowTmplName, $layoutContent);
                $rowContent = build.rowContent;

                for (q = 0, qMax = workingRow.length; q < qMax; q += 1){
                    key = createKey(workingRow[q], keyboard, $rowContent, tmplsPrefix);
                    keys[keysCounter] = key;
                    $visualKeys[keysCounter] = key.$visualKey;
                    keysCounter += 1;
                }

            }

        }

        keyboard.defaultLayout = activeLayout;
        keyboard.activeLayout = activeLayout;
        keyboard.$layoutContainer.appendChild($layouts[activeLayout]);

        a9.addCustomEvent(keyboard, 'keyActionFire', modesListenerOfKeyActionFire);

        keyboards[keyboardIndex] = keyboard;

        keyboardCounter += 1;
        keyboardIndex += 1;
    }

    keyboardPrototype.destructor = function(){
        keyboardCounter -= 1;
        checkHelpers();
//        todo
    };

//    keyboard functions
    function onKeyboardPressedDown(e){
        var keyboard = keyboards[+this.getAttribute(keyboardAttribute)];
        e.preventDefault();
        keyboard._isPressed = true;
    }

    function onKeyboardTouchUp(){
        var $visualKey = a9.getParentByClass(a9Store.touchOnElement, 'jsVisualKey', true);
        if ($visualKey !== null){
            keyOnPointerUp.call($visualKey);
        }
    }

    function createKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix){
        if (typeof keyDescriptor === 'string'){
            return new DefaultKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix);
        } else if ('l' in keyDescriptor){
            return new LinkKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix);
        } else if ('m' in keyDescriptor){
            return new ModeKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix);
        } else if ('e' in keyDescriptor){
            return new EventKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix);
        }
        return new DefaultKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix);
    }

    function changeKeyboardLayout(keyboard, layout){
        var $layouts = keyboard.$layouts,
            $layoutContainer = keyboard.$layoutContainer,
            activeLayout,
            i,
            iMax,
            u;

        if (typeof layout === 'string'){
            if (layout in $layouts){
                activeLayout = layout;
            }
        } else{
            for (i = 0, iMax = layout.length; i < iMax; i += 1){
                if (layout[i] in $layouts){
                    activeLayout = layout[i];
                    break;
                }
            }
        }

        if (activeLayout === u){
            activeLayout = keyboard.defaultLayout;
        }

        $layoutContainer.removeChild($layouts[keyboard.activeLayout]);
        $layoutContainer.appendChild($layouts[activeLayout]);
        keyboard.activeLayout = activeLayout;
        a9.generateCustomEvent(keyboard, 'layoutChange', activeLayout);

    }


//    keys basis
    function constructKeyBasis(key, keyDescriptor, keyboard){
        key._id = keysIndex;
        keys[keysIndex] = key;
        keysIndex += 1;

        key.descriptor = keyDescriptor;
        key.keyboard = keyboard;

        key._isPressed = false;
    }

    function destructKeyBasis(key, keyDescriptor, keyboard){
        key._id = keysIndex;
        keys[keysIndex] = key;
        keysIndex += 1;

        key.descriptor = keyDescriptor;
        key.keyboard = keyboard;

        key._isPressed = false;
    }


//    keys default behavior functions
    function keyHoverIn(){
        var key = keys[+this.getAttribute(keyOfKeyboardAttribute)];
        if (key.keyboard._isPressed){
            key._addPress();
        }
    }

    function keyHoverOut(){
        keys[+this.getAttribute(keyOfKeyboardAttribute)]._removePress();
    }

    function keyOnPointerUp(){
        var key = keys[+this.getAttribute(keyOfKeyboardAttribute)];
        key._removePress();
        if (key.keyboard._isPressed){
            key.action();
        }
    }

    function keyOnPointerDown(){
        keys[+this.getAttribute(keyOfKeyboardAttribute)]._addPress();
    }

    function addKeyPressedState(){
        var key = this;
        if (!key._isPressed){
            a9.addClass(key.$keyWrapper, keyPressedCssClass);
            key.keyboard._pressedKey = key;
            key._isPressed = true;
        }
        return key;
    }

    function removeKeyPressedState(){
        var key = this;
        if (key._isPressed){
            a9.removeClass(key.$keyWrapper, keyPressedCssClass);
            if (key.keyboard._pressedKey === key){
                key.keyboard._pressedKey = null;
            }
            key._isPressed = false;
        }
        return key;
    }

//    keys default behavior logic
    function addDefaultKeyBehavior(key, build){
        var $visualKey = build.visualKey;
        key.$visualKey = $visualKey;
        key.$keyWrapper = build.keyWprapper || $visualKey;

        $visualKey.setAttribute(keyOfKeyboardAttribute, '' + key._id);

        if (!isTouch){
            a9.addEvent($visualKey, eventOnPointerUp, keyOnPointerUp);
        }

        a9.addEvent($visualKey, eventOnPointerDown, keyOnPointerDown);
        key._hover = a9.hover($visualKey, keyHoverIn, keyHoverOut);

        key._addPress = addKeyPressedState;
        key._removePress = removeKeyPressedState;
    }

    function removeDefaultKeyBehavior(key){
//        todo
    }


//    todo default multi key
//    default key
    function DefaultKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix){
        var defaultKey = this;
        defaultKey.type = 'default';

        constructKeyBasis(defaultKey, keyDescriptor, keyboard);

        addDefaultKeyBehavior(defaultKey, tp(tmplsPrefix + 'keyboardDefaultKey', keyDescriptor, $rowContent));

        if (typeof keyDescriptor === 'string'){
            defaultKey.value = keyDescriptor.charAt(0);
        } else{
            defaultKey.value = keyDescriptor.v;
        }

        defaultKey.lastValue = null;

    }

    defaultKeyPrototype.action = function(){
        var defaultKey = this,
            keyboard = defaultKey.keyboard,
            keyboardModes = keyboard.modes,
            value;
        if (keyboardModes.shift){
            if (!keyboardModes.capsLock){
                value = defaultKey.value.toUpperCase();
            } else{
                value = defaultKey.value;
            }
        } else if (keyboardModes.capsLock){
            value = defaultKey.value.toUpperCase();
        } else{
            value = defaultKey.value;
        }
        defaultKey.lastValue = value;
        a9.generateCustomEvent(keyboard, 'input', value);
        a9.generateCustomEvent(keyboard, 'keyActionFire', defaultKey);
        return defaultKey;
    };

    defaultKeyPrototype.destructor = function(){
//        todo
    };

//    keyboard modes interaction logic ()
    function modesListenerOfKeyActionFire(key){
        var keyboard = this,
            keyboardModes = keyboard.modes;

        if (keyboardModes.shift && (key.descriptor.m !== 'shift')){
            modeOff(keyboard, 'shift');
        }

        if (keyboardModes.capsLock && (key.type === 'link')){
            modeOff(keyboard, 'capsLock');
        }
    }


//    mode key
    function ModeKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix){
        var modeKey = this;
        modeKey.type = 'mode';

        constructKeyBasis(modeKey, keyDescriptor, keyboard);

        addDefaultKeyBehavior(modeKey, tp(tmplsPrefix + 'keyboardModeKey', keyDescriptor, $rowContent));

        if (!(keyDescriptor.m in keyboard.modes)){
            keyboard.modes[keyDescriptor.m] = false;
        }

    }

    function modeOn(keyboard, modeName){
        var keyboardModes = keyboard.modes;
        if (keyboardModes[modeName] === false){
            keyboardModes[modeName] = true;
            a9.addClass(keyboard.$r, keyboardActiveModeCSSClassPrefix + modeName);
            a9.generateCustomEvent(keyboard, 'mode:on', modeName);
        }
    }
    function modeOff(keyboard, modeName){
        var keyboardModes = keyboard.modes;
        if (keyboardModes[modeName] === true){
            keyboardModes[modeName] = false;
            a9.removeClass(keyboard.$r, keyboardActiveModeCSSClassPrefix + modeName);
            a9.generateCustomEvent(keyboard, 'mode:off', modeName);
        }
    }

    modeKeyPrototype.action = function(){
        var modeKey = this,
            modeModeName = modeKey.descriptor.m,
            keyboard = modeKey.keyboard,
            keyboardModes = keyboard.modes;

        if (keyboardModes[modeModeName]){
            modeOff(keyboard, modeModeName);
        } else{
            modeOn(keyboard, modeModeName);
        }

        a9.generateCustomEvent(keyboard, 'keyActionFire', modeKey);

        return modeKey;
    };

    modeKeyPrototype.destructor = function(){
//        todo
    };


//    linkKey
    function LinkKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix){
        var linkKey = this;
        linkKey.type = 'link';

        constructKeyBasis(linkKey, keyDescriptor, keyboard);

        addDefaultKeyBehavior(linkKey, tp(tmplsPrefix + 'keyboardLinkKey', keyDescriptor, $rowContent));

    }

    linkKeyPrototype.action = function(){
        var linkKey = this,
            keyboard = linkKey.keyboard;
        changeKeyboardLayout(keyboard, linkKey.descriptor.l);
        a9.generateCustomEvent(keyboard, 'keyActionFire', linkKey);
        return linkKey;
    };

    linkKeyPrototype.destructor = function(){
//        todo
    };


//    eventKey
    function EventKey(keyDescriptor, keyboard, $rowContent, tmplsPrefix){
        var actionKey = this;

        constructKeyBasis(actionKey, keyDescriptor, keyboard);

        addDefaultKeyBehavior(actionKey, tp(tmplsPrefix + 'keyboardEventKey', keyDescriptor, $rowContent));
    }

    eventKeyPrototype.action = function(){
        var actionKey = this,
            keyboard = actionKey.keyboard,
            actionKeyDescriptor = actionKey.descriptor;
        a9.generateCustomEvent(keyboard, actionKeyDescriptor.e, actionKeyDescriptor.data);
        a9.generateCustomEvent(keyboard, 'keyActionFire', actionKey);
        return actionKey;
    };

    eventKeyPrototype.destructor = function(){
//        todo
    };

    //global part
    function onPointerUpGlobal(){
        var i = keyboards.length;
        isGlobalPressed = false;
        for (; i-- ;){
            if (keyboards[i]._isPressed){
                keyboards[i]._isPressed = false;
                if (keyboards[i]._pressedKey !== null){
                    keyboards[i]._pressedKey._removePress();
                }
            }
        }
    }

    function onPointerDownGlobal(){
        isGlobalHovered = true;
        isGlobalPressed = true;
    }

    function globalHoverIn(){
        isGlobalHovered = true;
    }

    function globalHoverOff(){
        if (isGlobalHovered){
            isGlobalHovered = false;
            if (isGlobalPressed){
                onPointerUpGlobal();
            }
        }
    }

    function globalHoverMove(){
        if (!isGlobalHovered){
            isGlobalHovered = true;
        }
    }

    function startListenPresses(){
        var $documentElement = global.document.documentElement;
        globalHover = a9.hover($documentElement, globalHoverIn, globalHoverOff, globalHoverMove);
        a9.addEvent($documentElement, eventOnPointerDown, onPointerDownGlobal, true);
        a9.addEvent($documentElement, eventOnPointerUp, onPointerUpGlobal, true);
        a9.active.blur.push(globalHoverOff);
    }

    function stopListenPresses(){
        var $documentElement = global.document.documentElement;
        globalHover.destructor();
        a9.removeEvent($documentElement, eventOnPointerDown, onPointerDownGlobal, true);
        a9.removeEvent($documentElement, eventOnPointerUp, onPointerUpGlobal, true);
        a9.deleteElementsInArray(a9.active.blur, globalHoverOff);
    }

    function checkHelpers(){
        if (keyboardCounter === 0){
            stopListenPresses();
            isHaveKeyboards = false;
        }
    }

    //result
    a9.keyboard = {
        make: function(settings){
            if (!isInit){
                tp = global.cnCt.tp;
                isInit = true;
            }
            if (!isHaveKeyboards){
                startListenPresses();
                isHaveKeyboards = true;
            }
            return new Keyboard(settings);
        },

        layouts: layouts
    };


}(this, A9));