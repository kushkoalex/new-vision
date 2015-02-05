(function(a9){
    /**
     * безоасно получить значение сквозь вложенные объекты
     * @param {Object} object
     * @param {String|Number|Array} [key] — ключи объектов, если массивом то только один параметр
     * @returns {*} result || null
     */
    a9.getValueByObjectKeys = function(object, key){
        var keyTypeof = typeof key,
            i,
            iMax,
            keysList,
            cache,
            result,
            u;
        if (object){
            if ((keyTypeof !== 'string')
                && (keyTypeof !== 'number')){
                keysList = key;
                i = 0;
            } else{
                keysList = arguments;
                i = 1;
            }
            iMax = keysList.length - 1;
            for (; i < iMax; i += 1){
                cache = object[keysList[i]];
                if (cache === u){
                    return null;
                } else{
                    object = cache;
                }
            }
            result = object[keysList[i]];
            if (result !== u){
                return result;
            }
        }
        return null;
    };

    /**
     *
     * @param {Array} list
     * @param {String|Number|Array} key — ключ
     * @param {*} value — значение
     * @param {Boolean} [isNeedIndex] — флаг получения индекса
     * @returns {*|Number} result or null
     */
    a9.getObjectOfList = function(list, key, value, isNeedIndex){
        var keyTypeof = typeof key,
            i = 0,
            iMax = list.length;
        if ((keyTypeof !== 'string')
            && (keyTypeof !== 'number')){
            for (; i < iMax; i+= 1){
                if (a9.isObject(list[i])
                    && (a9.getValueByObjectKeys(list[i], key) === value)){
                    return isNeedIndex === true ? i : list[i];
                }
            }
        } else{
            for (; i < iMax; i+= 1){
                if (a9.isObject(list[i])
                    && (list[i][key] === value)){
                    return isNeedIndex === true ? i : list[i];
                }
            }
        }
        return null;
    };

    /**
     *
     * @param {Array} list
     * @param {String|Number|Array} key object key (or keychain if type is array (use a9.getValueByObjectKeys))
     * @param {*|Function} rule — value or function rule
     * @param {Array} [container] — container foe result
     * @returns {Array} result || container (if container was in call)
     */
    a9.filterObjectsOfList = function(list, key, rule, container){
        var keyTypeof = typeof key,
            i = 0,
            iMax = list.length,
            isValueFn = typeof rule === 'function',
            result,
            u;
        if (container !== u){
            container.length = 0;
            result = container;
        } else{
            result = []
        }
        if ((keyTypeof !== 'string')
            && (keyTypeof !== 'number')){
            for (; i < iMax ; i += 1){
                if (a9.isObject(list[i])
                    && (
                        (isValueFn && rule(a9.getValueByObjectKeys(list[i], key)))
                        || (!isValueFn && (a9.getValueByObjectKeys(list[i], key) === rule))
                    )
                ){
                    result.push(list[i]);
                }
            }
        } else{
            for (; i < iMax ; i += 1){
                if (a9.isObject(list[i])
                    && (
                        (isValueFn && rule(list[i][key]))
                        || (!isValueFn && (list[i][key] === rule))
                        )
                    ){
                    result.push(list[i]);
                }
            }
        }
        return result;
    };



    function AnswerForGetObjectFromTree(){
        var answer = this;
        answer.collection = null;
        answer.index = -1;
        answer.searchableObject = null;
    }

    AnswerForGetObjectFromTree.prototype = {
        clean: function(){
            var answer = this;
            answer.collection = null;
            answer.index = -1;
            answer.searchableObject = null;
        }
    };

    a9.createAnswerForGetObjectFromTree = function(){
        return new AnswerForGetObjectFromTree();
    };

    var answerForGetObjectFromTree = a9.createAnswerForGetObjectFromTree();

    /**
     *
     * @param {Array} tree
     * @param {String} subTreePropertyName
     * @param {String} property
     * @param {*} value
     * @param {AnswerForGetObjectFromTree} [objectForAnswer]
     * @returns {*}
     */
    a9.getObjectFromTree = function(tree, subTreePropertyName, property, value, objectForAnswer){
        var i = 0,
            iMax = tree.length,
            result,
            _getObjectFromTreeAnswer = objectForAnswer || answerForGetObjectFromTree;
        for (; i < iMax; i += 1){
            if (tree[i][property] === value){
                _getObjectFromTreeAnswer.collection = tree;
                _getObjectFromTreeAnswer.index = i;
                _getObjectFromTreeAnswer.searchableObject = tree[i];
                return _getObjectFromTreeAnswer;
            }
            if (subTreePropertyName in tree[i]){
                result = a9.getObjectFromTree(tree[i][subTreePropertyName], subTreePropertyName, property, value, _getObjectFromTreeAnswer);
                if (result !== null){
                    return result;
                }
            }
        }
        return null;
    };

}(A9));
