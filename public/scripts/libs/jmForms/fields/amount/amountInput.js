JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        commonValueParsers = jmfHelpers.commonValueParsers,
        commonPrepareFieldValue = jmfHelpers.commonPrepareFieldValue;

    function JMFAmountInputField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmfAmountInputField = this,
            build,
            $input;

        jmfHelpers.extendFieldModel(fieldModel);

        jmfAmountInputField.name = fieldModel.name;
        jmfAmountInputField.jmForm = jmForm;
        jmfAmountInputField._value = null;
        jmfAmountInputField._isIgnoreValueChange = false;

        jmfAmountInputField.$parent = null;

        jmfAmountInputField._valueType = 'decimal';

        /*custom properties*/
        jmfAmountInputField._maskInsatance = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        commonPrepareFieldValue(jmfAmountInputField, fieldModel);

        //build
        build = tp(tmpls.amountInput, fieldModel);
        jmfAmountInputField.$r = build.r;
        jmfAmountInputField.$input = $input = build.input;

        //input init
        jmfAmountInputField.input = a9.input($input);
        a9.addCustomEvent($input, 'valueChange', inputValueChange, jmfAmountInputField);

        //prepare field validator and mask
        jmfAmountInputField.validatorDescriptor
            = jmfHelpers.prepareFieldValidator(jmfAmountInputField, fieldModel, fieldValidatorDescriptor, jmForm);
        jmfHelpers.prepareFieldMask(jmfAmountInputField, fieldModel);

//        build and init
        if ($parent !== null){
            jmfAmountInputField.appendTo($parent);
        }

        jmfAmountInputField.isInit = true;
    }

    function setValue(jmfAmountInputField, value, isFromInput){
        var resultValue,
            _value,
            isValueChanged;
        resultValue = commonValueParsers[jmfAmountInputField._valueType](jmfAmountInputField, value);
        _value = jmfAmountInputField._value;
        isValueChanged = _value !== resultValue;
        if (isValueChanged){
            jmfAmountInputField._value = resultValue;
            a9.generateCustomEvent(jmfAmountInputField, 'valueChange', resultValue);
        }
        if (isValueChanged && !isFromInput){
            jmfAmountInputField._isIgnoreValueChange = true;
            jmfAmountInputField.$input.value = resultValue;
        }
        return resultValue;
    }

    function inputValueChange(){
        var jmfAmountInputField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmfAmountInputField.$input);
        if (!jmfAmountInputField._isIgnoreValueChange){
            setValue(jmfAmountInputField, realValue, true);
        } else{
            jmfAmountInputField._isIgnoreValueChange = false;
        }
    }

    JMFAmountInputField.prototype = {
        set: function(value){
            var jmfAmountInputField = this;
            return setValue(jmfAmountInputField, value, false);
        },
        get: function(){
            var jmfAmountInputField = this;
            //get value code
            return jmfAmountInputField._value;
        },
        appendTo: function($parent){
            var jmfAmountInputField = this;
            jmfAmountInputField.$parent = $parent;
            $parent.appendChild(jmfAmountInputField.$r);
            return jmfAmountInputField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.amount = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFAmountInputField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});