(function(a9){
    /**
     * init modules of namespace
     * @param {Object} namespace
     * @param {Array} [modules]
     */
    a9.initModules = function(namespace, modules){
        var modulesForInit = modules || namespace.modulesForInit,
            i = 0,
            iMax = modulesForInit.length;
        for (; i < iMax; i += 1){
            modulesForInit[i](namespace);
        }
    };
}(A9));
