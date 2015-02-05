(function(a9){
    /**
     * Форматирование числа
     * @param {Number|String} digit число
     * @param {Number} [floatLength] длинна флоатной части
     * @param {Boolean} [isNotFloatZeros] флаг необходимости флоатной части
     * @returns {String} отформатированное число digit
     */
    a9.formatDigit = function(digit, floatLength, isNotFloatZeros){
        var strCache,
            digitSeparator = ' ',
            digitFloatSeparator = ',',
            intCache,
            strIntegerPart,
            i,
            j,
            strFloatPart,
            u,
            isHasFloat,
            isNegativeNumber,
            intCache2,
            regClearThenInt = /[^0-9|\.]|^0+/g;
        if ('l10n' in a9){
            strCache = a9.l10n('digitSeparator');
            if ('digitSeparator' !== strCache){
                digitSeparator = strCache;
            }
            strCache = a9.l10n('digitFloatSeparator');
            if ('digitFloatSeparator' !== strCache){
                digitFloatSeparator = strCache;
            }
        }
        a9.formatDigit = function(digit, floatLength, isNotFloatZeros){
            if (typeof digit === 'string'){
                intCache = digit.indexOf(digitFloatSeparator);
                if (intCache !== -1){
                    digit = digit.replace(digitFloatSeparator, '.');
                }
                intCache2 = digit.indexOf('-');
                strCache = digit.replace(regClearThenInt, '');
                if (intCache2 === 0){
                    strCache = '-' + strCache;
                }
            } else{
                strCache = digit.toString();
            }
            intCache = strCache.indexOf('.');
            isHasFloat = intCache !== -1;
            if (isHasFloat){
                strFloatPart = strCache.substr(intCache + 1);
                strCache = strCache.substr(0, intCache);
            } else{
                strFloatPart = '';
            }
            isNegativeNumber = strCache.indexOf('-') === 0;
            if (isNegativeNumber){
                strCache = strCache.substr(1);
            }
            i = strCache.length;
            if (i > 3){
                strIntegerPart = '';
                for (j = 4; j--, i-- ;){
                    if (j === 0){
                        j = 3;
                        strIntegerPart = digitSeparator + strIntegerPart;
                    }
                    strIntegerPart = strCache.charAt(i) + strIntegerPart;
                }
                strCache = strIntegerPart;
            }
            if (isNegativeNumber){
                strCache = '-' + strCache;
            }
            if (strCache === ''){
                strCache = '0';
            }
            if (floatLength === 0){
                return strCache;
            } else if (floatLength !== u){
                intCache = strFloatPart.length;
                if (floatLength < intCache){
                    strFloatPart = strFloatPart.substr(0, floatLength);
                } else if ((floatLength > intCache) && (isNotFloatZeros !== true)){
                    for (i = floatLength - intCache; i-- ;){
                        strFloatPart += '0';
                    }
                }
                if (!(isNotFloatZeros && (strFloatPart === ''))){
                    strFloatPart = digitFloatSeparator + strFloatPart;
                }
            } else if (isHasFloat){
                strFloatPart = digitFloatSeparator + strFloatPart;
            }
            return strCache + strFloatPart;
        };
        return a9.formatDigit.apply(a9, arguments);
    };
}(A9));