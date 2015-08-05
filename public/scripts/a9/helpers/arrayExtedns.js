(function (global, a9) {
    var _array = global.Array,
        u;

    if (_array.filter === u) {
        /**
         * arrayFilter
         * @param {Array} array — array for arrayFilter
         * @param {Function} rule — arrayFilter rule
         * @param {*} [ruleCTX] — rule function ctx
         * @returns {Array} new array
         */
        a9.arrayFilter = function (array, rule, ruleCTX) {
            return array.filter(rule, ruleCTX);
        };
    } else {
        /**
         * arrayFilter
         * @param {Array} array — array for arrayFilter
         * @param {Function} rule — arrayFilter rule
         * @param {*} [ruleCTX] — rule function ctx
         * @returns {Array} new array
         */
        a9.arrayFilter = function (array, rule, ruleCTX) {
            var i = array.length,
                newArray = [],
                u;
            if (ruleCTX !== u) {
                for (; i--;) {
                    if (rule.call(ruleCTX, array[i])) {
                        newArray.unshift(array[i]);
                    }
                }
            } else {
                for (; i--;) {
                    if (rule(array[i])) {
                        newArray.unshift(array[i]);
                    }
                }
            }

            return newArray;
        };
    }

    /**
     * Складывает массивы по сдедующему правилу
     * если переданны 2 массива
     * lib.arraysMerge([0, 1], [2, 3]);
     * arraysMerge вернёт второй массив в виде [0, 1, 2, 3]
     *
     * lib.arraysMerge([0, 1], [2, 3], undefined, 1);
     * arraysMerge вернёт второй массив в виде  [2, 0, 1, 3]
     *
     * var a = [любое зло];
     * lib.arraysMerge([0, 1], [2, 3], a);
     * вернёт a равный [0, 1, 2, 3] не изменив значения складываемых массивов
     *
     * var a = [любое зло];
     * lib.arraysMerge([0, 1], [2, 3], a, 1);
     * вернёт a равный [2, 0, 1, 3] не изменив значения складываемых массивов
     *
     * @param {Array} firstArray массив который нужно складывать
     * @param {Array} secondArray массив c которым нужно складывать
     * @param {Array|undefined} [inArray] [опциональный по умолчанию равен undefined] массив в который записывается результат
     * @param {Number|undefined} [from] [опциональный по умолчанию равен 0] элемент массива secondArray с которого нужно вставлять массив firstArray
     * @return {Array} secondArray или inArray
     */
    a9.arraysMerge = function (firstArray, secondArray, inArray, from) {
        var firstLength = firstArray.length,
            secondLength = secondArray.length,
            resultLength = firstLength + secondLength,
            end,
            i,
            j,
            z,
            u;
        if (from === u) {
            from = 0;
        }
        if (inArray === u) {
            for (i = resultLength - 1, j = secondLength - 1; j >= from; i -= 1, j -= 1) {
                secondArray[i] = secondArray[j];
            }
            for (i = 0, j = from; i < firstLength; i += 1, j += 1) {
                secondArray[j] = firstArray[i];
            }
            return secondArray;
        } else {
            end = from + firstLength;
            inArray.length = resultLength;
            for (i = 0, j = 0, z = 0; i < resultLength; i += 1) {
                if ((i >= from) && (i < end)) {
                    inArray[i] = firstArray[j];
                    j += 1;
                } else {
                    inArray[i] = secondArray[z];
                    z += 1;
                }
            }
            return inArray;
        }
    };


    /**
     *
     * @param {Array} array
     * @param {Number|String} [sumTo]
     * @returns {Number|String}
     */
    a9.arraySum = function (array, sumTo) {
        var result;

        if (arguments.length === 2) {
            result = sumTo;
        } else {
            result = 0;
        }

        a9.each(array, function (item) {
            result += item;
        });

        return result;
    };

    /**
     *
     * @param {String} str
     * @returns {Array}
     */
    a9.strToNumbersArray = function (str) {
        var splitStr = [];
        a9.each(str, function (codeChar) {
            splitStr.push(+codeChar);
        });
        return splitStr;
    };


    a9.contains = function (arr, obj) {
        for(var i= 0; i<arr.length; i++){
            if(arr[i]===obj){
                return true;
            }
        }
        return false;
    }

}(this, A9));
