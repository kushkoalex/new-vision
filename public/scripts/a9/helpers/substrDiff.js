(function(a9){
    var defaultResultContainer;

    function SubstrDiffObject(){
        var substrDiffObject = this;
        substrDiffObject.type = '';
        substrDiffObject.str1Diff = '';
        substrDiffObject.str2Diff = '';
        substrDiffObject.diffStart = 0;
    }

    a9.createSubstrDiffObject = function(){
        return new SubstrDiffObject();
    };

    defaultResultContainer = a9.createSubstrDiffObject();

    /**
     * простейший diff который ищет разницу потсроки
     * @param {String} str1
     * @param {String} str2
     * @param {Object} [containerForResult]
     * @returns {SubstrDiffObject}
     */
    a9.substrDiff = function(str1, str2, containerForResult){
        var str1Length = str1.length,
            str2Length = str2.length,
            isFirstBig,

            i,
            iMax,
            diffStart,

            j,
            str1DiffEnd,
            str2DiffEnd,

            str1Diff,
            str2Diff,

            lastCheckedCharIndex,

            result = containerForResult || defaultResultContainer;

        if (str1 === str2){
            result.type = 'none';
            result.str1Diff = '';
            result.str2Diff = '';
            result.diffStart = 0;
        } else if (str1Length === 0){
            result.type = 'add';
            result.str1Diff = '';
            result.str2Diff = str2;
            result.diffStart = 0;
        } else if (str2Length === 0){
            result.type = 'remove';
            result.str1Diff = str2;
            result.str2Diff = '';
            result.diffStart = 0;
        } else{
            isFirstBig = str1Length >= str2Length;

//          check start diff
            i = 0;
            iMax = isFirstBig ? str1Length : str2Length;
            for (; i < iMax; i += 1){
                if (str1.charAt(i) !== str2.charAt(i)){
                    diffStart = i;
                    break;
                }
            }

            if (diffStart === 0){
                if (isFirstBig){
                    str1DiffEnd = str1.indexOf(str2);
                    str2DiffEnd = 0;
                } else{
                    str1DiffEnd = 0;
                    str2DiffEnd = str2.indexOf(str1);
                }
            } else{
                i = str1Length;
                j = str2Length;
                lastCheckedCharIndex = diffStart - 1;

//              check end diff
                if (isFirstBig){
                    for (;i !== 0; i--, j--){
                        if ((j === lastCheckedCharIndex)
                                || (str1.charAt(i) !== str2.charAt(j))){
                            str1DiffEnd = i + 1;
                            str2DiffEnd = j + 1;
                            break;
                        }
                    }
                } else{
                    for (;j !== 0; j--, i--){
                        if ((i === lastCheckedCharIndex)
                                || (str1.charAt(i) !== str2.charAt(j))){
                            str1DiffEnd = i + 1;
                            str2DiffEnd = j + 1;
                            break;
                        }
                    }
                }

            }

//          processing result
            str1Diff = str1.substring(diffStart, str1DiffEnd);
            str2Diff = str2.substring(diffStart, str2DiffEnd);

            result.str1Diff = str1Diff;
            result.str2Diff = str2Diff;
            result.diffStart = diffStart;

            if (str1Diff === ''){
                result.type = 'add';
            } else if (str2Diff === ''){
                result.type = 'remove';
            } else{
                result.type = 'replace';
            }

        }

        return result;

    }
}(A9));
