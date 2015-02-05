JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        document = global.document,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        $body,
        calendarField;

    // temporary
    // todo refactor
    (function(){
        var dateToDDMMYYYY = a9.dateToDDMMYYYY,
            dateFromDDMMYYYY = a9.dateFromDDMMYYYY,
            deviceInfo = a9.deviceInfo,
            eventOnPointerDown = deviceInfo.eventOnPointerDown,
            eventOnPointerEnd = deviceInfo.eventOnPointerEnd,

            calendarsFields = [],
            counter = 0,

            calendarFieldPrototype,

            activeCalendarField = null,

            calendarFieldAttribute = 'data-vib-calendar-field-element',
            hasCalendarCSSClass = 'inputHasCalendar',
            activeCalendarCSSClass = 'isInputCalendarActive',
            inputValidationParam = 'swf01_validation_inputSourceNode',

            clearDateReg = /[^0-9]/g,
            $documentElement,

            isInit = false;

        function CalendarField($input, fieldModel){
            var calendarField = this,
                $visualInput,
                $calendarWrapper,
                $indicator,
                calendarFieldID = '' + counter,
                minDate,
                maxDate,
                currentDate = Date.now(),
                calendar,
                $calendarClose,
                build;

            $body = $body || document.body;

    //        dates range processing
            if ('minDate' in fieldModel){
                minDate = a9.dateFromAPIDate(fieldModel.minDate).getTime();
            } else{
                minDate = (new Date(1900, 0, 1)).getTime();
            }
            if ('maxDate' in fieldModel){
                maxDate = a9.dateFromAPIDate(fieldModel.maxDate).getTime();
            } else{
                maxDate = (new Date()).getTime();
            }
            calendarField.minDate = minDate;
            calendarField.maxDate = maxDate;
            if (maxDate < currentDate){
                currentDate = maxDate;
            } else if (minDate > currentDate){
                currentDate = minDate;
            }

            calendarField.currentDate = currentDate;

            calendarField.isActive = false;

            calendarField.$input = $input;
            $input.setAttribute(calendarFieldAttribute, calendarFieldID);
            a9.addCustomEvent($input, '__valueChange', inputValueChange, calendarField);

            $visualInput = a9.getParentByClass($input, 'jsVisualInput');
            calendarField.$visualInput = $visualInput;
            a9.addClass($visualInput, hasCalendarCSSClass);

            calendarField.$inputWrapper = a9.getParentByClass($visualInput, 'jsInputWrapper') || $visualInput;

            $indicator = tp(tmpls.calendarFieldIcon, $input.id, $visualInput).indicator;
            calendarField.$indicator = $indicator;
            $indicator.setAttribute(calendarFieldAttribute, calendarFieldID);
            a9.addEvent($indicator, eventOnPointerDown, blockBlurOnPointerDownOnIndicator);
            a9.addEvent($indicator, eventOnPointerEnd, toggleCalendar);

            build = tp(tmpls.calendarFieldCalendarWrapper);
            calendarField.$calendarWrapper = $calendarWrapper = build.r;
            calendarField.calendar = calendar = a9.calendar({
                tmpls: tmpls,
                prefix: 'jfm_',
                mode: 'chooseMonthYear',
                currentDate: currentDate,
                dateLimitFrom: minDate,
                dateLimitTo: maxDate,
                $parent: build.inner
            });
            $calendarClose = calendar.$close;
            $calendarClose.setAttribute(calendarFieldAttribute, calendarFieldID);
            a9.addEvent($calendarClose, eventOnPointerEnd, calendarClose);
            a9.addEvent(global, 'resize', function(){
                updateCalendarPosition($calendarWrapper, $visualInput);
            });
            a9.addCustomEvent(calendar, 'dateChange', calendarDateChange, calendarField);

            calendarsFields[counter] = calendarField;
            counter += 1;

        }

        function calendarClose(){
            hideCalendar(activeCalendarField);
        }

        function calendarDateChange(date){
            var calendarField = this;
            if (date.getTime() !== calendarField.currentDate){
                calendarField.currentDate = date.getTime();
                calendarField.$input.value = dateToDDMMYYYY(date);
            }
        }

        function inputValueChange(value){
            var calendarFiled = this,
                currentDate;
            value = value.replace(clearDateReg, '');
            if (value.length === 8){

                currentDate = dateFromDDMMYYYY(value).getTime();
                if (currentDate >= calendarFiled.maxDate){
                    currentDate = calendarFiled.maxDate;
                } else if (currentDate < currentDate.minDate){
                    currentDate = currentDate.minDate;
                }

                calendarFiled.currentDate = currentDate;
                if ((activeCalendarField === calendarFiled)
                    && (currentDate !== calendarFiled.calendar.getDate().getTime())){
                    calendarFiled.calendar.setDate(currentDate);
                }
            }
        }

        function blockBlurOnPointerDownOnIndicator(e){
            e.preventDefault();
            calendarsFields[+this.getAttribute(calendarFieldAttribute)].$input.focus();
        }


        function toggleCalendar(){
            var calendarField = calendarsFields[+this.getAttribute(calendarFieldAttribute)];
            if (calendarField.isShowed){
                hideCalendar(calendarField);
            } else{
                showCalendar(calendarField);
            }
        }

        calendarFieldPrototype = CalendarField.prototype;

        function hideCalendar(calendarField){
            var $inputWrapper = calendarField.$inputWrapper,
                $input = calendarField.$input;
            if (inputValidationParam in $input){
                $input[inputValidationParam].validate();
            }
            a9.removeClass($inputWrapper, activeCalendarCSSClass);
            $body.removeChild(calendarField.$calendarWrapper);
            activeCalendarField = null;
            calendarField.isShowed = false;
        }

        function updateCalendarPosition($object, $visualInput){
            $object.style.top = (a9.getPositionY($visualInput) + $visualInput.offsetHeight) + 'px';
            $object.style.left = (a9.getPositionX($visualInput) + $visualInput.offsetWidth) + 'px';
        }

        function showCalendar(calendarField){
            var $inputWrapper = calendarField.$inputWrapper,
                $object = calendarField.$calendarWrapper,
                $visualInput = calendarField.$visualInput;
            activeCalendarField = calendarField;
            updateCalendarPosition($object, $visualInput);
            $body.appendChild($object);
            calendarField.calendar.setDate(calendarField.currentDate);
            a9.addClass($inputWrapper, activeCalendarCSSClass);
            calendarField.isShowed = true;
        }

        calendarFieldPrototype.destructor = function(){
    //        todo
        };


        function onGlobalFocusChange(e){
            if (e.target !== $documentElement){
                hideCalendarIfLostFocus(e.target);
            }
        }
        function onGlobalClick(e){
            hideCalendarIfLostFocus(e.target);
        }

        function hideCalendarIfLostFocus($node){
            if (isActiveCalendarFieldLostFocus($node)){
                hideCalendar(activeCalendarField);
            }
        }

        function isActiveCalendarFieldLostFocus($node){
            return (activeCalendarField !== null) && ($node !== activeCalendarField.$input) && !a9.testParentOf($node, activeCalendarField.$inputWrapper) && !a9.testParentOf($node, activeCalendarField.$calendarWrapper)
        }

        calendarField = function($input, fieldModel){
            if (!isInit){
                $documentElement = document.documentElement;
                a9.addFocusInEvent($documentElement, onGlobalFocusChange);
                a9.addEvent($documentElement, eventOnPointerDown, onGlobalClick);
                isInit = true;
            }
            return new CalendarField($input, fieldModel);
        };
    })();

    function JMFCalendarDateField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmDefaultDateField = this,
            build,
            $input,
            dateValidator;

        jmfHelpers.extendFieldModel(fieldModel);

        jmDefaultDateField.name = fieldModel.name;
        jmDefaultDateField.jmForm = jmForm;

        jmDefaultDateField._value = null;
        jmDefaultDateField._valueType = fieldModel.valueType;

        jmDefaultDateField._isIgnoreValueChange = false;

        jmDefaultDateField.$parent = null;


        /*custom properties*/
        jmDefaultDateField._maskInsatance = null;
        jmDefaultDateField.calendar = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        prepareFieldValue(jmDefaultDateField, fieldModel);

        //build
        build = tp(tmpls.defaultInput, fieldModel);
        jmDefaultDateField.$r = build.r;
        jmDefaultDateField.$input = $input = build.input;

        // calendar
        calendarField($input, fieldModel);

        //input init
        jmDefaultDateField.input = a9.input($input);
        a9.addCustomEvent($input, 'valueChange', inputValueChange, jmDefaultDateField);

        //prepare field validator and mask
        jmDefaultDateField.validatorDescriptor
            = fieldValidatorDescriptor
                = jmfHelpers.prepareFieldValidator(jmDefaultDateField, fieldModel, fieldValidatorDescriptor, jmForm);

        dateValidator = {n: 'date', invalidMessages: {
            notExist: a9.l10n('jmf_validation_dateNotExist')
        }};
        if (fieldValidatorDescriptor === null){
            jmDefaultDateField.validatorDescriptor = {
                e: $input,
                on: fieldModel.validateOn,
                validators: [dateValidator]
            };
        } else{
            a9.validation.helpers.addValidatorToValidatorDescriptor(fieldValidatorDescriptor, dateValidator)
        }
        jmfHelpers.prepareFieldMask(jmDefaultDateField, fieldModel);

//        build and init
        if ($parent !== null){
            jmDefaultDateField.appendTo($parent);
        }

        jmDefaultDateField.isInit = true;
    }

    function valueParser(jmDefaultDateField, value){
        return value;
    }

    function prepareFieldValue(jmField, fieldModel){
        var defaultValue,
            u;
        if (('value' in fieldModel) || (fieldModel.value === null)){
            defaultValue = fieldModel.defaultValue;
            if (defaultValue !== u){
                jmField._value = valueParser(jmField, defaultValue);
                fieldModel.value = jmField.get();
            } else{
                fieldModel.value = '';
            }
        }
    }

    function setValue(jmDefaultDateField, value, isFromInput){
        var resultValue,
            _value,
            isValueChanged;
        resultValue = valueParser(jmDefaultDateField, value);
        _value = jmDefaultDateField._value;
        isValueChanged = _value !== resultValue;
        if (isValueChanged){
            jmDefaultDateField._value = resultValue;
            a9.generateCustomEvent(jmDefaultDateField, 'valueChange', resultValue);
        }
        if (isValueChanged && !isFromInput){
            jmDefaultDateField._isIgnoreValueChange = true;
            jmDefaultDateField.$input.value = resultValue;
        }
        return resultValue;
    }

    function inputValueChange(){
        var jmDefaultDateField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmDefaultDateField.$input);
        if (!jmDefaultDateField._isIgnoreValueChange){
            setValue(jmDefaultDateField, realValue, true);
        } else{
            jmDefaultDateField._isIgnoreValueChange = false;
        }
    }

    JMFCalendarDateField.prototype = {
        set: function(value){
            var jmDefaultInputField = this;
            return setValue(jmDefaultInputField, value, false);
        },
        get: function(){
            var jmDefaultDateField = this;
            //get value code
            return jmDefaultDateField._value;
        },
        appendTo: function($parent){
            var jmDefaultDateField = this;
            jmDefaultDateField.$parent = $parent;
            $parent.appendChild(jmDefaultDateField.$r);
            return jmDefaultDateField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.calendarDate = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFCalendarDateField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});
