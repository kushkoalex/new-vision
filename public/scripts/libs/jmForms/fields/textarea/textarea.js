JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        commonValueParsers = jmfHelpers.commonValueParsers,
        commonPrepareFieldValue = jmfHelpers.commonPrepareFieldValue;

    function JMFTextareaField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmTextareaField = this,
            build,
            $textarea;

        jmfHelpers.extendFieldModel(fieldModel);

        jmTextareaField.name = fieldModel.name;
        jmTextareaField.jmForm = jmForm;
        jmTextareaField._value = null;
        jmTextareaField._isIgnoreValueChange = false;

        jmTextareaField.$parent = null;

        jmTextareaField._valueType = fieldModel.valueType;

        /*custom properties*/
        jmTextareaField._maskInsatance = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        commonPrepareFieldValue(jmTextareaField, fieldModel);

        //build
        build = tp(tmpls.defaultTextarea, fieldModel);
        jmTextareaField.$r = build.r;
        jmTextareaField.$input = $textarea = build.textarea;

        //input init
        jmTextareaField.input = a9.input($textarea);
        a9.addCustomEvent($textarea, 'valueChange', textareaValueChange, jmTextareaField);

        //prepare field validator and mask
        jmTextareaField.validatorDescriptor
            = jmfHelpers.prepareFieldValidator(jmTextareaField, fieldModel, fieldValidatorDescriptor, jmForm);
        jmfHelpers.prepareFieldMask(jmTextareaField, fieldModel);

//        build and init
        if ($parent !== null){
            jmTextareaField.appendTo($parent);
        }

        jmTextareaField.isInit = true;
    }

    function setValue(jmTextareaField, value, isFromInput){
        var resultValue,
            _value,
            isValueChanged;
        resultValue = commonValueParsers[jmTextareaField._valueType](jmTextareaField, value);
        _value = jmTextareaField._value;
        isValueChanged = _value !== resultValue;
        if (isValueChanged){
            jmTextareaField._value = resultValue;
            a9.generateCustomEvent(jmTextareaField, 'valueChange', resultValue);
        }
        if (isValueChanged && !isFromInput){
            jmTextareaField._isIgnoreValueChange = true;
            jmTextareaField.$input.value = resultValue;
        }
        return resultValue;
    }

    function textareaValueChange(){
        var jmTextareaField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmTextareaField.$input);
        if (!jmTextareaField._isIgnoreValueChange){
            setValue(jmTextareaField, realValue, true);
        } else{
            jmTextareaField._isIgnoreValueChange = false;
        }
    }

    JMFTextareaField.prototype = {
        set: function(value){
            var jmTextareaField = this;
            return setValue(jmTextareaField, value, false);
        },
        get: function(){
            var jmTextareaField = this;
            //get value code
            return jmTextareaField._value;
        },
        appendTo: function($parent){
            var jmTextareaField = this;
            jmTextareaField.$parent = $parent;
            $parent.appendChild(jmTextareaField.$r);
            return jmTextareaField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.textarea = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFTextareaField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});
