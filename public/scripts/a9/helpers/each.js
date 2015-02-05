(function(a9){
    var isNative = Array.forEach;
    /**
     *
     * @param {Array|Object|String} eachable
     * @param {Function} fn fn calls fn(item, key, list)
     * @param {*} [ctx] fn ctx
     */
    a9.each = function(eachable, fn, ctx){
        var _ctx = ctx || a9,
            i,
            iMax;
        if (eachable){
            if (typeof eachable === 'string'){
                for (i = 0, iMax = eachable.length; i < iMax; i += 1) {
                    fn.call(_ctx, eachable.charAt(i), eachable);
                }
            } else if (a9.isArray(eachable)){
                if (isNative){
                    eachable.forEach(fn, _ctx);
                } else{
                    for (i = 0, iMax = eachable.length; i < iMax; i += 1){
                        fn.call(_ctx, eachable[i], i, eachable);
                    }
                }
            } else{
                for (var p in eachable){
                    if (eachable.hasOwnProperty(p)){
                        fn.call(_ctx, eachable[p], p, eachable);
                    }
                }
            }
        }
    };

}(A9));