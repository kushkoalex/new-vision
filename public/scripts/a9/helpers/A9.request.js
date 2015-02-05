(function(global, a9){
    var constructor,
        u;

    if (global.XMLHttpRequest !== u){
        constructor = function(){
            return new XMLHttpRequest();
        }
    } else{
        try {
            new ActiveXObject('Msxm12.XMLHTTP');
            constructor = function(){
                return new ActiveXObject('Msxm12.XMLHTTP');
            }
        } catch (e){
            try {
                new ActiveXObject('Microsoft.XMLHTTP');
                constructor = function(){
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            } catch (e){}
        }
    }

    function objectToGETParameters(object, isNotNeedUriEncode){
        var array = [],
            p;
        if (isNotNeedUriEncode === true){
            for (p in object){
                array.push(p + '=' + object[p]);
            }
        } else{
            for (p in object){
                array.push(p + '=' + encodeURIComponent(object[p]));
            }
        }
        return array.join('&');
    }

    a9.objectToGETParameters = objectToGETParameters;

    function parseSuccess(request){
        var cache = request.getResponseHeader('Content-Type');
        if ((cache.indexOf('application/json') !== -1) || (cache.indexOf('json/text') !== -1)){
            return global.JSON.parse(request.responseText);
        } else if (cache.indexOf('text/xml') !== -1){
            return request.responseXML;
        }
        return request.responseText;
    }

    /**
     * @param {Object} options — request options for request
     * for example
     * {
         // method mame to uppercase
         method: 'POST',
         //end point url
         url: '/api/',

         //[optional] object notation URL GET parameters
         urlData: {
            search: 'hello'
         },
         //[optional] flag for need URI encode urlData object notation (default: true)
         isNeedURIEncodeURL: false,

         //[optional] object notation POST parameters
         postData: {},
         //[optional] flag for need URI encode postData object notation (default: true)
         isNeedURIEncodePOST: false,

         //[optional] POST body
         send: 'asd=asd&qwer=qwer',

         //[optional] callback if 200 <= request.status < 300 || request.status === 304
         onSuccess: function(parseSuccess, requestData, request){},
         //[optional] callback other request.status
         onError: function(requestData, request){},

         //[optional] timeout in ms
         timeout: 1000,
         //[optional] on timeout end callback
         onTimeoutEnd: function(requestData, request){},

         //[optional] on request state change callback
         onStateChange: function(requestData, request){},

         //[optional] request async flag (default: true)
         isASync: false,

         //[optional] http headers object notation
         headers: {
            "Authorization": "token"
         }
     }
     *
     * @param {*} [requestData] — data parameter for option functions
     * @param {*} [callbacksCTX] — this in option functions
     * @returns {XMLHttpRequest}
     */
    a9.request = function(options, requestData, callbacksCTX){
        var onSuccess = options.onSuccess,
            onError = options.onError,
            timeout = options.timeout,
            onTimeoutEnd = options.onTimeoutEnd,
            isASync = !(options.isASync === false),
            headers = options.headers,
            onStatusChange = options.onStateChange,
            request = constructor(),
            timeoutID,
            isTimeoutAborted = false,
            url = options.url,
            p,
            isNotNeedEncodeURL,
            isNotNeedEncodePOST;

        callbacksCTX = callbacksCTX || global;

        request.onreadystatechange = function(){
            var status;
            if (onStatusChange !== u){
                onStatusChange.call(callbacksCTX, requestData, request);
            }
            if (request.readyState === 4){
                if (timeoutID !== u){
                    global.clearTimeout(timeoutID);
                }
                status = request.status;
                if (((status >= 200) && (status < 300))
                    || (status === 304)){
                    if (onSuccess !== u){
                        onSuccess.call(callbacksCTX, parseSuccess(request), requestData, request);
                    }
                } else{
                    if (onError !== u){
                        onError.call(callbacksCTX, requestData, request);
                    }
                }
                if (!isTimeoutAborted){
                    request = onSuccess = onError = onTimeoutEnd
                        = onStatusChange = callbacksCTX = requestData = headers = null;
                }
            }
        };

        if (options.urlData !== u){
            if (options.isNeedURIEncodeURL !== u){
                isNotNeedEncodeURL = !options.isNeedURIEncodeURL;
            }
            url += '?' + objectToGETParameters(options.urlData, isNotNeedEncodeURL);
        }

        request.open(options.method, url, isASync);

        if (headers !== u){
            for (p in headers){
                request.setRequestHeader(p, headers[p]);
            }
        }

        if (timeout !== u){
            timeoutID = global.setTimeout(function(){
                isTimeoutAborted = true;
                timeoutID = u;
                request.abort();
                if (onTimeoutEnd !== u){
                    onTimeoutEnd.call(callbacksCTX, requestData, request);
                }
                request = onSuccess = onError = onTimeoutEnd
                    = onStatusChange = callbacksCTX = requestData = headers = null;
            }, timeout);
        }

        if (options.method === 'POST'){
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            if (options.isNeedURIEncodePOST !== u){
                isNotNeedEncodePOST = !options.isNeedURIEncodePOST;
            }
            request.send(options.postData !== u ?
                objectToGETParameters(options.postData, isNotNeedEncodePOST)
                : options.send
            );
        } else{
            request.send(null);
        }

        return request;
    };

}(this, A9));
