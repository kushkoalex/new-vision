JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers;

    function JMFDefaultDateField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmDefaultDateField = this,
            build,
            $input,
            calendar,
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

    JMFDefaultDateField.prototype = {
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

    jmf.fields.defaultDate = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFDefaultDateField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});