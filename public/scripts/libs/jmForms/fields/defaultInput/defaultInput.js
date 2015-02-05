JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        commonValueParsers = jmfHelpers.commonValueParsers,
        commonPrepareFieldValue = jmfHelpers.commonPrepareFieldValue;

    function JMFDefaultInputField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmDefaultInputField = this,
            build,
            $input;

        jmfHelpers.extendFieldModel(fieldModel);

        jmDefaultInputField.name = fieldModel.name;
        jmDefaultInputField.jmForm = jmForm;
        jmDefaultInputField._value = null;
        jmDefaultInputField._isIgnoreValueChange = false;

        jmDefaultInputField.$parent = null;

        jmDefaultInputField._valueType = fieldModel.valueType;

        /*custom properties*/
        jmDefaultInputField._maskInsatance = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        commonPrepareFieldValue(jmDefaultInputField, fieldModel);

        //build
        build = tp(tmpls.defaultInput, fieldModel);
        jmDefaultInputField.$r = build.r;
        jmDefaultInputField.$input = $input = build.input;

        //input init
        jmDefaultInputField.input = a9.input($input);
        a9.addCustomEvent($input, 'valueChange', inputValueChange, jmDefaultInputField);

        //prepare field validator and mask
        jmDefaultInputField.validatorDescriptor
            = jmfHelpers.prepareFieldValidator(jmDefaultInputField, fieldModel, fieldValidatorDescriptor, jmForm);
        jmfHelpers.prepareFieldMask(jmDefaultInputField, fieldModel);

//        build and init
        if ($parent !== null){
            jmDefaultInputField.appendTo($parent);
        }

        jmDefaultInputField.isInit = true;
    }

    function setValue(jmDefaultInputField, value, isFromInput){
        var resultValue,
            _value,
            isValueChanged;
        resultValue = commonValueParsers[jmDefaultInputField._valueType](jmDefaultInputField, value);
        _value = jmDefaultInputField._value;
        isValueChanged = _value !== resultValue;
        if (isValueChanged){
            jmDefaultInputField._value = resultValue;
            a9.generateCustomEvent(jmDefaultInputField, 'valueChange', resultValue);
        }
        if (isValueChanged && !isFromInput){
            jmDefaultInputField._isIgnoreValueChange = true;
            jmDefaultInputField.$input.value = resultValue;
        }
        return resultValue;
    }

    function inputValueChange(){
        var jmDefaultInputField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmDefaultInputField.$input);
        if (!jmDefaultInputField._isIgnoreValueChange){
            setValue(jmDefaultInputField, realValue, true);
        } else{
            jmDefaultInputField._isIgnoreValueChange = false;
        }
    }

    JMFDefaultInputField.prototype = {
        set: function(value){
            var jmDefaultInputField = this;
            return setValue(jmDefaultInputField, value, false);
        },
        get: function(){
            var jmDefaultInputField = this;
            //get value code
            return jmDefaultInputField._value;
        },
        appendTo: function($parent){
            var jmDefaultInputField = this;
            jmDefaultInputField.$parent = $parent;
            $parent.appendChild(jmDefaultInputField.$r);
            return jmDefaultInputField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.defaultInput = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFDefaultInputField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});