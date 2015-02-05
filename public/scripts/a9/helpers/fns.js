(function(a9){
    /**
     * Исполняет функцию для аргуменат(ов), за исключением undefined
     * @param {Function} fn функция которую нужно выполнить
     * @param {*|Array} _for аргумент или коллекция агрументов
     * @param {Array} [results] массив для записи результатов выполнения коллекции аргументов
     * @returns {*|Array} резултат выполнения или результаты выполнения (если была передана коллекция и results, вернёт results)
     */
    a9.callFor = function(fn, _for, results){
        var i,
            iMax,
            u;
        if (a9.isArray(_for)){
            if (results === u){
                results = [];
            }
            for (i = 0, iMax = _for.length; i < iMax; i += 1){
                results[i] = fn(_for[i]);
            }
            return results;
        } else if (_for !== u){
            return fn(_for);
        }
    };

    /**
     * вызывает fn.apply(ctx || this, argsCollections), если кто-то из элементов argsCollections[i] — массив вызовет,
     * fn.apply(ctx || this, argsCollections) cо всеми элементами argsCollections[i] вместо argsCollections[i]
     *
     * например:
     *
     * function addClass($node, className){$node.className=className;}
     * a9.multiApply(addClass,[[$div, $div2],'init',[$span, $span2]], {test: 1});
     * //addClass.apply({test: 1}, [$div,'init',$span]);
     * //addClass.apply({test: 1}, [$div2,'init',$span2]);
     *
     * так же возвращает результаты выполнения переданной функции
     * var a = a9.multiApply(function(a, b){return a + b}, [1, [2, 4]])
     * console.log(a) // [3, 5];
     *
     * var b = []
     *     a = a9.multiApply(function(a, b){return a + b}, [1, [2, 4]], u, b);
     * console.log(b) // [3, 5];
     * console.log(a === b) // true;
     *
     * @param {Function} fn
     * @param {Array} argsCollections
     * @param {*} [ctx] — fn ctx
     * @param {Array} [results] — pack for fn results
     * @returns {*|Array} result or results list fn.apply (if parameter result !== []  and fn.apply more one, return results)
     */
    a9.multiApply = function(fn, argsCollections, ctx, results){
        var argForApply = [],
            flagsMap = [],
            _results,
            isHasCollection = false,
            argsCollectionArgsLength,
            i,
            argsLength,
            j,
            u;

        for (i = 0, argsLength = argsCollections.length; i < argsLength; i += 1){
            if (a9.isArray(argsCollections[i])){
                flagsMap[i] = true;
                if (!isHasCollection){
                    isHasCollection = true;
                    argsCollectionArgsLength = argsCollections[i].length;
                }
                argForApply[i] = u;
            } else{
                flagsMap[i] = false;
                argForApply[i] = argsCollections[i];
            }
        }

        if (isHasCollection){
            _results = results || [];
            for (i = 0; i < argsCollectionArgsLength; i += 1){
                for (j = 0; j < argsLength; j += 1){
                    if (flagsMap[j]){
                        argForApply[j] = argsCollections[j][i];
                    }
                }
                _results[i] = fn.apply(ctx || this, argForApply);
            }
            return _results;
        }
        return fn.apply(ctx || this, argsCollections);
    };

    /**
     *
     * @param {*} value
     * @param {Function} fn
     * @returns {*}
     */
    a9.fnsChain = function(value, fn){
        var i = 1,
            iMax = arguments.length;
        for (; i < iMax; i += 1){
            value = arguments[i](value);
        }
        return value;
    }

}(A9));
