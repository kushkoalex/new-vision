(function(a9){
    /**
     *
     * @param {MaskBasis|String} mask (if string === mask name)
     * @param {String} maskedString
     * @param {String} substring
     * @param {String} unmasked
     * @param {Object} maskData
     * @returns {*}
     */
    a9.masking.helpers.getMaskedSubstring = function(mask, maskedString, substring, unmasked, maskData){
        var _unmasked = unmasked || '',
            indexInUnmasked = -1,
            _mask,
            _substring,
            substringLength,
            unmaskedSymbols,
            i,
            iMax;
        if (typeof mask === 'string'){
            _mask = a9.masking.masks[mask];
        }
        if (_unmasked === ''){
            _unmasked = _mask.getMaskInfo(maskedString, maskData).unmaskedValue;
        }
        indexInUnmasked = _unmasked.indexOf(substring);
        if (indexInUnmasked === -1){
            return null;
        }
        indexInUnmasked += 1;
        substringLength = substring.length;
        unmaskedSymbols = 0;
        _substring = '';
        for (i = 0, iMax = maskedString.length; i < iMax; i += 1){
            if (_mask.checkMaskedSymbol(maskedString, i)){
                unmaskedSymbols += 1;
                if (unmaskedSymbols >= indexInUnmasked){
                    substringLength -= 1;
                }
            }
            if (unmaskedSymbols >= indexInUnmasked){
                _substring += maskedString[i];
            }
            if (substringLength === 0){
                break;
            }
        }

        return _substring;

    };
}(A9));
