JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers;

    function JMFDefaultBooleanField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmDefaultBooleanField = this,
            build,
            $checkbox,
            isChecked;
        
        jmDefaultBooleanField.name = fieldModel.name;
        jmDefaultBooleanField.jmForm = jmForm;

        jmDefaultBooleanField._value = isChecked = (fieldModel.value === true) || (fieldModel.defaultValue === true);
        jmDefaultBooleanField._valueType = 'boolean';

        jmDefaultBooleanField._isIgnoreValueChange = false;

        jmDefaultBooleanField.$parent = null;

        //build
        fieldModel.isChecked = isChecked;
        build = tp(tmpls.defaultBoolean, fieldModel);
        jmDefaultBooleanField.$r = build.r;
        jmDefaultBooleanField.$input = $checkbox = build.checkbox;

        //checkbox init
        jmDefaultBooleanField.checkbox = a9.checkbox($checkbox);
        a9.addCustomEvent($checkbox, 'checkedChange', checkedChange, jmDefaultBooleanField);

        //todo
        //prepare field validator and mask
        jmDefaultBooleanField.validatorDescriptor
            = jmfHelpers.prepareFieldValidator(jmDefaultBooleanField, fieldModel, fieldValidatorDescriptor, jmForm);

//        build and init
        if ($parent !== null){
            jmDefaultBooleanField.appendTo($parent);
        }

        jmDefaultBooleanField.isInit = true;
    }

    function checkedChange(isChecked){
        var jmDefaultBooleanField = this;
        if (!jmDefaultBooleanField._isIgnoreValueChange){
            setValue(jmDefaultBooleanField, isChecked, true);
        } else{
            jmDefaultBooleanField._isIgnoreValueChange = false;
        }
    }

    function setValue(jmDefaultBooleanField, isChecked, isFromCheckbox){
        var _value,
            isValueChanged;
        _value = jmDefaultBooleanField._value;
        isValueChanged = _value !== isChecked;
        if (isValueChanged){
            jmDefaultBooleanField._value = isChecked;
            a9.generateCustomEvent(jmDefaultBooleanField, 'valueChange', isChecked);
        }
        if (isValueChanged && !isFromCheckbox){
            jmDefaultBooleanField._isIgnoreValueChange = true;
            jmDefaultBooleanField.$input.checked = isChecked;
        }
        return isChecked;
    }

    JMFDefaultBooleanField.prototype = {
        set: function(value){
            var jmDefaultBooleanField = this;
            return setValue(jmDefaultBooleanField, value, false);
        },
        get: function(){
            var jmDefaultBooleanField = this;

            return jmDefaultBooleanField._value;
        },
        appendTo: function($parent){
            var jmDefaultBooleanField = this;
            jmDefaultBooleanField.$parent = $parent;
            $parent.appendChild(jmDefaultBooleanField.$r);
            return jmDefaultBooleanField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.defaultBoolean = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFDefaultBooleanField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});
