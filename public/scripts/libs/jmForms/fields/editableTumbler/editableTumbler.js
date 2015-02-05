JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        commonValueParsers = jmfHelpers.commonValueParsers,
        commonPrepareFieldValue = jmfHelpers.commonPrepareFieldValue,
        readonlyCSSClass = 'jmfTumblerInputReadonly';

    function JMFTumblerField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmfTumblerField = this,
            build,
            $input,
            tumbler,
            isTumblerChecked;

        jmfHelpers.extendFieldModel(fieldModel);
        if ('isTumblerChecked' in fieldModel){
            isTumblerChecked = fieldModel.isTumblerChecked;
        } else{
            isTumblerChecked = true;
            fieldModel.isTumblerChecked = isTumblerChecked;
        }

        jmfTumblerField.name = fieldModel.name;
        jmfTumblerField.jmForm = jmForm;


        jmfTumblerField._value = null;
        jmfTumblerField._inputedValue = null;
        jmfTumblerField._defaultValue = fieldModel.defaultValue;
        jmfTumblerField._isIgnoreValueChange = false;
        jmfTumblerField._isTumblerChecked = null;
        jmfTumblerField._offValue = fieldModel.offValue || fieldModel.defaultValue;


        jmfTumblerField.$parent = null;

        jmfTumblerField._valueType = fieldModel.valueType;

        /*custom properties*/
        jmfTumblerField._maskInsatance = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        commonPrepareFieldValue(jmfTumblerField, fieldModel);
        jmfTumblerField._inputedValue = jmfTumblerField._value;

        //build
        build = tp(tmpls.editableTumbler, fieldModel);
        jmfTumblerField.$r = build.r;
        jmfTumblerField.$input = $input = build.input;
        jmfTumblerField.$inputWrapper = build.inputWrapper;

        jmfTumblerField.tumbler = tumbler = a9.tumbler(build.realTumbler);
        a9.addCustomEvent(tumbler, 'checkedChange', tumblerCheckedChange, jmfTumblerField);

        //input init
        jmfTumblerField.input = a9.input($input);
        a9.addCustomEvent($input, 'valueChange', inputValueChange, jmfTumblerField);


        jmfTumblerField.tumblerLogicalObject = a9.validation.helpers.logicalNodeObject(!isTumblerChecked);

        jmfTumblerField.validatorDescriptor = {T: 'node', validator: 'nodeOr', C: [
            {T: 'logical', logicalObject: jmfTumblerField.tumblerLogicalObject},
            jmfHelpers.prepareFieldValidator(jmfTumblerField, fieldModel, fieldValidatorDescriptor, jmForm)
        ]};

        jmfTumblerField.validatorDescriptor.e = jmfTumblerField.$inputWrapper;


        jmfHelpers.prepareFieldMask(jmfTumblerField, fieldModel, jmForm);


        tumblerChangeRender(jmfTumblerField, isTumblerChecked);

//        build and init
        if ($parent !== null){
            jmfTumblerField.appendTo($parent);
        }

        jmfTumblerField.isInit = true;
    }

    function setValue(jmfTumblerField, value, isFromInput){
        var resultValue,
            _value,
            isValueChanged;
        resultValue = commonValueParsers[jmfTumblerField._valueType](jmfTumblerField, value);
        _value = jmfTumblerField._value;
        isValueChanged = _value !== resultValue;
        if (isValueChanged){
            jmfTumblerField._value = resultValue;
            a9.generateCustomEvent(jmfTumblerField, 'valueChange', resultValue);
        }
        if (isValueChanged && !isFromInput){
            jmfTumblerField._isIgnoreValueChange = true;
            jmfTumblerField.$input.value = resultValue;
        }
        return resultValue;
    }

    function inputValueChange(){
        var jmfTumblerField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmfTumblerField.$input);
        if (!jmfTumblerField._isIgnoreValueChange){
            setValue(jmfTumblerField, realValue, true);
        } else{
            jmfTumblerField._isIgnoreValueChange = false;
        }
    }

    function tumblerCheckedChange(isTumblerChecked){
        var jmfTumblerField = this;
        jmfTumblerField.tumblerLogicalObject.setValid(!isTumblerChecked);
        tumblerChangeRender(jmfTumblerField, isTumblerChecked);
    }

    function tumblerChangeRender(jmfTumblerField, isTumblerChecked){
        if (jmfTumblerField._isTumblerChecked !== isTumblerChecked){
            if (isTumblerChecked){
                setValue(jmfTumblerField, jmfTumblerField._inputedValue, false);
                jmfTumblerField.$input.readOnly = false;
                a9.generateCustomEvent(jmfTumblerField.$input, '__readOnlyChange', false);
                a9.removeClass(jmfTumblerField.$inputWrapper, readonlyCSSClass);
            } else{
                jmfTumblerField._inputedValue = jmfTumblerField.get();
                setValue(jmfTumblerField, jmfTumblerField._offValue, false);
                jmfTumblerField.$input.readOnly = true;
                a9.generateCustomEvent(jmfTumblerField.$input, '__readOnlyChange', true);
                a9.addClass(jmfTumblerField.$inputWrapper, readonlyCSSClass);
            }
            jmfTumblerField._isTumblerChecked = isTumblerChecked;
        }
    }

    JMFTumblerField.prototype = {
        set: function(value){
            var jmfTumblerField = this;
            if(value==="0")
            {
                jmfTumblerField.tumbler.set(false);
            }
            else if (!jmfTumblerField._isTumblerChecked){
                jmfTumblerField.tumbler.set(true);
            }
            return setValue(jmfTumblerField, value, false);
        },
        get: function(){
            var jmfTumblerField = this;
            //get value code
            return jmfTumblerField._value;
        },
        appendTo: function($parent){
            var jmfTumblerField = this;
            jmfTumblerField.$parent = $parent;
            $parent.appendChild(jmfTumblerField.$r);
            return jmfTumblerField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.editableTumbler = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFTumblerField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});
