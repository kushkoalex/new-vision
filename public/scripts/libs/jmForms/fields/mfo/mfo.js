JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        mfoList = null,
        isMFOSend = false,
        numbersRegExp = /\D/g;

    function JMFMFOField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmfMFOField = this,
            build,
            $input;

        jmfHelpers.extendFieldModel(fieldModel);

        jmfMFOField.name = fieldModel.name;
        jmfMFOField.jmForm = jmForm;

        jmfMFOField._value = fieldModel.value || null;
        jmfMFOField._valueType = fieldModel.valueType;

        jmfMFOField._isIgnoreValueChange = false;

        jmfMFOField.$parent = null;


        /*custom properties*/
        jmfMFOField._maskInsatance = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        prepareFieldValue(jmfMFOField, fieldModel);

        //build
        build = tp(tmpls.mfo, fieldModel);
        jmfMFOField.$r = build.r;
        jmfMFOField.$input = $input = build.input;
        jmfMFOField._$bankNameWrapper = build.bankNameWrapper;
        jmfMFOField._$bankNameDefaultText = build.bankNameDefaultText;
        jmfMFOField._$bankNameNone = null;
        jmfMFOField._$bankName = null;
        jmfMFOField._$bankNameText = null;
        //0 - default 1 — bank name 2 — not found
        jmfMFOField._showedBankNameState = 0;

        //input init
        jmfMFOField.input = a9.input($input);
        a9.addCustomEvent($input, 'valueChange', inputValueChange, jmfMFOField);

        //prepare field validator and mask
        jmfMFOField.validatorDescriptor
            = jmfHelpers.prepareFieldValidator(jmfMFOField, fieldModel, fieldValidatorDescriptor, jmForm);
        jmfHelpers.prepareFieldMask(jmfMFOField, fieldModel);

//        build and init
        if ($parent !== null){
            jmfMFOField.appendTo($parent);
        }

        jmfMFOField.isInit = false;
        getMFOList(jmfMFOField);

    }

    function getMFOList(jmfMFOField){
        if (mfoList !== null){
            initMFOField(jmfMFOField);
        } else if (!isMFOSend){
            a9.getJSON(
                jmf.settings.dataPaths.mfo,
                onGetMFOSuccess,
                onGetMFOError,
                jmfMFOField
            )
        }
    }

    function onGetMFOSuccess(success){
        isMFOSend = false;
        mfoList = success;
        initMFOField(this);
    }

    function onGetMFOError(){
        isMFOSend = false;
        getMFOList(this);
    }

    function initMFOField(jmfMFOField){
        jmfMFOField.isInit = true;
        showBankName(jmfMFOField);
        a9.generateCustomEvent(jmfMFOField, 'init', jmfMFOField.name);
    }


    function valueParser(jmfMFOField, value){
        if (value === null){
            return '';
        }
        return value.replace(numbersRegExp, '');
    }

    function prepareFieldValue(jmField, fieldModel){
        var defaultValue,
            u;
        if (!('value' in fieldModel) || (fieldModel.value === null)){
            defaultValue = fieldModel.defaultValue;
            if (defaultValue !== u){
                fieldModel._value = valueParser(jmField, defaultValue);
                fieldModel.value = jmField.get();
            } else{
                fieldModel.value = '';
            }
        }
    }

    function setValue(jmfMFOField, value, isFromInput){
        var resultValue,
            _value,
            isValueChanged;
        resultValue = valueParser(jmfMFOField, value);
        _value = jmfMFOField._value;
        isValueChanged = _value !== resultValue;
        if (isValueChanged){
            jmfMFOField._value = resultValue;
            a9.generateCustomEvent(jmfMFOField, 'valueChange', resultValue);
        }
        if (isValueChanged && !isFromInput){
            jmfMFOField._isIgnoreValueChange = true;
            jmfMFOField.$input.value = resultValue;
        }
        showBankName(jmfMFOField);
        return resultValue;
    }

    function inputValueChange(){
        var jmfMFOField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmfMFOField.$input);
        if (!jmfMFOField._isIgnoreValueChange){
            setValue(jmfMFOField, realValue, true);
        } else{
            jmfMFOField._isIgnoreValueChange = false;
        }
    }

    function showBankName(jmfMFOField){
        var _value,
            currentBank;
        if (jmfMFOField.isInit){
            _value = jmfMFOField._value;
            if (_value === null){
                setEmptyBankName(jmfMFOField);
            } else{
                if (_value.length === 6){
                    currentBank = a9.getObjectOfList(mfoList, 'mfo', _value);
                    if (currentBank === null){
                        setBankNameNone(jmfMFOField);
                    } else{
                        setBankName(jmfMFOField, currentBank.name);
                    }
                } else{
                    setEmptyBankName(jmfMFOField);
                }
            }
        }
    }

    function setEmptyBankName(jmfMFOField){
        if (jmfMFOField._showedBankNameState !== 0){
            a9.removeContent(jmfMFOField._$bankNameWrapper);
            jmfMFOField._$bankNameWrapper.appendChild(jmfMFOField._$bankNameDefaultText);
            jmfMFOField._showedBankNameState = 0;
        }
    }

    function setBankNameNone(jmfMFOField){
        if (jmfMFOField._showedBankNameState !== 2){
            if (jmfMFOField._$bankNameNone === null){
                jmfMFOField._$bankNameNone = tp(tmpls.mfoBankNameNone).bankNameNone;
            }
            a9.removeContent(jmfMFOField._$bankNameWrapper);
            jmfMFOField._$bankNameWrapper.appendChild(jmfMFOField._$bankNameNone);
            jmfMFOField._showedBankNameState = 2;
        }
    }

    function setBankName(jmfMFOField, bankName){
        if (jmfMFOField._showedBankNameState === 1){
            jmfMFOField._$bankNameText.nodeValue = bankName;
            jmfMFOField._$bankName.setAttribute('title', bankName);
        } else{
            if (jmfMFOField._$bankNameText === null){
                jmfMFOField._$bankName = tp(tmpls.mfoBankName).bankName;
                jmfMFOField._$bankNameText = a9.getTextNode(jmfMFOField._$bankName);
            }
            jmfMFOField._$bankNameText.nodeValue = bankName;
            jmfMFOField._$bankName.setAttribute('title', bankName);
            a9.removeContent(jmfMFOField._$bankNameWrapper);
            jmfMFOField._$bankNameWrapper.appendChild(jmfMFOField._$bankName);
            jmfMFOField._showedBankNameState = 1;
        }
    }

    JMFMFOField.prototype = {
        set: function(value){
            var jmfMFOField = this;
            return setValue(jmfMFOField, value, false);
        },
        get: function(){
            var jmfMFOField = this;
            //get value code
            return jmfMFOField._value;
        },
        appendTo: function($parent){
            var jmfMFOField = this;
            jmfMFOField.$parent = $parent;
            $parent.appendChild(jmfMFOField.$r);
            return jmfMFOField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.mfo = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFMFOField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});