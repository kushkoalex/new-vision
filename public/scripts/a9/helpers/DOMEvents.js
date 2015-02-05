(function(global, a9){
    if ('addEventListener' in global){
        /**
         * Добавить обработчик события
         * @param {HTMLElement} $DOMNode
         * @param {String} eventName Имя События
         * @param {Function} handler Обработчик
         * @param {Boolean} [isNotNeedFix] флаг который говорит, что не нужно специально обробатывать событие для ие
         */
        a9.addEvent = function($DOMNode, eventName, handler, isNotNeedFix){
            $DOMNode.addEventListener(eventName, handler);
        };
        /**
         * Удалить обработчик события
         * @param {HTMLElement} $DOMNode
         * @param {String} eventName Имя События
         * @param {Function} handler Обработчик
         * @param {Boolean} [isNotNeedFix] флаг который говорит, что не нужно специально обробатывать событие для ие
         */
        a9.removeEvent = function($DOMNode, eventName, handler, isNotNeedFix){
            $DOMNode.removeEventListener(eventName, handler);
        };

        var getEventInput = function(eventName){
            switch (eventName){
                case 'mousedown':
                case 'mouseup':
                case 'click':
                case 'mouseover':
                case 'mousemove':
                case 'dbclick':
                    return 'mouse';
                case 'keydown':
                case 'keypress':
                case 'keyup':
                    return 'keyboard';
                default:
                    return 'touch';
            }
        };

        /**
         * Сгенерировать событие
         * @param {HTMLElement} $DOMNode
         * @param {String} eventName Имя События
         * @param {Event} [e] событие
         */
        a9.generateEvent = function($DOMNode, eventName, e){
            var event,
                incomingEvent,
                outgoingEvent,
                document = global.document,
                u;
            if (e){
                incomingEvent = getEventInput(e.type);
                outgoingEvent = getEventInput(eventName);
                if (incomingEvent === outgoingEvent){
                    if (incomingEvent === 'mouse'){
                        event = document.createEvent('MouseEvent');
                        event.initMouseEvent(eventName, true, true, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                    } else if (incomingEvent === 'keyboard'){
                        if (a9.$d.isFx){
                            event = document.createEvent('KeyEvents');
                            event.initKeyEvent(eventName, true, true, e.view, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.keyCode, e.charCode);
                        } else{
                            event = document.createEvent('Events');
                            event.initEvent(eventName, true, true);
                            event.view = e.view;
                            event.ctrlKey = e.ctrlKey;
                            event.altKey = e.altKey;
                            event.shiftKey = e.shiftKey;
                            event.metaKey = e.metaKey;
                            event.keyCode = e.keyCode;
                            event.charCode = e.charCode;
                        }
                    }
                } else if (outgoingEvent === 'mouse'){
                    event = document.createEvent('MouseEvent');
                    event.initMouseEvent(eventName, true, true, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                } else if (outgoingEvent === 'keyboard'){
                    if (a9.$d.isFx){
                        event = document.createEvent('KeyEvents');
                        event.initKeyEvent(eventName, true, true, e.view, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.keyCode, e.charCode);
                    } else{
                        event = document.createEvent('Events');
                        event.initEvent(eventName, true, true);
                        event.view = e.view;
                        event.ctrlKey = e.ctrlKey;
                        event.altKey = e.altKey;
                        event.shiftKey = e.shiftKey;
                        event.metaKey = e.metaKey;
                        event.keyCode = e.keyCode;
                        event.charCode = e.charCode;
                    }
                }
            }
            if (event === u){
                event = document.createEvent('Events');
                event.initEvent(eventName, true, true);
            }
            $DOMNode.dispatchEvent(event);
        };


    } else{
        var ieFixEventsNameObjectsCallbacks = [],
            ieFixEventsObjectsAndCallbacksLength = 0,
            ieFixEventsHandlers = {},
            fixEvent = function(e){
                e.preventDefault = function(){
                    e.returnValue = false;
                };
                e.stopPropagation = function(){
                    e.cancelBubble = true;
                };
                e.target= e.srcElement;
                return e;
            },
            intCache,
            ieAddFixEvent = function(object, eventName, callback){
                function fix(){
                    callback.call(object, fixEvent(global.event));
                }
                intCache = ieFixEventsObjectsAndCallbacksLength;
                ieFixEventsNameObjectsCallbacks[ieFixEventsObjectsAndCallbacksLength] = eventName;
                ieFixEventsObjectsAndCallbacksLength += 1;
                intCache += ieFixEventsObjectsAndCallbacksLength;
                ieFixEventsNameObjectsCallbacks[ieFixEventsObjectsAndCallbacksLength] = callback;
                ieFixEventsObjectsAndCallbacksLength += 1;
                intCache += ieFixEventsObjectsAndCallbacksLength;
                ieFixEventsNameObjectsCallbacks[ieFixEventsObjectsAndCallbacksLength] = object;
                ieFixEventsObjectsAndCallbacksLength += 1;
                ieFixEventsHandlers[intCache] = fix;
                object.attachEvent('on' + eventName, fix);
            },
            ieRemoveFixEvent = function(object, eventName, callback){
                for (var i = ieFixEventsObjectsAndCallbacksLength; i-- ;){
                    if ((ieFixEventsNameObjectsCallbacks[i] === object)
                        && (ieFixEventsNameObjectsCallbacks[i - 1] === callback)
                        && (ieFixEventsNameObjectsCallbacks[i - 2] === eventName)){
                        ieFixEventsNameObjectsCallbacks[i]
                            = ieFixEventsNameObjectsCallbacks[i - 1]
                            = ieFixEventsNameObjectsCallbacks[i - 2] = u;
                        i = i * 3 - 3;
                        break;
                    }
                    i -= 2;
                }
                if (i !== -1){
                    object.detachEvent('on' + eventName, ieFixEventsHandlers[i]);
                    ieFixEventsHandlers[i] = u;
                }
            },
            u;
        /**
         * Добавить обработчик события
         * @param {HTMLElement} $DOMNode
         * @param {String} eventName Имя События
         * @param {Function} handler Обработчик
         * @param {Boolean} [isNotNeedFix] флаг который говорит, что не нужно специально обробатывать событие для ие
         */
        a9.addEvent = function($DOMNode, eventName, handler, isNotNeedFix){
            if (isNotNeedFix === true){
                $DOMNode.attachEvent('on' + eventName, handler);
            } else{
                ieAddFixEvent($DOMNode, eventName, handler);
            }
        };
        /**
         * Удалить обработчик события
         * @param {HTMLElement} $DOMNode
         * @param {String} eventName Имя События
         * @param {Function} handler Обработчик
         * @param {Boolean} [isNotNeedFix] флаг который говорит, что не нужно специально обробатывать событие для ие
         */
        a9.removeEvent = function($DOMNode, eventName, handler, isNotNeedFix){
            if (isNotNeedFix === true){
                $DOMNode.detachEvent('on' + eventName, handler);
            } else{
                ieRemoveFixEvent($DOMNode, eventName, handler);
            }
        };
        /**
         * Сгенерировать событие
         * @param {HTMLElement} $DOMNode
         * @param {String} eventName Имя События
         * @param {Event} [e] событие
         */
        a9.generateEvent = function($DOMNode, eventName, e){
            $DOMNode.fireEvent('on' + eventName, document.createEventObject());
        };
    }

    /**
     * Прокинуть событе другому узлу dom
     * @param {HTMLElement} $DOMNodeFrom
     * @param {String} eventName
     * @param {HTMLElement} [$DOMNodeTo]
     *
     * todo replace closure
     */
    a9.proxyEvent = function($DOMNodeFrom, eventName, $DOMNodeTo){
        var u;

        if ($DOMNodeTo === u){
            $DOMNodeTo = global.document.body;
        }

        a9.addEvent($DOMNodeFrom, eventName, function(e){
            e.stopPropagation();
            a9.generateEvent($DOMNodeTo, eventName, e);
        });

    };


}(this, A9));