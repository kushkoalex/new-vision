(function(global){
    var awareness,
        checkingErrors = {},
        arrayIndexOf;

    arrayIndexOf = ('indexOf' in Array) || ('indexOf' in Array.prototype) ?
        function(array, element){
            return array.indexOf(element);
        }
        : function(array, element){
            for (var i = array.length; i-- ;){
                if (array[i] === element){
                    return i;
                }
            }
            return -1;
        };

    function slice(array, index){
        var length = array.length - 1,
            i = index;
        for (; i < length; i += 1){
            array[i] = array[i + 1];
        }
    }

    function ErrorConstructor(domain, code, description, data){
        var error = this,
            u;
        error.domain = domain;
        error.code = code;
        if ((description !== u) && (typeof description !== 'string')){
            error.description = u;
            error.data = description;
        } else{
            error.description = description;
            error.data = data || null;
        }
    }

    function checking(domain, code, description, data){
        var i,
            iMax,
            u,
            checkFns,
            checkData,
            result,
            _result;
        if (checkingErrors[0] !== u){
            checkFns = checkingErrors[0].fns;
            checkData = checkingErrors[0].data;
            for (i = 0, iMax = checkFns.length; i < iMax; i += 1){
                _result = checkFns[i](domain, code, description, data, checkData[i]);
                if (_result !== u){
                    result = _result;
                }
            }
        }

        if (domain in checkingErrors){
            checkFns = checkingErrors[domain].fns;
            checkData = checkingErrors[domain].data;
            for (i = 0, iMax = checkFns.length; i < iMax; i += 1){
                _result = checkFns[i](code, description, data, checkData[i]);
                if (_result !== u){
                    result = _result;
                }
            }
        }

        return result;
    }

    global.AWARENESS = awareness = {

        error: function(domain, code, description, data){
            var error = checking(domain, code, description, data);
            if (!awareness.isError(error)){
                error = new ErrorConstructor(domain, code, description, data);
            }
            return error;
        },

        addErrorCheck: function(domain, checkingFunction, checkingFunctionData){
            if (domain in checkingErrors){
                checkingErrors[domain].fns.push(checkingFunction);
                checkingErrors[domain].data.push(checkingFunctionData);
            } else{
                checkingErrors[domain] = {
                    fns: [checkingFunction],
                    data: [checkingFunctionData]
                }
            }
        },

        removeErrorCheck: function(domain, checkingFunction, checkingFunctionData){
            var index,
                fns;
            if (domain in checkingErrors){
                fns = checkingErrors[domain].fns;
                index = arrayIndexOf(fns, checkingFunction);
                if (index !== -1){
                    if (fns.length === 1){
                        delete checkingErrors[domain];
                    } else{
                        slice(fns, index);
                        slice(checkingErrors[domain].data, index);
                    }
                }
            }
        },

        isError: function(verifiable){
            return verifiable instanceof ErrorConstructor;
        }
    };

}(this));