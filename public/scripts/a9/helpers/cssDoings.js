(function(a9){
    /**
     * get node style property value
     * @param {HTMLElement} $node
     * @param {String} cssProperty
     * @returns {String} string css property value
     */
    a9.getStyle = function($node, cssProperty){
        if ('currentStyle' in $node){
            return $node.currentStyle[cssProperty];
        } else if (('defaultView' in document) && ('getComputedStyle' in document.defaultView)){
            return document.defaultView.getComputedStyle($node, '')[cssProperty];
        } else{
            return $node.style[cssProperty];
        }
    }
}(A9));