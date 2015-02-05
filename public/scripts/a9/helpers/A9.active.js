/**
 * Обект проверки активности таба (окна браузера)
 * @type {A9.active}
 * A9.active = {
 *     is: {Boolean} сокрощённо от isActive флаг активности
 *     focus {Array} массив функций которые вызываются если таб становиться активным, в том чисте и при ините
 *     blur {Array} массив функций которые вызываются если таб становиться неактивным
 * }
 *
 * в A9.active.focus и A9.active.blur функции добавляются с помощью метода массива push,
 * удаляются с помощью метода A9.deleteElementsArray()
 */

(function(global, a9){
    var document,
        active = {
            is: true,
            focus: [],
            blur: []
        },
        isInit = false;
    function blur(){
        for (var i = 0, blurCallbacks = active.blur, iMax = blurCallbacks.length; i < iMax; i += 1){
            blurCallbacks[i]();
        }
        active.is = false;
    }
    function focus(){
        if (isInit){
            for (var i = 0, focusCallbacks = active.focus, iMax = focusCallbacks.length; i < iMax; i += 1){
                focusCallbacks[i]();
            }
            active.is = true;
        } else{
            isInit = true;
        }
    }
    if (a9.deviceInfo.isOldIE){
        document = global.document;
        document.onfocusin = focus;
        document.onfocusout = blur;
    } else{
        global.addEventListener('focus', focus);
        global.addEventListener('blur', blur);
    }
    isInit = true;
    a9.active = active;
}(this, A9));
