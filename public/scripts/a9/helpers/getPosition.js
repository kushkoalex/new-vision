(function(a9){
    a9.ready(function(a9, global){
        var document = global.document;
        if ('getBoundingClientRect' in document.body){
            /**
             * Получить абсолютные координаты или координаты относительно родителя по оси X
             * @param {HTMLElement} $node
             * @param {HTMLElement|String} [$parent] необязательный параметр. Родитель относительно которого нужно узнать координаты. Если передаётся строка, ищет родителя с классом строки.
             * @return {Number} возвращает координаты относительно оси x указанного объекта
             */
            a9.getPositionX = function($node, $parent){
                var x = $node.getBoundingClientRect().left,
                    $html = document.documentElement,
                    $body = document.body,
                    scrollLeft = window.pageXOffset || $html.scrollLeft || $body.scrollLeft,
                    clientLeft = $html.clientLeft || $body.clientLeft || 0,
                    u;
                if ($parent !== u){
                    $parent = typeof $parent === 'string' ? a9.getParentByClass($node, $parent) : $parent;
                    x -= $parent.getBoundingClientRect().left;
                }
                return x + scrollLeft - clientLeft;
            };
            /**
             * Получить абсолютные координаты или координаты относительно родителя по оси Y
             * @param {HTMLElement} $node
             * @param {HTMLElement|String} [$parent] необязательный параметр. Родитель относительно которого нужно узнать координаты. Если передаётся строка, ищет родителя с классом строки.
             * @return {Number} возвращает координаты относительно оси x указанного объекта
             */
            a9.getPositionY = function($node, $parent){
                var y = $node.getBoundingClientRect().top,
                    $html = document.documentElement,
                    $body = document.body,
                    scrollTop = window.pageYOffset || $html.scrollTop || $body.scrollTop,
                    clientTop = $html.clientTop || $body.clientTop || 0,
                    u;
                if ($parent !== u){
                    $parent = typeof $parent === 'string' ? a9.getParentByClass($node, $parent) : $parent;
                    y -= $parent.getBoundingClientRect().top;
                }
                return y + scrollTop - clientTop;
            };
        } else{
            a9.getPositionX = function($node, $parent){
                var x = 0;
                $parent = typeof $parent === 'string' ? a9.getParentByClass($node, $parent) : $parent;
                while (($node !== null) && ($node !== $parent)){
                    x += $node.offsetLeft + $node.clientLeft;
                    $node = $node.offsetParent;
                }
                return x;
            };
            a9.getPositionY = function($node, $parent){
                var y = 0;
                $parent = typeof $parent === 'string' ? a9.getParentByClass($node, $parent) : $parent;
                while (($node !== null) && ($node !== $parent)){
                    y += $node.offsetTop + $node.clientTop;
                    $node = $node.offsetParent;
                }
                return y;
            };
        }
    });

}(A9));
