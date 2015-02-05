(function(a9){
    /**
     * джойнит аргументы
     * @param {arguments} args
     * @param {String} separator
     * @returns {String}
     */
    a9.joinArgs = function(args, separator){
        var i = args.length,
            array = [];
        array.length = i;
        for (; i-- ;){
            array[i] = args[i];
        }
        return array.join(separator);
    };

}(A9));
