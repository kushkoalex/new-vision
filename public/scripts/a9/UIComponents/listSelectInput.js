// todo add doc
// todo fix destructor
(function(a9, global) {

    function inputFocus($input){
        $input.focus();
        a9.cursorPosition.set($input, $input.value.length);
    }

    /** Выпадающий список элементов, значения которых при клике присваиваваются инпуту
     * @param {HTMLElement} $object
     * @param {HTMLElement} $input   текстовый инпут, на который будет вешаться селект
     * @param {HTMLElement} $trigger элемент, по которому открывается/скрывается список'
     */
    a9.listSelectInput = function ($object, $input, $trigger) {
        var $options,
            eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
            isOpenedList = false,
            $body = document.body,
            $inputVisual = a9.getParentByClass($input, 'jsVisualInput'),
            isPositionSet = false,
            valueListeners = [],
            i,
            u;

        a9.addEvent(global, 'resize', function(){
            updateListPosition($object, $inputVisual);
        });

        function setValue(value){
            for (i = valueListeners.length; i--;) {
                valueListeners[i](value);
            }
        }

        function select() {
            selectOption(this);
        }

        function selectOption(option) {
            setValue(option.getAttribute('data-value'));
            closeList();
            inputFocus($input);
        }

        function updateListPosition($object, $inputVisual){
            $object.style.top = (a9.getPositionY($inputVisual) + $inputVisual.offsetHeight) + 'px';
            $object.style.left = a9.getPositionX($inputVisual) + 'px';
        }

        function openList(e) {
            if (isOpenedList) {
                closeList();
            } else {
                isOpenedList = true;
                if (!isPositionSet){
                    isPositionSet = true;
                    updateListPosition($object, $inputVisual);
                }
                a9.addClass($object, 'isOpened');
                a9.addClass($inputVisual, 'isListSelectInputOpened');
                inputFocus($input);
            }
        }

        function onBodyClick(e) {
            if (isOpenedList && !a9.testParentOf(e.target, $object) && (e.target !== $trigger)) {
                closeList();
            }
        }

        function closeList() {
            isOpenedList = false;
            a9.removeClass($object, 'isOpened');
            a9.removeClass($inputVisual, 'isListSelectInputOpened');
        }

        // init
        if ($object.a9_isListSelectInputInit === u) {
            $options = a9.$c('jsListSelectInputOption', $object);
            for (i = $options.length; i--;) {
                a9.addEvent($options[i], eventOnPointerEnd, select);
            }

            a9.addEvent($trigger, eventOnPointerEnd, openList);
            a9.addEvent($body, eventOnPointerEnd, onBodyClick);

            $object.a9_isListSelectInputInit = true;
            a9.addClass($object, 'isInit');
        }

        // destructor
        return {
            destructor: function (onDestruction) {
                a9.removeEvent($trigger, eventOnPointerEnd, openList);
                for (i = $options.length; i--;) {
                    a9.removeEvent($options[i], eventOnPointerEnd, select);
                }
                a9.removeEvent($body, eventOnPointerEnd, onBodyClick);
                $object = a9 = $options = eventOnPointerEnd = isOpenedList = elements = i = u = select = selectOption = openList = closeList = onBodyClick = null;
                if (typeof onDestruction === 'function') {
                    onDestruction();
                }
            },
            addValueListener: function(valueListener){
                valueListeners.push(valueListener);
            }
        }
    };
})(A9, window);
