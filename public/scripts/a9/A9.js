(function(global){
    var document = global.document,
        _array = global.Array,
        _object = global.Object,
        a9 = {},
        u;

    a9.version = '0.5.0';

//    a9 global store
    a9.store = {
        isReady: false,
        touchX: 0,
        touchY: 0,
        touchOnElement: null
    };

//    arrays
    if (_array.isArray !== u){
        /**
         * Проверяет является ли переданный параметр массивом
         * @param {*} verifiable
         * @return {Boolean} массив / не массив
         */
        a9.isArray = function(verifiable){
            return _array.isArray(verifiable);
        };
    } else{
        /**
         * Проверяет является ли переданный параметр массивом
         * @param {*} verifiable
         * @return {Boolean} массив / не массив
         */
        a9.isArray = function(verifiable){
            return _object.prototype.toString.call(verifiable) === '[object Array]';
        };
    }


    function arrayIndexOfFC(array, value){
        for (var i = 0, iMax = array.length; i < iMax; i += 1){
            if (array[i] === value){
                return i;
            }
        }
        return -1;
    }

    function arrayLastIndexOfFC(array, value){
        var i = array.length;
        for (; i--;){
            if (array[i] === value){
                return i;
            }
        }
        return -1;
    }

    /**
     * поиск индэкса значения в массиве, с помощью js (использовать для HTMLCollection)
     * @param {Array} array проверяемый массив
     * @param {*} value
     * @return {Number} возвращает номер индэкса элемента или -1, если элемент не найден
     */
    a9.arrayIndexOfFC = arrayIndexOfFC;

    /**
     * поиск индэкса значения в массиве с конца, с помощью js (использовать для HTMLCollection)
     * @param {Array} array проверяемый массив
     * @param {*} value
     * @return {Number} возвращает номер индэкса элемента или -1, если элемент не найден
     */
    a9.arrayLastIndexOfFC = arrayLastIndexOfFC;

    /**
     * Поиск индэкса значения в массиве
     * @param {Array} array проверяемый массив
     * @param {*} value
     * @return {Number} возвращает номер индэкса элемента или -1, если элемент не найден
     */
    a9.arrayIndexOf = _array.indexOf !== u ?
        function(array, value){
            return array.indexOf(value);
        }
        : arrayIndexOfFC;

    /**
     * Поиск индэкса значения в массиве с конца
     * @param {Array} array проверяемый массив
     * @param {*} value
     * @return {Number} возвращает номер индэкса элемента или -1, если элемент не найден
     */
    a9.arrayLastIndexOf = _array.lastIndexOf !== u ?
        function(array, value){
            return array.lastIndexOf(value);
        }
        : arrayLastIndexOfFC;


    /**
     * Удаляет заданный элемент(ы) переданного массива, !не делая копии массива!
     * Использовать в местах критичных к памяти
     * @param {Array} array массив с которым нужно работать
     * @param {*} element элементы которые нужно удалить
     * @return {Array} array переданный массив
     */
    a9.deleteElementsInArray = function(array, element){
        var i = 0,
            iMax = array.length,
            iReal = 0,
            isHasElement = false;
        for (; i < iMax; i += 1){
            if (!isHasElement && (array[i] === element)){
                isHasElement = true;
                iReal = i;
            }
            if (isHasElement && (array[i] !== element)){
                array[iReal] = array[i];
                iReal += 1;
            }
        }
        array.length = iReal;
        return array;
    };

    /**
     * Вырезает заданное количество элементов массива с указаного индэкса, !не делая копии массива!
     * Использовать в местах критичных к памяти
     * @param {Array} array массив с которым нужно работать
     * @param {Number} from индэкс начала вырезки
     * @param {Number} [size] = 1 количество вырезаемых элементов
     * @return {Array} array переданный массив
     */
    a9.arraySlice = function(array, from, size){
        size = size || 1;
        for (var start = from + size, i = from, iMax = array.length; i < iMax; start += 1, i += 1){
            array[i] = array[start];
        }
        array.length = from + size > iMax ? from : iMax - size;
        return array;
    };

    /**
     * Копирует часть массива с заданного идэкса до заданного идэкса
     * @param {Array} array
     * @param {Array} [arrayForCopy]
     * @param {Number} [from]
     * @param {Number} [to]
     * @return {Array} array
     */
    a9.copyArray = function(array, arrayForCopy, from, to){
        var i = from || 0,
            iMax = array.length,
            j,
            u;
        if ((to === u) || (to > iMax)){
            to = iMax;
        }
        if (arrayForCopy !== u){
            arrayForCopy.length = 0;
        } else{
            if (a9.isArray(array)){
                return array.slice(i, to - i);
            }
            arrayForCopy = [];
        }
        for (i, j = 0; i < to; j+= 1, i += 1){
            arrayForCopy[j] = array[i];
        }
        return arrayForCopy;
    };


//    objects
    /**
     * Проверяет является ли переданный параметр объектом
     * @param {*} verifiable
     * @return {Boolean} объект / не объект
     */
    a9.isObject = function(verifiable){
        var u;
        return (verifiable !== u)
            && (verifiable !== null)
            && (_object.prototype.toString.call(verifiable) === '[object Object]');
    };

    /**
     * Возвращает количество свойств объекта
     * @param {Object} object
     * @return {Number}
     */
    a9.objectLength = function(object){
        var p,
            i = 0;
        for (p in object){
            i += 1;
        }
        return i;
    };

    /**
     *
     * @param {Object} object
     * @returns {boolean}
     */
    a9.isEmptyObject = function(object){
        return a9.objectLength(object) === 0;
    };

    if (_object.create !== u){
        /**
         * copy object
         * @param {Object} object — object for copy
         * @returns {Object}
         */
        a9.copyObject = function(object){
            return _object.create(object);
        };
    } else{
        /**
         * copy object
         * @param {Object} object — object for copy
         * @returns {Object}
         */
        a9.copyObject = function(object){
            var p,
                newObject = {};
            for (p in object){
                newObject[p] = object[p];
            }
            return newObject;
        };
    }

//    object+array mixed dependencies

//    clone

    /**
     * Клонирование массива любой глубины
     * @param {Array} array массив для клонирования
     * @param {Array} [toArray] массив в который будет производится клонирование
     * @returns {Array}
     */
    a9.cloneArray = function(array, toArray){
        var i = 0,
            iMax = array.length,
            newArray = toArray || [],
            value;

        for (; i < iMax; i += 1){
            value = array[i];
            if (a9.isObject(value)){
                value = a9.cloneObject(value);
            } else if (a9.isArray(value)){
                value = a9.cloneArray(value);
            }
            newArray[i] = value;
        }

        newArray.length = iMax;

        return newArray;
    };

    /**
     * Клонирование объекта любой глубины
     * @param {Object} object объект для клонирования
     * @param {Object} [toObject] объект в который будет производится клонирование
     * @returns {Object}
     */
    a9.cloneObject = function(object, toObject){
        var p,
            newObject = toObject || {},
            value;

        for (p in object){
            value = object[p];
            if (a9.isObject(value)){
                value = a9.cloneObject(value);
            } else if (a9.isArray(value)){
                value = a9.cloneArray(value);
            }
            newObject[p] = value;
        }

        return newObject;
    };

    global.A9 = a9;

}(this));


//A9.deviceInfo check device
(function(global, a9){
    var document = global.document,
        html = document.documentElement,
        testElemStyle = document.createElement('div').style,
        jsStylePrefixes = ['webkit', 'Moz', 'O', 'MS'],
        cssStylePrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'],
        prefixIndex,
        htmlClass = '',
        requestAF,
        cancelAF,
        browser = navigator.userAgent,
        os = navigator.platform,
        upperProperty,
        i,
        browserVersion,
        iPadVersionTestFunction,
        u,
//            all properties identified for correct boolean if
        deviceInfo = {
            browser: browser,
            os: os,
            isMac: false,
            isIPad: false,
            iPadVersion: u,
            onIPadVersion: u,
            isIPhone: false,
            isWindows: false,
            isAndroid: false,
            isOldAndroid: false,
            isRetina: false,
            isTouch: false,
            isFx: false,
            isWebKit: false,
            isChrome: false,
            isSafari: false,
            isOpera: false,
            isIE: false,
            isOldIE: false,
            isUnbelievableOldIE: false,
            browserVersion: u,
            isOld: false,
            isUndefined: false,
            isSVG: false,
            isTransforms: false,
            sTransform: u,
            cssTransform: u,
            isTransitions: false,
            sTransition: u,
            cssTransition: u,
            eTransitionEnd: u,
            sTDelay: u,
            sTDuration: u,
            sTProperty: u,
            sTTimingFunction: u,
            isAnimation: false,
            sAnimation: u,
            cssAnimation: u,
            cssKeyFrame: u,
            isPerspective: false,
            sPerspective: u,
            cssPerspective: u,
            sPerspectiveOrigin: u,
            cssPerspectiveOrigin: u,
            isBorderRadius: false,
            sBorderRadius: u,
            cssBorderRadius: u,
            isBoxShadow: false,
            sBoxShadow: u,
            cssBoxShadow: u,
            isCSSGradient: false,
            cssLinearGradient: u,
            cssRadialGradient: u,
            isCSSModernBrowser: false,
            requestAF: u,
            cancelAF: u,
            cssPrefix: u,
            sPrefix: u,
            eventOnPointerStart: u,
            eventOnPointerEnd: u
        };

    function testProperty(property, cssProperty){
        upperProperty = property.charAt(0).toUpperCase() + property.substr(1);
        if (testElemStyle[property] !== u){
            deviceInfo['s' + upperProperty] = property;
            deviceInfo['css' + upperProperty] = cssProperty || property;
            if (property === 'transition'){
                deviceInfo.eTransitionEnd = 'transitionend';
                deviceInfo.sTDelay = 'transitionDelay';
                deviceInfo.sTDuration = 'transitionDuration';
                deviceInfo.sTProperty = 'transitionProperty';
                deviceInfo.sTTimingFunction = 'transitionTimingFunction';
            } else if (property === 'animation'){
                deviceInfo.cssKeyFrame = '@keyframes';
            } else if (property === 'perspective'){
                deviceInfo.sPerspectiveOrigin = 'perspectiveOrigin';
                deviceInfo.cssPerspectiveOrigin = 'perspective-origin';
            }
            return true;
        }
        if (testElemStyle[jsStylePrefixes[prefixIndex] + upperProperty] !== u){
            deviceInfo['s' + upperProperty] = jsStylePrefixes[prefixIndex] + upperProperty;
            deviceInfo['css' + upperProperty] = cssStylePrefixes[prefixIndex] + (cssProperty || property);
            if (property === 'transition'){
                deviceInfo.eTransitionEnd = deviceInfo.isFx ? 'transitionend' : jsStylePrefixes[prefixIndex] + 'TransitionEnd';
                deviceInfo.sTDelay = jsStylePrefixes[prefixIndex] + 'TransitionDelay';
                deviceInfo.sTDuration = jsStylePrefixes[prefixIndex] + 'TransitionDuration';
                deviceInfo.sTProperty = jsStylePrefixes[prefixIndex] + 'TransitionProperty';
                deviceInfo.sTTimingFunction = jsStylePrefixes[prefixIndex] + 'TransitionTimingFunction';
            } else if (property === 'animation'){
                deviceInfo.cssKeyFrame = '@' + cssStylePrefixes[prefixIndex] + 'keyframes';
            } else if (property === 'perspective'){
                deviceInfo.sPerspectiveOrigin = jsStylePrefixes[prefixIndex] + 'PerspectiveOrigin';
                deviceInfo.cssPerspectiveOrigin = cssStylePrefixes[prefixIndex] + 'perspective-origin';
            }
            return true;
        }
        return false;
    }

    function addGradientSupport(prefix){
        deviceInfo.isCSSGradient = true;
        deviceInfo.cssLinearGradient = prefix + 'linear-gradient';
        deviceInfo.cssRadialGradient = prefix + 'radial-gradient';
        htmlClass += ' isCSSGradientFriendly';
    }

    deviceInfo.browser = browser;
    deviceInfo.os = os;

    if ((global.devicePixelRatio !== u) && (global.devicePixelRatio > 1)) {
        deviceInfo.isRetina = true;
        htmlClass += ' isRetina';
    } else{
        htmlClass += ' isNotRetina';
    }

    if (os.indexOf('Win') !== -1){
        deviceInfo.isWindows = true;
        htmlClass += ' Windows';
    } else if (os.indexOf('Mac') !== -1){
        deviceInfo.isMac = true;
        htmlClass += ' Mac';
    } else if ((os.indexOf('iPhone') !== -1) || (os.indexOf('iPod') !== -1)){
        deviceInfo.isIPhone = true;
        htmlClass += ' iPhone';
    } else if (browser.indexOf('Android') !== -1){
        deviceInfo.isAndroid = true;
        htmlClass += ' Android';
        if (document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Shape', '1.0')){
            htmlClass += ' isNewAndroid';
        } else{
            deviceInfo.isOldAndroid = true;
            htmlClass += ' isOldAndroid';
        }
    } else if (os.indexOf('iPad') !== -1){
        deviceInfo.isIPad = true;
        htmlClass += ' iPad';
        if (deviceInfo.isRetina){
            deviceInfo.iPadVersion = 3;
        } else{
            iPadVersionTestFunction = function(e){
                deviceInfo.iPadVersion = e.acceleration !== null ? 2 : 1;
                if (deviceInfo.onIPadVersion !== u){
                    deviceInfo.onIPadVersion();
                }
                global.removeEventListener('devicemotion', iPadVersionTestFunction);
                iPadVersionTestFunction = null;
            };
            global.addEventListener('devicemotion', iPadVersionTestFunction);
        }
    }

    deviceInfo.isTouch = deviceInfo.isIPad || deviceInfo.isIPhone || deviceInfo.isAndroid;

    if (deviceInfo.isTouch){
        htmlClass += ' isTouch';
        deviceInfo.eventOnPointerDown = 'touchstart';
        deviceInfo.eventOnPointerUp = 'touchend';
        deviceInfo.eventOnPointerEnd = 'touchend';
    } else{
        htmlClass += ' isNotTouch';
        deviceInfo.eventOnPointerDown = 'mousedown';
        deviceInfo.eventOnPointerUp = 'mouseup';
        deviceInfo.eventOnPointerEnd = 'click';
    }

    if (browser.indexOf('Chrome') !== -1){
        prefixIndex = 0;
        deviceInfo.browserVersion = browserVersion = parseFloat(browser.substr(browser.indexOf('Chrome/') + 7, 4));
        deviceInfo.isChrome = deviceInfo.isWebKit = true;
        htmlClass += ' isChrome isWebKit isNoIE Chrome_' + browserVersion;
        if (browserVersion < 4){
            htmlClass += ' OldCh';
            deviceInfo.isOld = true;
        }
    } else if (browser.indexOf('Firefox') !== -1){
        prefixIndex = 1;
        deviceInfo.browserVersion = browserVersion = parseFloat(browser.substr(browser.lastIndexOf('/') + 1, 4));
        deviceInfo.isFx = true;
        htmlClass += ' isFX isNoIE FX_' + browserVersion;
        if (browserVersion < 3.5){
            deviceInfo.isOld = true;
            htmlClass += ' OldFX';
        }
    } else if ((browser.indexOf('Safari') !== -1) || ((deviceInfo.isIPad || deviceInfo.isIPhone) && (browser.indexOf('AppleWebKit') !== -1))){
        prefixIndex = 0;
        deviceInfo.browserVersion = browserVersion = parseFloat(browser.substr(browser.indexOf('Version/') + 8, 4));
        deviceInfo.isSafari = deviceInfo.isWebKit = true;
        htmlClass += ' isSafari isWebKit isNoIE Safari_' + browserVersion;
        if (browserVersion < 4){
            htmlClass += ' OldSF';
            deviceInfo.isOld = true;
        }
    } else if (browser.indexOf('MSIE') !== -1){
        prefixIndex = 3;
        if (document.documentMode !== u){
            browserVersion = document.documentMode;
        } else if (document.compatMode === 'CSS1Compat'){
            browserVersion = parseFloat(browser.substr(browser.indexOf('MSIE') + 5, 3));
        } else{
            browserVersion = 5;
        }
        deviceInfo.browserVersion = browserVersion;
        deviceInfo.isIE = true;
        htmlClass += ' isIE IE_' + browserVersion;
        if (browserVersion < 9){
            deviceInfo.isOldIE = true;
            htmlClass += ' isOldIE';
            if (browserVersion < 8){
                deviceInfo.isUbelivableOldIE = true;
            }
        } else{
            htmlClass += ' isNewIE';
        }
    } else if ((browser.indexOf('Trident') !== -1)){
        prefixIndex = 3;
        deviceInfo.browserVersion = browserVersion = +(browser.substr(browser.indexOf('rv:') + 3).replace(/[^0-9|\.]|^0+/g, ''));
        deviceInfo.isIE = true;
    } else if (browser.indexOf('Opera') !== -1){
        prefixIndex = 2;
        deviceInfo.browserVersion = browserVersion = parseFloat(browser.substr(browser.indexOf('Version/') + 8, 4));
        deviceInfo.isOpera = true;
        htmlClass += ' isOpera isNoIE O_' + browserVersion;
        if (browserVersion < 11){
            htmlClass += ' OldO';
            deviceInfo.isOld = true;
        }
    } else{
        prefixIndex = 100;
        htmlClass += ' UndefinedBrowser';
        deviceInfo.isUndefined = true;
    }

    if (!deviceInfo.isWebKit){
        htmlClass += ' isNotWebKit';
    }

    if (deviceInfo.isUndefined){
        htmlClass += ' isBoxShadowUnfriendly isRBSUnfriendly isCSSGradientUnfriendly isCSSNotModernBrowser';
        deviceInfo.requestAF = function(frameFunction){
            return setTimeout(frameFunction, 16);
        };
        deviceInfo.cancelAF = function(id){
            clearTimeout(id);
        };
    } else{
        deviceInfo.cssPrefix = cssStylePrefixes[prefixIndex] || '';
        deviceInfo.sPrefix = jsStylePrefixes[prefixIndex] || '';
        if (!(deviceInfo.isOldAndroid || deviceInfo.isOldIE)) {
            deviceInfo.isSVG = true;
            htmlClass += ' isSVG';
        }

        if (testProperty('transition')){
            deviceInfo.isTransitions = true;
            htmlClass += ' isTransitionsFriendly';
        } else{
            htmlClass += ' isTransitionsUnfriendly';
        }

        if (testProperty('transform')){
            deviceInfo.isTransforms = true;
            htmlClass += ' isTransformsFriendly';
        } else{
            htmlClass += ' isTransformsUnfriendly';
        }

        if (deviceInfo.isTransitions && deviceInfo.isTransforms){
            htmlClass += ' isTransformsTransitionsFriendly';
        } else{
            htmlClass += ' isTransformsTransitionsUnfriendly';
        }

        if (testProperty('borderRadius', 'border-radius')){
            deviceInfo.isBorderRadius = true;
            htmlClass += ' isBoxShadowFriendly';
        } else{
            htmlClass += ' isBoxShadowUnfriendly';
        }

        if (testProperty('boxShadow', 'box-shadow')){
            deviceInfo.isBoxShadow = true;
            htmlClass += ' isRBSFriendly';
        } else{
            htmlClass += ' isRBSUnfriendly';
        }

        if (testProperty('animation')){
            deviceInfo.isAnimation = true;
            htmlClass += ' isAnimationFriendly';
        } else{
            htmlClass += ' isAnimationUnfriendly';
        }

        if (testProperty('perspective')){
            deviceInfo.isPerspective = true;
            htmlClass += ' isPerspectiveFriendly';
        } else{
            htmlClass += ' isPerspectiveUnfriendly';
        }

        if (testProperty('webkitTextSecurity')){
            deviceInfo.isWebkitTextSecurity = true;
            htmlClass += ' isWebkitTextSecurityFriendly';
        } else{
            htmlClass += ' isWebkitTextSecurityUnfriendly';
        }

        if (((deviceInfo.isIPad || deviceInfo.isIPhone) && (browser.indexOf('Safari') !== -1)) || (deviceInfo.isAndroid && (browser.indexOf('Safari') !== -1)) || (deviceInfo.isChrome && (browserVersion >= 16)) || (deviceInfo.isSafari && (browserVersion >= 5))){
            addGradientSupport('-webkit-');
        } else if (deviceInfo.isFx && (browserVersion >= 3.6)){
            addGradientSupport('-moz-');
        } else if (deviceInfo.isOpera && (browserVersion >= 11.6)){
            addGradientSupport('-o-');
        } else if (deviceInfo.isIE && (browserVersion >= 10)){
            addGradientSupport('-ms-');
        } else{
            htmlClass += ' isCSSGradientUnfriendly';
            deviceInfo.isCSSGradient = false;
        }
//        attention! reusing var Property!
        upperProperty = jsStylePrefixes[prefixIndex].toLowerCase();
        if (global.requestAnimationFrame !== u){
            deviceInfo.requestAF = function(frameFunction){
                return global.requestAnimationFrame(frameFunction);
            };
            deviceInfo.cancelAF = function(id){
                global.cancelAnimationFrame(id);
            }
        } else if (global[upperProperty + 'RequestAnimationFrame'] !== u){
            requestAF = upperProperty + 'RequestAnimationFrame';
            cancelAF = upperProperty + 'CancelAnimationFrame';
            deviceInfo.requestAF = function(frameFunction){
                return global[requestAF](frameFunction);
            };
            deviceInfo.cancelAF = function(id){
                global[cancelAF](id);
            };
        } else{
            deviceInfo.requestAF = function(frameFunction){
                return setTimeout(frameFunction, 16);
            };
            deviceInfo.cancelAF = function(id){
                clearTimeout(id);
            };
        }
//        attention! reusing var Property!
        upperProperty = html.className;
        if (upperProperty.indexOf('noJS') !== -1){
            html.className = upperProperty.replace('noJS', '');
        }
        if (deviceInfo.isCSSGradient && deviceInfo.isBoxShadow && deviceInfo.isBorderRadius){
            deviceInfo.isCSSModernBrowser = true;
            htmlClass += ' isCSSModernBrowser';
        } else{
            htmlClass += ' isCSSNotModernBrowser';
        }
    }
    html.className += htmlClass;
    htmlClass = i = upperProperty = testElemStyle = jsStylePrefixes = cssStylePrefixes = os = browser = browserVersion = testProperty = null;

    a9.deviceInfo = deviceInfo;

}(this, A9));


//A9.ready();
(function(global, a9){
    /**
     * Эмуляция DOMOnLoad и общий инит библиотеки
     * @param {Function} handler обработчики DOMOnLoad
     */
    a9.ready = function(handler){
        var document = global.document,
            tryScroll,
            a9Store = a9.store,
            callbacks = [handler],
            body,
            i = 0,
            iMax = 1,
            html,
            isReady = false;
        handler = null;
        function ready(){
            if (!isReady){
                a9Store.isReady = isReady = true;
                a9.ready = function(handler){
                    handler(a9, global);
                };
                for (; i < iMax; i += 1){
                    callbacks[i](a9, global);
                }
                html = body = tryScroll = callbacks = i = iMax = null;
            }
        }
        if (a9.deviceInfo.isTouch){
            callbacks[1] = callbacks[0];
            callbacks[0] = function(){
                body = document.body;
                function getTouchedElement(){
                    return document.elementFromPoint(a9Store.touchX - global.pageXOffset, a9Store.touchY - global.pageYOffset);
                }
                body.addEventListener('touchstart', function(e){
                    a9Store.touchX = e.targetTouches[0].pageX;
                    a9Store.touchY = e.targetTouches[0].pageY;
                    a9Store.touchOnElement = getTouchedElement();
                });
                body.addEventListener('touchmove', function(e){
                    a9Store.touchX = e.targetTouches[0].pageX;
                    a9Store.touchY = e.targetTouches[0].pageY;
                    a9Store.touchOnElement = getTouchedElement();
                });
                body.addEventListener('touchend', function(e){
                    a9Store.touchX = e.changedTouches[0].pageX;
                    a9Store.touchY = e.changedTouches[0].pageY;
                    a9Store.touchOnElement = getTouchedElement();
                });
            };
            iMax += 1;
        }
        a9.ready = function(callback){
            callbacks[iMax] = callback;
            iMax += 1;
        };
        if ('addEventListener' in global){
            document.addEventListener('DOMContentLoaded', ready);
            global.addEventListener('load', ready);
        } else if ('attachEvent' in global){
            html = document.documentElement;
            if (('doScroll' in html) && (global === global.top)){
                tryScroll = function(){
                    if (!isReady || (body === null)){
                        return this;
                    }
                    try{
                        html.doScroll('left');
                        ready();
                    } catch (e){
                        setTimeout(tryScroll, 16);
                    }
                };
                tryScroll();
            }
            document.attachEvent('onreadystatechange', function(){
                if (document.readyState === 'complete'){
                    ready();
                }
            });
            global.attachEvent('onload', ready);
        } else{
            global.onload = ready;
        }
    }
}(this, A9));
