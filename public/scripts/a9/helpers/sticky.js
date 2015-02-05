(function(win, a9){
    var stickyCSSClass = 'isSticky',
        doc = document;

    a9.sticky = function($element){
        var origOffsetY = a9.getPositionY($element);

        function onScroll(e) {
            if(win.scrollY >= origOffsetY){
                a9.addClass($element, stickyCSSClass);
            } else{
                a9.removeClass($element, stickyCSSClass);
            }
        }

        a9.addEvent(doc, 'scroll', onScroll);
    };
}(window, A9));
