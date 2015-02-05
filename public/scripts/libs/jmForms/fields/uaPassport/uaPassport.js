JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        masking = a9.masking,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        commonValueParsers = jmfHelpers.commonValueParsers,
        commonPrepareFieldValue = jmfHelpers.commonPrepareFieldValue,
        seriesInputValueLength = 2,
        numberInputValueLength = 6;

    function uaPassport($input, $seriesInput, $numberInput){
        var isSeriesFocused = false,
            isNumberFocused = false,
            passportMultiInput;

        masking.make($seriesInput, 'ukrainianPassportSeries', 'change', true);
        masking.make($numberInput, 'ukrainianPassportNumber', 'change', true);

        a9.addEvent($seriesInput, 'focus', function(){
            isSeriesFocused = true;
        });
        a9.addEvent($numberInput, 'focus', function(){
            isNumberFocused = true;
        });

        function validatePassport(){
            a9.generateCustomEvent($input, 'fictionBlur');
        }

        function seriesBlur(){
            isSeriesFocused = false;
            if (!isNumberFocused){
                validatePassport();
            }

        }

        function numberBlur(){
            isNumberFocused = false;
            if (!isSeriesFocused){
                validatePassport();
            }
        }

        function updateValue(value){
            $input.value = value;
        }

        a9.addEvent($seriesInput, 'blur', function(){
            global.setTimeout(seriesBlur, 1);
        });
        a9.addEvent($numberInput, 'blur', function(){
            global.setTimeout(numberBlur, 1);
        });

        passportMultiInput = a9.multiInput([$seriesInput, $numberInput], [seriesInputValueLength, numberInputValueLength]);
        a9.addCustomEvent(passportMultiInput, 'valueChange', updateValue);
    }

    function JMFUAPassportField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmUAPassportField = this,
            build,
            $input,
            $series,
            $number;

        jmfHelpers.extendFieldModel(fieldModel);

        jmUAPassportField.name = fieldModel.name;
        jmUAPassportField.jmForm = jmForm;
        jmUAPassportField._value = null;
        jmUAPassportField._isIgnoreValueChange = false;

        jmUAPassportField.$parent = null;

        jmUAPassportField._valueType = fieldModel.valueType;

        /*custom properties*/
        jmUAPassportField._maskInsatance = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        commonPrepareFieldValue(jmUAPassportField, fieldModel);

        //build
        build = tp(tmpls.uaPassport, fieldModel);
        jmUAPassportField.$r = build.r;
        $series = build.series;
        $number = build.number;
        jmUAPassportField.$input = $input = build.passportValue;
        uaPassport($input, $series, $number);

        //input init
        a9.input($series);
        a9.input($number);
        jmUAPassportField.input = a9.input($input);
        a9.addCustomEvent($input, 'valueChange', inputValueChange, jmUAPassportField);

        //prepare field validator and mask
        fieldValidatorDescriptor.e = $number;
        jmUAPassportField.validatorDescriptor
            = jmfHelpers.prepareFieldValidator(jmUAPassportField, fieldModel, fieldValidatorDescriptor, jmForm);
        jmfHelpers.prepareFieldMask(jmUAPassportField, fieldModel);

//        build and init
        if ($parent !== null){
            jmUAPassportField.appendTo($parent);
        }

        jmUAPassportField.isInit = true;
    }

    function setValue(jmUAPassportField, value, isFromInput){
        var resultValue,
            _value,
            isValueChanged;
        resultValue = commonValueParsers[jmUAPassportField._valueType](jmUAPassportField, value);
        _value = jmUAPassportField._value;
        isValueChanged = _value !== resultValue;
        if (isValueChanged){
            jmUAPassportField._value = resultValue;
            a9.generateCustomEvent(jmUAPassportField, 'valueChange', resultValue);
        }
        if (isValueChanged && !isFromInput){
            jmUAPassportField._isIgnoreValueChange = true;
            jmUAPassportField.$input.value = resultValue;
        }
        return resultValue;
    }

    function inputValueChange(){
        var jmUAPassportField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmUAPassportField.$input);
        if (!jmUAPassportField._isIgnoreValueChange){
            setValue(jmUAPassportField, realValue, true);
        } else{
            jmUAPassportField._isIgnoreValueChange = false;
        }
    }

    JMFUAPassportField.prototype = {
        set: function(value){
            var jmUAPassportField = this;
            return setValue(jmUAPassportField, value, false);
        },
        get: function(){
            var jmUAPassportField = this;
            //get value code
            return jmUAPassportField._value;
        },
        appendTo: function($parent){
            var jmUAPassportField = this;
            jmUAPassportField.$parent = $parent;
            $parent.appendChild(jmUAPassportField.$r);
            return jmUAPassportField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.uaPassport = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFUAPassportField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});
