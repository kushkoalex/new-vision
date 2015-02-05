A9.ready(function(a9, global){
    var document = global.document,
        $body = document.body,
        focusInEvent = 'focusin',
        focusOutEvent = 'focusout',
        $testInputContainer,
        $testInput,
        focusInspectionsDestructor,
        $activeElement,
        activeElementFakeEvent,
        inputsInInspection = 0,
        isNative = false;

    function testNativeFocusInOutEvents(){
        $testInputContainer = document.createElement('div');
        $testInputContainer.setAttribute('style', 'width:10xp;height:10px;position:relative;overflow:hidden;position:fixed;top:-10px;left:-10px;');
        $body.appendChild($testInputContainer);

        $testInput = document.createElement('input');
        $testInput.type = 'text';
        a9.addEvent($testInput, 'focusin', initNativeFocusInOutEvents);
        $testInputContainer.appendChild($testInput);

        $testInput.focus();

        a9.removeEvent($testInput, 'focusin', initNativeFocusInOutEvents);
        a9.removeElement($testInputContainer);

        if (!isNative){
            initCustomFocusInOutEvents();
        }
    }

    function initNativeFocusInOutEvents(){
        isNative = true;
        a9.addFocusInEvent = function($element, listener){
            a9.addEvent($element, focusInEvent, listener);
        };
        a9.removeFocusInEvent = function($element, listener){
            a9.removeEvent($element, focusInEvent, listener);
        };
        a9.addFocusOutEvent = function($element, listener){
            a9.addEvent($element, focusOutEvent, listener);
        };
        a9.removeFocusOutEvent = function($element, listener){
            a9.removeEvent($element, focusOutEvent, listener);
        };
    }

    function initCustomFocusInOutEvents(){
        a9.addFocusInEvent = function($node, listener){
            addEventForInspection();
            a9.addCustomEvent($node, focusInEvent, listener);
        };
        a9.removeFocusInEvent = function($node, listener){
            removeEventForInspection();
            a9.removeCustomEvent($node, focusInEvent, listener);
        };
        a9.addFocusOutEvent = function($node, listener){
            addEventForInspection();
            a9.addCustomEvent($node, focusOutEvent, listener);
        };
        a9.removeFocusOutEvent = function($node, listener){
            removeEventForInspection();
            a9.removeCustomEvent($node, focusOutEvent, listener);
        };
    }

    function addEventForInspection(){
        if (inputsInInspection === 0){
            $activeElement = document.activeElement;
            activeElementFakeEvent = {target: $activeElement};
            focusInspectionsDestructor = focusInspectionsInit();
        }
        inputsInInspection += 1;
    }

    function removeEventForInspection(){
        inputsInInspection -= 1;
        if (inputsInInspection <= 0){
            inputsInInspection = 0;
            focusInspectionsDestructor();
        }
    }

    function focusInspectionsInit(){
        function check(){
            if ($activeElement !== document.activeElement){
                a9.generateCustomEvent($activeElement, focusOutEvent, activeElementFakeEvent);
                if ($activeElement !== $body){
                    a9.generateCustomEvent($body, focusOutEvent, activeElementFakeEvent);
                }

                $activeElement = document.activeElement;
                activeElementFakeEvent.target = $activeElement;
                a9.generateCustomEvent($activeElement, focusInEvent, activeElementFakeEvent);
                if ($activeElement !== $body){
                    a9.generateCustomEvent($body, focusInEvent, activeElementFakeEvent);
                }
            }
        }
        a9.repeatedInspections.add(check);
        return function(onDestruction){
            activeElementFakeEvent.target = null;
            activeElementFakeEvent = $activeElement = null;
            a9.repeatedInspections.remove(check, function(){
                if (typeof onDestruction === 'function'){
                    onDestruction();
                }
            });
        }
    }

    testNativeFocusInOutEvents();
});