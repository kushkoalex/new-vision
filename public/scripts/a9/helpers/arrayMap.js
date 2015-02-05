A9.arrayMap = function(array, callback, ctx){
    var i = 0,
        iMax = array.length;
    ctx = ctx || A9;

    for (; i < iMax; i += 1){
        array[i] = callback.call(ctx, array[i], i, array);
    }

    return array;

};