/**
 * Объект для работы с localStorage
 * В случае отсутсвия поддержки localStorage подхватывает cookie
 * @type {A9.storage}
 * A9.storage = {
 *     /**
 *      * Задать значение storage
 *      * @param {String} name имя
 *      * @param {String} value значение
 *     set: function(object, position){}
 *     /**
 *      * Получить значение storage
 *      * @param {String} name имя свойства
 *      * @return {String|null}
 *     get: function(name){}
 *     /**
 *      * Удалить значение storage
 *      * @param {String} name имя свойства
 *     remove: function(name){}
 * }
 */
(function(global, a9){
    var storage,
        _localStorage = global.localStorage,
        u;
    if (_localStorage !== u){
        storage = {
            set: function(name, value){
                try {
                    _localStorage.setItem(name, value);
                } catch(e){
                    if (e === 'QUOTA_EXCEEDED_ERR') {
                        a9.generateCustomEvent(storage, 'storageIsFull');
                    }
                }
            },
            get: function(name){
                return _localStorage.getItem(name);
            },
            remove: function(name){
                _localStorage.removeItem(name);
            }
        }
    } else{
        storage = {
            set: a9.cookie.set,
            get: a9.cookie.get,
            remove: a9.cookie.remove,
        }
    }
    A9.storage = storage;
}(this, A9));