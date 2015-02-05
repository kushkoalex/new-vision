(function(global, a9){
    var viewportHeight,
        viewportWidth,
        $domElementCache,
        isInit = false;

    function init(){
        var document;
        if ('innerHeight' in global){
            viewportHeight = function(){
                return global.innerHeight;
            };
            viewportWidth = function(){
                return global.innerWidth;
            };
        } else{
            document = global.document;
            $domElementCache = document.documentElement;
            if (('clientHeight' in $domElementCache) && ($domElementCache.clientHeight !== 0)){
                viewportHeight = function(){
                    return $domElementCache.clientHeight;
                };
                viewportWidth = function(){
                    return $domElementCache.clientWidth;
                };
            } else{
                $domElementCache = document.body;
                viewportHeight = function(){
                    return $domElementCache.clientHeight;
                };
                viewportWidth = function(){
                    return $domElementCache.clientWidth;
                };
            }
        }
        isInit = true;
    }

    /**
     * Возращает высоту вьюпорта
     * @return {Number} size height viewport
     */
    a9.viewportHeight = function() {
        if (!isInit){
            init();
        }
        return viewportHeight();
    };

    /**
     * Возращает ширину вьюпорта
     * @return {Number} size width viewport
     */
    a9.viewportWidth = function(){
        if (!isInit){
            init();
        }
        return viewportWidth();
    };

}(this, A9));