//animations functions
(function(a9){
    var AF,
        PI = Math.PI,
        halfPI = PI / 2;
    a9.animationFunctions = {
        linear: function(value){
            return value;
        },
        quadratic: function(value){
            return Math.pow(value, 2);
        },
        circ: function(value){
            return 1 - Math.sin(Math.acos(value));
        },
        sine: function(value){
            return 1 - Math.sin((1 - value) * PI / 2);
        },
        black: function(value, back){
            return Math.pow(value, 2) * ((back + 1) * value - back);
        },
        bounce: function(value){
            var a = 0,
                b = 1;
            for (a = 0, b = 1; 1; a += b, b /= 2){
                if (value >= (7 - 4 * a) / 11){
                    return -Math.pow((11 - 6 * a - 11 * value) / 4, 2) + Math.pow(b, 2);
                }
            }
        },
        elastic: function(value, powerFluctuations){
            return Math.pow(2, 10 * (value - 1)) * Math.cos(20 * value * PI * powerFluctuations / 3);
        },
        easeOut: function(value){
            function ease(value){
                var a = 0,
                    b = 1;
                for (a = 0, b = 1; 1; a += b, b /= 2){
                    if (value >= (7 - 4 * a) / 11)
                        return -Math.pow((11 - 6 * a - 11 * value) / 4, 2) + Math.pow(b, 2);
                }
            }
            return 1 - ease(1 - value);
        },
        easeInOut: function(value, powerFluctuations){
            function ease(value, powerFluctuations){
                return Math.pow(2, 10 * (value - 1)) * Math.cos(20 * value * PI * powerFluctuations / 3);
            }
            if (value < .5){
                return ease(2 * value, powerFluctuations) / 2;
            } else{
                return (2 - ease(2 * (1 - powerFluctuations) , powerFluctuations)) / 2;
            }
        },
        re: function(value, anyType, u){
            return 1 - (AF[anyType] !== u ? AF[anyType](1 - value) : AF.circ(1 - value));
        },
        //http://gizma.com/easing/ !!recommended
        //вызывать параметром , а параметром  передавать true
        linearTween: function(t, b, c, d){
            return c * t / d + b;
        },
        easeInQuad: function(t, b, c, d){
            t /= d;
            return c * t * t + b;
        },
        easeOutQuad: function(t, b, c, d){
            t /= d;
            return -c * t * (t - 2) + b;
        },
        easeInOutQuad: function(t, b, c, d){
            t /= d / 2;
            if (t < 1){
                return c / 2 * t * t + b;
            }
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        easeInCubic: function(t, b, c, d){
            t /= d;
            return c * t * t * t + b;
        },
        easeOutCubic: function(t, b, c, d){
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        },
        easeInOutCubic: function(t, b, c, d){
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        },
        easeInQuart: function(t, b, c, d){
            t /= d;
            return c * t * t * t * t + b;
        },
        easeOutQuart: function(t, b, c, d){
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        },
        easeInOutQuart: function(t, b, c, d){
            t /= d / 2;
            if (t < 1){
                return c / 2 * t * t * t * t + b;
            }
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        },
        easeInQuint: function(t, b, c, d){
            t /= d;
            return c * t * t * t * t * t + b;
        },
        easeOutQuint: function(t, b, c, d){
            t /= d;
            t--;
            return c * (t * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(t, b, c, d){
            t /= d/2;
            if (t < 1){
                return c / 2 * t * t * t * t * t + b;
            }
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        },
        easeInSine: function(t, b, c, d){
            return -c * Math.cos(t / d * halfPI) + c + b;
        },
        easeOutSine: function(t, b, c, d){
            return c * Math.sin(t / d * halfPI) + b;
        },
        easeInOutSine: function(t, b, c, d){
            return -c / 2 * (Math.cos(PI * t / d) - 1) + b;
        },
        easeInExpo: function(t, b, c, d){
            return c * Math.pow( 2, 10 * (t / d - 1) ) + b;
        },
        easeOutExpo: function(t, b, c, d){
            return c * ( -Math.pow( 2, -10 * t / d ) + 1 ) + b;
        },
        easeInOutExpo: function(t, b, c, d){
            t /= d / 2;
            if (t < 1){
                return c / 2 * Math.pow( 2, 10 * (t - 1) ) + b;
            }
            t--;
            return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
        },
        easeInCirc: function(t, b, c, d){
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        },
        easeOutCirc: function(t, b, c, d){
            t /= d;
            t--;
            return c * Math.sqrt(1 - t * t) + b;
        },
        easeInOutCirc: function(t, b, c, d){
            t /= d / 2;
            if (t < 1){
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        }
    };
    AF = a9.animationFunctions;
}(A9));

/**
 * Animate понимает значения передаваемые в 'px' '%' 'em'. работает с помощью requestAnimationFrame
 * @param {HTMLElement} object анимируемый объект
 * @param {Array} properties анимируемые CSS свойства. пример ['left', 1, 'em', 'width', 50, '%', 'marginTop', 20, '%', 'height', 300, 'px']
 * @param {Number} [time] время анимации
 * @param {Function} [callback] функция вызываемая после окончания анимации. В качестве this получает object, первым параметром получает параметр [data]
 * @param {String||Boolean} [animationFunctionName] имя функции расчитывающей анимацию (хранятся в SLEDGE.animationFunctions)
 * или ture, в случае передачи ture параметром [animationFunctionOptions] нужно передать имя одного и методов
 * SLEDGE.animationFunctions идущих после комметария //http://gizma.com/easing/ в описании объекта SLEDGE.animationFunctions (это Tween'сы)
 * @param {Mixed} [animationFunctionOptions] дополнительные параметры для некоторых функций расчёта анимации (см. в SLEDGE.animationFunctions)
 * @param {Function} [frameCallback] функция вызываемая на каждый шаг анимации.
 * В качестве this получает object, первым параметром получает progress от 0 до 1, вторым параметром получает параметр [data]
 * @param {Mixed} [data] данные которые нужно прокинуть в колбеки
 * @return {Function} [stop] функция которая останавливает анимацию в момент вызова.
 * в неё можно передать функцию, которая будет вызвана после остановки.
 * Функция, вызванная после остановки, в качестве this получает object, первым параметром получает параметр [data]
 */
A9.animate = function(object, properties, time, callback, animationFunctionName, animationFunctionOptions, frameCallback, data){
    var a9 = this,
        requestAF = a9.deviceInfo.requestAF,
        animationStateFunction,
        style = object.style,
        iMax = properties.length,
        i = iMax,
        animationArray = [], // int/float array !please save it!
        animationArrayLength = -1,
        start,
        progress,
        animationFrame,
        result,
        property,
        getStyleResult,
        parent,
        parentWidth,
        parentHeight,
        from,
        to,
        u;
    if (time === u){
        time = 500;
    }
    time = 1 / time;
    if (animationFunctionName === u){
        animationStateFunction = a9.animationFunctions.linear;
    } else if (animationFunctionName === true){
        animationStateFunction = a9.animationFunctions[animationFunctionOptions];
    } else{
        animationStateFunction = a9.animationFunctions[animationFunctionName];
    }
    // animationArray[index] — property
    // animationArray[index + 1] — from
    // animationArray[index + 2] — direction
    // animationArray[index + 3] — cache if (animationType === true) way : to - from;
    for (; i-- ;){
        animationArray[animationArrayLength += 1] = property = properties[i - 2];
        if (property === 'width'){
            from = object.offsetWidth;
        } else if (property === 'height'){
            from = object.offsetHeight;
        } else{
            getStyleResult = a9.getStyle(object, property);
            if (getStyleResult.indexOf('%') !== -1){
                from = ((property === 'top') || (property === 'bottom') ? (parentHeight = parentHeight || (parent = parent || object.parentNode).offsetHeight) : (parentWidth = parentWidth || (parent = parent || object.parentNode).offsetWidth)) * .01 * parseFloat(getStyleResult);
            } else if (getStyleResult === 'auto'){
                if ((property === 'marginLeft') || (property === 'marginLeft')){
                    from = ((parentWidth = parentWidth || (parent = parent || object.parentNode).offsetWidth) - object.offsetWidth) * .5;
                } else{
                    from = 0;
                }
            } else{
                from = parseInt(getStyleResult, 10);
            }
        }
        animationArray[animationArrayLength += 1] = from;
        to = properties[i - 1];
        if (properties[i] === '%'){
            to = ((property === 'height') || (property === 'top') || (property === 'bottom') ? (parentHeight = parentHeight || (parent = parent || object.parentNode).offsetHeight) : (parentWidth = parentWidth || (parent = parent || object.parentNode).offsetWidth)) * .01 * to;
        } else if (properties[i] === 'em'){
            to = to * parseFloat(a9.getStyle(object, 'fontSize'));
        }
        animationArray[animationArrayLength += 1] = from > to ? -1 : 1;
        animationArray[animationArrayLength += 1] = animationFunctionName === true ? Math.abs(to - from) : to - from;
        i -= 2;
    }
    animationArrayLength += 1;
    function animation(){
        progress = (new Date().getTime() - start) * time;
        if (progress < 1){
            for (i = animationArrayLength; i-- ;){
                if (animationFunctionName === true){
                    result = Math.floor(animationArray[i - 2] + (animationArray[i - 1] * animationStateFunction(progress, 0, animationArray[i], 1)));
                } else{
                    result = Math.floor(animationArray[i] * animationStateFunction(progress, animationFunctionOptions) + animationArray[i - 2]);
                }
                style[animationArray[i - 3]] = result + 'px';
                i -= 3;
            }
            if (frameCallback !== u){
                frameCallback.call(object, progress, data);
            }
            animationFrame = requestAF(animation);
        } else{
            for (i = iMax; i-- ;){
                style[properties[i - 2]] = properties[i - 1] + properties[i];
                i -= 2;
            }
            if (callback !== u){
                callback.call(object, data);
            }
            animation = object = properties = time = callback = animationFunctionName = animationFunctionOptions = frameCallback = data = a9 = requestAF = animationStateFunction = style = iMax = i = iMax = animationArray = animationArrayLength = start = progress = animationFrame = result = property = getStyleResult = parent = parentWidth = parentHeight = from = to = u = null;
        }
    }
    start = new Date().getTime();
    animationFrame = requestAF(animation);
    return function stop(stopCallback){
        a9.deviceInfo.cancelAF(animationFrame);
        if (stopCallback !== u){
            stopCallback.call(object, progress, data);
        }
        stop = stopCallback = animation = object = properties = time = callback = animationFunctionName = animationFunctionOptions = frameCallback = data = a9 = requestAF = animationStateFunction = style = iMax = i = iMax = animationArray = animationArrayLength = start = progress = animationFrame = result = property = getStyleResult = parent = parentWidth = parentHeight = from = to = u = null;
    };
};
