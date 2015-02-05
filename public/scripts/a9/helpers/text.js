(function(a9){
    var u;

    a9.str_firstUpper = function(str){
        return str.charAt(0).toUpperCase() + str.substr(1);
    };

    a9.str_expireDate = function(mounth, year){
        return (mounth < 10 ? '0' + mounth : mounth) + '/' + year.toString().substr(2);
    };

    a9.str_cardsMask = function(number){
        return number.substr(0, 3) + '• •••• •••• •' + number.substr(13);
    };

    a9.str_cardsNameToType = function(cardName){
        return cardName.toLowerCase().split(' ').join('-');
    };

    if ('trim' in String){
        a9.str_trim = function(str){
            return str.trim();
        };
    } else{
        a9.str_trim = function(str){
            return str.replace(/^\s+|\s+$/g, '');
        };
    }

    /**
     *
     * @param {String} str — string with keys in {}
     * @param {Object|String|Number} data — mergemap || mergeValue
     * @returns {String} merged str
     */
    a9.supplant = function(str, data){
        return str.replace(
            /{([^{}]*)}/g,
            function (replacedSubstr, key){
                var result;
                if ((typeof data === 'string') || (typeof data === 'number')){
                    return data;
                } else{
                    result = data[key];
                    return (typeof result === 'string') || (typeof result === 'number') ? result : replacedSubstr;
                }
            }
        );
    };


    var str_indexOfOfCollectionResult = {
        isHasIndex: false,
        indexInString: 0,
        indexInList: 0
    };

    /**
     * Находит индекс первой подходящей подстроки относительно строки
     * @param {String} string строка в которой нужно искать подстроки
     * @param {Array} list список подстрок
     * @param {Object} [resultContainer] контейнер для результата
     * @returns {*|{isHasIndex: boolean, indexOfString: number, indexInList: number}}
     */
    a9.str_indexOfOfList = function(string, list, resultContainer){
        var result = resultContainer || str_indexOfOfCollectionResult,
            indexOf,
            i = 0,
            iMax = list.length,
            isHasIndex = false;
        for (; i < iMax; i += 1){
            indexOf = string.indexOf(list[i]);
            if (indexOf !== -1){
                isHasIndex = true;
                result.indexInString = indexOf;
                result.indexInList = i;
                break;
            }
        }
        result.isHasIndex = isHasIndex;
        return result;
    };


    /**
     * Аналог метода split строки, работает с переданным массивом, !не делая копии массива!, если массив не передан,
     * создаётся новый массив
     * Использовать в местах критичных к памяти
     * @param {String} str
     * @param {String} separator
     * @param {Array} [array]
     * @return {Array} array
     */
    a9.split = function(str, separator, array){
        var i,
            j,
            iMax,
            separatorLength,
            u;
        if (array === u){
            array = [];
        } else{
            array.length = 0;
        }
        i = 0;
        iMax = str.length;
        if ((separator === u) || (separator === '')){
            for (; i < iMax; i += 1){
                array[i] = str.charAt(i);
            }
        } else{
            j = 0;
            array[0] = '';
            separatorLength = separator.length;
            if (separatorLength === 1){
                for (; i < iMax; i += 1){
                    if (str.charAt(i) === separator){
                        j += 1;
                        array[j] = '';
                    } else{
                        array[j] += str.charAt(i);
                    }
                }
            } else{
                for (; i < iMax; i += 1){
                    if (str.substr(i, separatorLength) === separator){
                        j += 1;
                        i += separatorLength - 1;
                        array[j] = '';
                    } else{
                        array[j] += str.charAt(i);
                    }
                }
            }
        }
        return array;
    }

})(A9);