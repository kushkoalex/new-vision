/*
    template example:
    (function(vib){
        var tmpls = vib.tmpls,
            l10n = vib.global.A9.l10n;
        tmpls.vSelect = function(data){
            var optionsData = data.options,
                vSelectReal,
                u;

            vSelectReal = {c: 'jsVSelectReal', C: [
                {c: 'icon'},
                {c: 'jsVSelectList', n: 'options', C: tmpls.vSelectOptionsList(data)}
            ]};

            if (data.n !== u) {
                vSelectReal.n = ['vSelect', data.n];
            } else {
                vSelectReal.n = 'vSelect';
            }

            return {c: 'default-visual-select-wrapper jsVSelectWrapper' + (data.c !== u ? ' ' + data.c : ''), C:
                vSelectReal
            };
        };

        tmpls.vSelectOptionsList = function(data){
            var selected = data.selected,
                optionsData = data.options,
                options = [],
                attributes,
                i,
                iMax;
            for (i = 0, iMax = optionsData.length; i < iMax; i += 1) {
                attributes = {'data-value': optionsData[i].value};
                if (optionsData[i].value === selected) {
                    attributes.selected = 'selected';
                }
                options.push({c: 'jsVSelectOption', a: attributes, t: optionsData[i].t || l10n(optionsData[i].l10n)});
            }
            return options;
        };
    }(VIB));
 */

// todo refactor
// todo add doc
(function(a9) {
    a9.vSelectExpandEvent = function ($vSelect, valuePars) {
        var valueCache,
            u;
        if (!('a9_vSelectExpandEventsDestructor' in $vSelect)) {
            valueCache = $vSelect.getAttribute('data-value');
            function check() {
                if (valueCache !== $vSelect.getAttribute('data-value')) {
                    if (valuePars !== u) {
                        valueCache = valuePars($vSelect.getAttribute('data-value'), $vSelect);
                        $vSelect.setAttribute('data-value', valueCache);
                    } else {
                        valueCache = $vSelect.getAttribute('data-value');
                    }
                    a9.generateCustomEvent($vSelect, '__valueChange', valueCache);
                }
            }

            $vSelect.a9_setValueParse = function (mask) {
                valuePars = mask;
            };
            $vSelect.a9_setValue = function (value) {
                $vSelect.setAttribute('data-value', value);
                check();
            };
//            a9.$p.set($vSelect, 'isExpandEvents', true);
            a9.repeatedInspections.add(check);
            $vSelect.a9_vSelectExpandEventsDestructor = function (onDestruction) {
                a9.repeatedInspections.remove(check, function () {
//                    a9.$p.del($vSelect, 'isExpandEvents');
                    delete $vSelect.a9_vSelectExpandEventsDestructor;
                    delete $vSelect.a9_setValueParse;
                    delete $vSelect.a9_setValue;
                    a9 = valueCache = check = null;
                    if (typeof onDestruction === 'function') {
                        onDestruction();
                    }
                });
            };
        }
        return $vSelect.a9_vSelectExpandEventsDestructor;
    };

    /**
     * Кастомный ненастоящий селект
     * @param {HTMLElement} object
     * @param {HTMLElement} vSelectWrapper (необязательный) обёртка для которой будут ставится классы-статусы
     */

    a9.vSelect = function (object, vSelectWrapper) {
        var expandEventsDestructor,
            $currentValue,
            $wrapper,
            $options,
            eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
            selectedOptionClass = 'isVSelectOptionSelected',
            option,
            $optionsByValue = {},
            $optionsList,
            selectedOption,
            isOpenedList = false,
            elements,
            $body = document.body,
            i,
            u;

        //        works functions
        //    function disabled(isDisabled){
        //        isDisabled ? that.addClass($wrapper, 'isDisabled') : that.removeClass($wrapper, 'isDisabled');
        //    }

        function updateCurrentOption() {
            selectOption($optionsByValue[object.getAttribute('data-value')]);
        }

        function select() {
            selectOption(this);
        }

        function selectOption(option) {
            if (selectedOption !== option) {
                if (selectedOption !== u) {
                    a9.removeClass(selectedOption, selectedOptionClass);
                }
                selectedOption = option;
                a9.addClass(option, selectedOptionClass);
                a9.getTextNode($currentValue).nodeValue = a9.getText(option);
                object.setAttribute('data-value', option.getAttribute('data-value'));
                closeList();
            }
        }

        function openList() {
            if (isOpenedList) {
                closeList();
            } else {
                isOpenedList = true;
                a9.addClass($wrapper, 'isOpened');
            }
        }

        function onBodyClick(e) {
            if (isOpenedList && !a9.testParentOf(e.target, $wrapper)) {
                closeList();
            }
        }

        function closeList() {
            isOpenedList = false;
            a9.removeClass($wrapper, 'isOpened');
        }

        if (object.a9_isVSelectInit === u) {

            //        wrapper search
            $wrapper = vSelectWrapper || a9.getParentByClass(object, 'jsVSelectWrapper');

            elements = a9.$cs(object, 'jsVSelectOption', 'jsVSelectList');
            $options = elements.jsVSelectOption;
            $optionsList = elements.jsVSelectList[0];

            $currentValue = document.createElement('div');
            $currentValue.className = 'jsVSelectSelected';
            object.insertBefore($currentValue, $optionsList);
            a9.addEvent($currentValue, eventOnPointerEnd, openList);

            for (i = $options.length; i--;) {
                option = $options[i];
                if (option.hasAttribute('selected')) {
                    selectOption(option);
                }
                $optionsByValue[option.getAttribute('data-value')] = option;
                a9.addEvent(option, eventOnPointerEnd, select);
            }
            if (selectedOption === u) {
                selectOption($options[0]);
            }

            a9.addEvent($body, eventOnPointerEnd, onBodyClick);

            //        expand events check and init if events hasn’t expand
            expandEventsDestructor = a9.vSelectExpandEvent(object);

            //        value change event
            a9.addCustomEvent(object, '__valueChange', updateCurrentOption);

            // todo disabled change
            //        if (object.hasAttribute('disabled')){
            //            disabled(true);
            //        }
            //        that.addCustomEvent(object, '__disabledChange', disabled);

            //        init flags
            object.a9_isVSelectInit = true;
            a9.addClass($wrapper, 'isInit');
        }

        //        destructor
        return function (onDestruction) {
            if (typeof expandEventsDestructor === 'function') {
                expandEventsDestructor();
            }
            a9.removeEvent($currentValue, eventOnPointerEnd, openList);
            for (i = $options.length; i--;) {
                a9.removeEvent($options[i], eventOnPointerEnd, select);
            }
            a9.removeEvent($body, eventOnPointerEnd, onBodyClick);
            a9.removeCustomEvent(object, '__valueChange', updateCurrentOption);
            //        that.removeCustomEvent(object, '__disabledChange', disabled);
            object = vSelectWrapper = a9 = expandEventsDestructor = $currentValue = $wrapper = $options = eventOnPointerEnd = selectedOptionClass = option = $optionsByValue = $optionsList = selectedOption = isOpenedList = elements = i = u = updateCurrentOption = select = selectOption = openList = closeList = onBodyClick = null;
            if (typeof onDestruction === 'function') {
                onDestruction();
            }
        }
    };
})(A9);
