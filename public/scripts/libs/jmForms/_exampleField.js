// its example
// all fields should support this methods and properties
// !don't forget remove from build!
JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers;

    function JMF_EXAMPE_Field(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmDefaultField = this;

        jmDefaultField.name = fieldModel.name;
        jmDefaultField.validatorDescriptor = fieldValidatorDescriptor;
        jmDefaultField.jmForm = jmForm;
        jmDefaultField.isInit = false;
        jmDefaultField._value = null;
        jmDefaultField._isIgnoreValueChange = false;
        jmDefaultField._valieType = null;

        jmDefaultField.$r = document.createDocumentFragment();
        jmDefaultField.$parent = null;

//        build and init
        if ($parent !== null){
            jmDefaultField.appendTo($parent);
        }
    }

    JMF_EXAMPE_Field.prototype = {
        set: function(value){
            var jmfDefaultField = this;
            jmfDefaultField._value = value;
            a9.generateCustomEvent(jmfDefaultField, 'valueChange', value);
            return value;
        },
        get: function(){
            var jmfDefaultField = this;
            //get value code
            return jmfDefaultField._value;
        },
        appendTo: function($parent){
            var jmfDefaultField = this;
            jmfDefaultField.$parent = $parent;
            $parent.appendChild(jmfDefaultField.$r);
            return jmfDefaultField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields._EXAMPLE_ = function(fieldData, $parent, fieldValidatorDescriptor, jmForm){
        return new JMF_EXAMPE_Field(fieldData, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});