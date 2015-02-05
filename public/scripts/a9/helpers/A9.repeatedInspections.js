/**
 * Глобальный постоянный таймаут, который отсанавилвается если окно таб (или окно) неактивен(о).
 * Подразумевается что туда будут передаваться функции, использущиеся для постоянной проверки каких либо значений,
 * например проверка значения инпута, в случае изменения которого должно генериться кастомное событие
 * @type {A9.repeatedInspections}
 * A9.repeatedInspections = {
 *     /**
 *      * Добавляет функцию, которая будет вызываться максимально часто
 *      * @param {Function} inspectionFunction для постоянной проверки чего-нибудь
 *     add: function(inspectionFunction){}
 *     /**
 *      * Удаляет функцию, которая была добавлена через метод A9.timeTest.add();
 *      * @param {Function} inspectionFunction для постоянной проверки чего-нибудь
 *      * @param {Function} [onRemoveCallback] калбек вызываемый после удаления функции
 *     remove: function(inspectionFunction, onRemoveCallback){}
 * }
 */
(function(global, a9){
    var setTimeout = global.setTimeout,
        clearTimeout = global.clearTimeout,
        timeoutId = -1,
        inspectionsList = [],
        addStack = [],
        removeStack = [],
        isHasToAdd = false,
        isHasToRemove = false,
        isActive = false;

    function inspectionFunctionIndexOf(inspectionFunction, inspectionCTX){
        var i = 0,
            iMax = inspectionsList.length;
        for (; i < iMax; i += 3){
            if ((inspectionsList[i] === inspectionFunction)
                && (inspectionsList[i + 1] === inspectionCTX)){
                return i;
            }
        }
        return -1;
    }

    function check(){
        var i,
            iMax,
            index;

        //check to add
        if (isHasToAdd){
            for (i = 0, iMax = addStack.length; i < iMax; i += 1){
                inspectionsList.push(addStack[i]);
            }
            addStack.length = 0;
            isHasToAdd = false;
            isActive = true;
        }

        //check to remove
        if (isHasToRemove){
            for (i = 0, iMax = removeStack.length; i < iMax; i += 3){
                index = inspectionFunctionIndexOf(removeStack[i], removeStack[i + 1]);
                if (index !== -1){
                    a9.arraySlice(inspectionsList, index, 3);
                }
            }
            removeStack.length = 0;
            isHasToRemove = false;
            if (inspectionsList.length === 0){
                isActive = false;
                timeoutId = -1;
            }
        }

        //check active
        if (isActive){
            for (i = 0, iMax = inspectionsList.length; i < iMax; i += 3){
                inspectionsList[i].call(inspectionsList[i + 1] || global, inspectionsList[i + 2]);
            }
            timeoutId = setTimeout(check, 0);
        }
    }

    a9.repeatedInspections = {
        /**
         *
         * @param {function} inspection
         * @param {*} [ctx]
         * @param {*} [data]
         */
        add: function(inspection, ctx, data){
            addStack.push(inspection, ctx, data);
            isHasToAdd = true;
            if (!isActive){
                check();
            }
        },
        /**
         *
         * @param {function} inspection
         * @param {*} [ctx]
         * @param {*} [data]
         */
        remove: function(inspection, ctx, data){
            removeStack.push(inspection, ctx, data);
            isHasToRemove = true;
        }
    };

    a9.active.focus.push(function(){
        if (timeoutId !== -1){
            clearTimeout(timeoutId);
            timeoutId = -1;
        }
        if (isActive){
            check();
        }
    });

    a9.active.blur.push(function(){
        if (timeoutId !== -1){
            clearTimeout(timeoutId);
            timeoutId = -1;
        }
    });

}(this, A9));