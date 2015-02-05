(function(global, a9){
    var document = global.document;

    /**
     * Поиск HTML-элемента по ID
     * @param {String} id
     * @return {HTMLElement} найденный элемент
     */
//    (id)
    a9.$ = function(id){
        return document.getElementById(id);
    };

    /**
     * Поиск HTML-элементов по name
     * @param {String} name
     * @return {HTMLCollection} возвращает массив найденых элементов
     */
//    (name)
    a9.$n = function(name){
        return document.getElementsByName(name);
    };

    /**
     * Поиск HTML-элементов по тэгу
     * @param {String} tag
     * @param {HTMLElement} [$node] узел дерева, в котором нужно производить поиск
     * @return {HTMLCollection} возвращает массив найденых элементов
     */
//    (tag name)
    a9.$tn = function(tag, $node){
        return ($node || document).getElementsByTagName(tag);
    };


    if ('getElementsByClassName' in document){
        /**
         * Поиск HTML-элементов по классу
         * @param {String} className класс поиска
         * @param {HTMLElement} [$node] узел дерева, в котором нужно производить поиск
         * @return {HTMLCollection} возвращает массив найденых элементов
         */
//        (class name)
        a9.$c = function(className, $node){
            return ($node || document).getElementsByClassName(className);
        };

        /**
         * Поиск нескольких коллекций HTML-элементов по классам в элементе
         * @param {HTMLElement} $node элемент в детях которого производиться поиск
         * @param {String|...} className
         * Метод принимает любое количество классов, т.е. метод можно использовать
         * SWF01.$cs(document.getElementById('myElement'), 'asd', 'sdf', 'qwe', 'wer', 'zxc', 'xcv);
         * или
         * SWF01.$cs(document.getElementById('myElement'), 'asd', 'sdf');
         * @return {Object} возвращает объект свойствам которого являются классы переданные для поиска. Каждое св-во содержит
         * массив с элементами, кслассы которых соответствуют названию этого св-ва. Например:
         * {
         *     testClass: [div.testClass, a.testClass],
         *     searchingClass: [span.searchingClass, span.searchingClass, span.searchingClass],
         *     helloClass: [a.helloClass, a.helloClass]
         * }
         */
//        (classes names)
        a9.$cs = function($node, className){
            var i = arguments.length,
                $csQueryObject = {};
            $node = ($node || document);
            for (; i -= 1 ;){
                $csQueryObject[arguments[i]] = $node.getElementsByClassName(arguments[i]);
            }
            return $csQueryObject;
        }
    } else{
        /**
         * Поиск HTML-элементов по классу
         * @param {String} className класс поиска
         * @param {HTMLElement} [$node] узел дерева, в котором нужно производить поиск
         * @return {Array} возвращает массив найденых элементов
         */
//        (class name)
        a9.$c = function(className, $node){
            var cache = ($node || document).getElementsByTagName('*'),
                result = [],
                i = 0,
                iMax = cache.length;
            for (; i < iMax ; i += 1){
                if (cache[i].className.indexOf(className) !== -1){
                    result.push(cache[i]);
                }
            }
            return result;
        };

        /**
         * Поиск нескольких коллекций HTML-элементов по классам в элементе
         * @param {HTMLElement} $node элемент в детях которого производиться поиск
         * @param {String|...} [className]
         * Метод принимает любое количество классов, т.е. метод можно использовать
         * SWF01.$cs(document.getElementById('myElement'), 'asd', 'sdf', 'qwe', 'wer', 'zxc', 'xcv);
         * или
         * SWF01.$cs(document.getElementById('myElement'), 'asd', 'sdf');
         * @return {Object} возвращает объект свойствам которого являются классы переданные для поиска. Каждое св-во содержит
         * массив с элементами, кслассы которых соответствуют названию этого св-ва. Например:
         * {
         *     testClass: [div.testClass, a.testClass],
         *     searchingClass: [span.searchingClass, span.searchingClass, span.searchingClass],
         *     helloClass: [a.helloClass, a.helloClass]
         * }
         */
//        (classes names)
        a9.$cs = function($node, className){
            var DOMElements = ($node || document).getElementsByTagName('*'),
                iMax = arguments.length,
                i = iMax,
                j = 0,
                jMax = DOMElements.length,
                strCache,
                $csQueryObject = {};
            for (; i-= 1 ;){
                $csQueryObject[arguments[i]] = [];
            }
            for (; j < jMax; j += 1){
                strCache = DOMElements[j].className;
                for (i = iMax; i -= 1 ;){
                    if (strCache.indexOf(arguments[i]) !== -1){
                        $csQueryObject[arguments[i]].push(DOMElements[j]);
                    }
                }
            }
            return $csQueryObject;
        }
    }
}(this, A9));
