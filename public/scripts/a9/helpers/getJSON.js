(function(global, a9){
    var jsonRequestSettings = {
            method: 'GET',
            url: '',
            onSuccess: function(success, onSuccessCallback){
                if (typeof success === 'string'){
                    onSuccessCallback.call(this, global.JSON.parse(success));
                } else{
                    onSuccessCallback.call(this, success);
                }
            },
            onError: null
        };
    /**
     *
     * @param {String} url
     * @param {Function} onSuccess
     * @param {Function} [onError]
     * @param {Object|Array} [ctx]
     * @returns {XMLHttpRequest}
     */
    a9.getJSON = function(url, onSuccess, onError, ctx){
        jsonRequestSettings.url = url;
        jsonRequestSettings.onError = onError;
        return a9.request(jsonRequestSettings, onSuccess, ctx);
    };
}(this, A9));
