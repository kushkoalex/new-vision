(function(a9){
    var l10n,
        modifications = {},
        u,
        modificationArray = [],
        digitForSupplant = {
            digit: 0
        };

    a9.l10n = l10n = function(key, modification){
        if (modification in modifications){
            a9.copyArray(arguments, modificationArray, 2);
            modificationArray.unshift(key);
            return modifications[modification].apply(modifications, modificationArray);
        }
        if (key in l10n.dictionary){
            return l10n.dictionary[key];
        }
        return key;
    };

    modifications.title = modifications.firstUpper = function(key){
        return a9.str_firstUpper(l10n.dictionary[key] || key);
    };

    modifications.numeral = function(key, digit){
        var digitStrCache,
            digitStrCacheLastIndex,
            lastDigit,
            resultKey;
        switch (l10n.locale){
            case 'rus':
            case 'ukr':
                digitStrCache = '' + digit;
                digitStrCacheLastIndex = digitStrCache.length - 1;
                lastDigit = digitStrCache.charAt(digitStrCacheLastIndex);
                switch (digitStrCache.charAt(digitStrCacheLastIndex)){
                    case '1':
                        if ((digitStrCacheLastIndex === 0) || (digitStrCache.charAt(digitStrCacheLastIndex - 1) !== '1')){
                            resultKey = key + '_1';
                        } else{
                            resultKey = key + '_s';
                        }
                        break;
                    case '2':
                    case '3':
                    case '4':
                        if ((digitStrCache.charAt(digitStrCacheLastIndex - 1) !== '1')){
                            resultKey = key + '_2-4';
                        } else{
                            resultKey = key + '_s';
                        }
                        break;
                    default:
                        resultKey = key + '_s';
                }
                break;
            case 'eng':
                if (digit === 1){
                    resultKey = key;
                } else{
                    resultKey = key + '_s';
                }
                break;
            default:
                resultKey = key;
        }
        digitForSupplant.digit = digit;
        return a9.supplant(l10n(resultKey), digitForSupplant);
    };

    modifications.oneOrMore = function(key, digit){
        var resultKey;
        if (digit === 1){
            resultKey = key;
        } else{
            resultKey = key + '_s';
        }
        digitForSupplant.digit = digit;
        return a9.supplant(l10n(resultKey), digitForSupplant);
    }
}(A9));
