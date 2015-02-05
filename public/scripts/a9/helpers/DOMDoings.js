(function(global, a9){
    /**
     * Проверяет евляется ли элемент ребёнком другого элемента
     * @param {HTMLElement} $node элемент
     * @param {HTMLElement} $parent родитель
     * @return {Boolean} являеться / не является
     */
    a9.testParentOf = function ($node, $parent){
        var u;
        while (($node !== null) && ($node !== u)){
            if ($node === $parent){
                return true;
            }
            $node = $node.parentNode;
        }
        return false;
    };

    /**
     * Удаляет узел из DOM
     * @param {HTMLElement} $node узел который нужно удалить
     */
    a9.removeElement = function($node){
        $node.parentNode.removeChild($node);
    };

    /**
     * Удаляет всё содержимое элемента
     * @param {HTMLElement} $node элемент, содержимое которого нужно удалить
     */
    a9.removeContent = function($node){
        var children = $node.childNodes,
            i = children.length;
        for (; i -- ;){
            $node.removeChild(children[i]);
        }
    };

    /**
     * Получить весь текст внутри узла
     * @param {HTMLElement} $node
     * @return {String} возвращает найденый текст
     */
    a9.getText = function($node){
        return 'textContent' in $node ? $node.textContent  : (function fun(object){
            var child = object.childNodes,
                result = '',
                i = 0,
                iMax = child.length;
            for (; i < iMax; i += 1){
                result += child[i].nodeName != '#text' ?  fun(child[i]) : child[i].nodeValue;
            }
            return result;
        })($node);
    };


    a9.setText = function($node, text){
        var $textNode = a9.getTextNode($node);
        if ('textContent' in $textNode){
            $textNode.textContent = text;
        } else{
            $textNode.nodeValue = text;
        }
    };

    /**
     * Возвращает текстовый узел узла, елси текстового узла нет, создаёт
     * @param {HTMLElement} $node
     * @returns {Node} текстовый узел DOM
     */
    a9.getTextNode = function($node){
        var node = $node.childNodes[0],
            u;
        if (node === u){
            node = document.createTextNode('');
            $node.appendChild(node);
        }
        return node;
    };

    /**
     * Вернуть детей узла
     * @param {HTMLElement} $node HTML-элемент детей которого нужно вернуть
     * @return {HTMLCollection} массив детей
     */
    a9.getChildren = function($node){
        var swf01 = this;
        if ('children' in $node){
            swf01.getChildren = function(object){
                return object.children;
            }
        } else{
            swf01.getChildren = function(object){
                var child = object.childNodes,
                    result = [],
                    i = 0,
                    iMax = child.length;
                for (; i < iMax; i += 1){
                    if (child[i].nodeName !== '#text'){
                        result.push(child[i]);
                    }
                }
                return result;
            }
        }
        return swf01.getChildren($node);
    };

    /**
     * getParentBy вернуть родителя со свойством
     * @param {HTMLElement} $node HTML элемет относительно которого нужно идти по цепочке родителей
     * @param {String} property имя свойства HTML елемента
     * @param {*} [propertyValue] значение свойства HTML елемента
     * @param {Boolean} [isWithMe] значение свойства HTML елемента
     * @return {HTMLElement} возвращает найденого родителя или null
     */
    a9.getParentBy = function($node, property, propertyValue, isWithMe){
        var u,
            isHas = propertyValue === u;
        if (isWithMe !== true){
            $node = $node.parentNode;
        }
        if (isHas === true){
            while (($node !== null) && ($node !== u)){
                if (property in $node){
                    return $node;
                }
                $node = $node.parentNode;
            }
        } else{
            while (($node !== null) && ($node !== u)){
                if ($node[property] === propertyValue){
                    return $node;
                }
                $node = $node.parentNode;
            }
        }
        return null;
    };

    if ('hasAttribute' in global.document.documentElement){
        /**
         * check node has attribute
         * @param {HTMLElement} $node
         * @param {String} attributeName
         * @return {Boolean}
         */
        a9.hasAttribute = function($node, attributeName){
            return $node.hasAttribute(attributeName);
        }
    } else{
        a9.hasAttribute = function($node, attributeName){
            return $node.getAttribute(attributeName) !== null;
        };
    }

    /**
     * insert DOM node after DOM node
     * @param {HTMLElement} $nodeAfterWhich
     * @param {HTMLElement} $insertNode
     */
    a9.insertAfter = function($nodeAfterWhich, $insertNode){
        var $nextSibling = $nodeAfterWhich.nextSibling;
        if ($nextSibling === null){
            $nodeAfterWhich.parentNode.appendChild($insertNode);
        } else{
            $nodeAfterWhich.parentNode.insertBefore($insertNode, $nodeAfterWhich.nextSibling);
        }
    };

    /**
     * insert DOM node before DOM node
     * @param {HTMLElement} $nodeBeforeWhich
     * @param {HTMLElement} $insertNode
     */
    a9.insertBefore = function($nodeBeforeWhich, $insertNode){
        var $previousSibling = $nodeBeforeWhich.previousSibling,
            $parent;
        if ($previousSibling === null){
            $parent = $nodeBeforeWhich.parentNode;
            $parent.insertBefore($insertNode, $parent.childNodes[0]);
        } else{
            $nodeBeforeWhich.parentNode.insertBefore($insertNode, $previousSibling);
        }
    };

    /**
     * insert DOM node first child in parent
     * @param {HTMLElement} $parent
     * @param {HTMLElement} $insertNode
     */
    a9.insertBeforeFirst = function($parent, $insertNode){
        var $childNodes = $parent.childNodes;
        if ($childNodes.length === 0){
            $parent.appendChild($insertNode);
        } else{
            $parent.insertBefore($insertNode, $childNodes[0]);
        }
    };


}(this, A9));
