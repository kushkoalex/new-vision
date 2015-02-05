/**
 * Объект для работы с cookie
 * @type {A9.cookie}
 * A9.cookie = {
 *     /**
 *      * Задать значение cookie
 *      * @param {String} name имя
 *      * @param {String} value значение
 *     set: function(object, position){}
 *     /**
 *      * Получить значение cookie
 *      * @param {String} name имя свойства
 *      * @return {String|null}
 *     get: function(name){}
 *     /**
 *      * Удалить значение cookie
 *      * @param {String} name имя свойства
 *     remove: function(name){}
 * }
 */
(function(global, a9){
    var document = global.document,
        cookie = document.cookie;
    a9.cookie = {
        get : function(name){
            var cookieArray = cookie.split('; '),
                i = cookieArray.length;
            for (; i-- ;){
                if (cookieArray[i].indexOf(name) !== -1){
                    return unescape(cookieArray[i].substring(cookieArray[i].indexOf('=') + 1, cookieArray[i].length));
                }
            }
            return null;
        },
        set: function(name, value){
            document.cookie = name + "=" + value + ";";
        },
        remove: function(name){
            document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
        }
    };
}(this, A9));
