JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        tmpls = jmf.tmpls,
        jmfHelpers = jmf.helpers,
        codesList = null,
        isCodeSend = false;

    function JMFCountryCodeField(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        var jmfCountryCodeField = this,
            build,
            $visibleInput,
            $countryNameCode;

        jmfHelpers.extendFieldModel(fieldModel);

        jmfCountryCodeField.fieldModel = fieldModel;
        jmfCountryCodeField.name = fieldModel.name;
        jmfCountryCodeField.jmForm = jmForm;

        jmfCountryCodeField._value = null;
        jmfCountryCodeField._valueType = fieldModel.valueType;

        jmfCountryCodeField._isIgnoreValueChange = false;

        jmfCountryCodeField.$parent = null;


        /*custom properties*/
        jmfCountryCodeField._maskInsatance = null;
        /*custom properties end*/

        //prepare fieldDataForBuild
        prepareFieldValue(jmfCountryCodeField, fieldModel);

        //build
        build = tp(tmpls.countryCode, fieldModel);
        jmfCountryCodeField.$r = build.r;
        jmfCountryCodeField.$visibleInput = $visibleInput = build.countryName;
        jmfCountryCodeField.$input = $countryNameCode = build.countryCode;
        jmfCountryCodeField._$countryCodeWrapper = build.countryNameWrapper;
        jmfCountryCodeField._$countryCodeDefaultText = build.countryNameDefaultText;
        jmfCountryCodeField._$countryCodeNone = null;
        jmfCountryCodeField._$countryCode = null;
        jmfCountryCodeField._$countryCodeText = null;
        //0 - default 1 — country name 2 — not found
        jmfCountryCodeField._showedCountryCodeState = 0;

        //input init
        a9.input($visibleInput);
        jmfCountryCodeField.input = a9.input($countryNameCode);
        a9.addCustomEvent($visibleInput, 'valueChange', inputValueChange, jmfCountryCodeField);

        //prepare field validator and mask
        jmfCountryCodeField.validatorDescriptor
            = jmfHelpers.prepareFieldValidator(jmfCountryCodeField, fieldModel, fieldValidatorDescriptor, jmForm);
        jmfHelpers.prepareFieldMask(jmfCountryCodeField, fieldModel);

//        build and init
        if ($parent !== null){
            jmfCountryCodeField.appendTo($parent);
        }

        jmfCountryCodeField.isInit = false;
        getCountryCodeList(jmfCountryCodeField);

    }

    function getCountryCodeList(jmfCountryCodeField){
        if (codesList !== null){
            initCountryCodeField(jmfCountryCodeField);
        } else if (!isCodeSend){
            a9.getJSON(
                jmf.settings.dataPaths.countryCode,
                onGetCountryCodeSuccess,
                onGetCountryCodeError,
                jmfCountryCodeField
            )
        }
    }

    function onGetCountryCodeSuccess(success){
        isCodeSend = false;
        codesList = success;
        initCountryCodeField(this);
    }

    function onGetCountryCodeError(){
        isCodeSend = false;
        getCountryCodeList(this);
    }

    function initCountryCodeField(jmfCountryCodeField){
        initSuggests(jmfCountryCodeField);
        jmfCountryCodeField.isInit = true;
        showCountryCode(jmfCountryCodeField);
        a9.generateCustomEvent(jmfCountryCodeField, 'init', jmfCountryCodeField.name);
    }

    function initSuggests(jmfCountryCodeField){
        var fieldModel = jmfCountryCodeField.fieldModel,
            fieldName = jmfCountryCodeField.name,
            suggests,
            i;
        fieldModel.suggests = [];
        suggests = fieldModel.suggests;
        for (i = codesList.length; i--;) {
            suggests.push({
                id: i,
                type: "countryName",
                formSuggest: [
                    {name: fieldName, value: codesList[i].name}
                ],
                searchableFields: [
                    {name: fieldName, value: codesList[i].name}
                ]
            });
        }
    }

    function prepareFieldValue(jmField, fieldModel){
        var defaultValue,
            u;
        if (('value' in fieldModel) || (fieldModel.value === null)){
            defaultValue = fieldModel.defaultValue;
            if (defaultValue !== u){
                fieldModel._value = defaultValue;
                fieldModel.value = jmField.get();
            } else{
                fieldModel._value = null;
                fieldModel.value = '';
            }
        }
    }

    function setValue(jmfCountryCodeField, value, isFromInput){
        var _value,
            isValueChanged;
        _value = jmfCountryCodeField._value;
        isValueChanged = _value !== value;
        if (isValueChanged){
            jmfCountryCodeField._value = value === '' ? null : value;
            a9.generateCustomEvent(jmfCountryCodeField, 'valueChange', value);
        }
        if (isValueChanged && !isFromInput){
            jmfCountryCodeField._isIgnoreValueChange = true;
            jmfCountryCodeField.$visibleInput.value = value;
        }
        showCountryCode(jmfCountryCodeField);
        return value;
    }

    function inputValueChange(){
        var jmfCountryCodeField = this,
            realValue;
        realValue = jmfHelpers.getInputValue(jmfCountryCodeField.$visibleInput);
        if (!jmfCountryCodeField._isIgnoreValueChange){
            setValue(jmfCountryCodeField, realValue, true);
        } else{
            jmfCountryCodeField._isIgnoreValueChange = false;
        }
    }

    function showCountryCode(jmfCountryCodeField){
        var _value,
            currentCountry;
        if (jmfCountryCodeField.isInit){
            _value = jmfCountryCodeField._value;
            if (_value === null){
                setEmptyCountryName(jmfCountryCodeField);
            } else{
                currentCountry = a9.getObjectOfList(codesList, 'name', _value);
                if (currentCountry === null){
                    setCountryCodeNone(jmfCountryCodeField);
                } else{
                    setCountryCode(jmfCountryCodeField, currentCountry.code);
                }
            }
        }
    }

    function setEmptyCountryName(jmfCountryCodeField){
        if (jmfCountryCodeField._showedCountryCodeState !== 0){
            a9.removeContent(jmfCountryCodeField._$countryCodeWrapper);
            jmfCountryCodeField._$countryCodeWrapper.appendChild(jmfCountryCodeField._$countryCodeDefaultText);
            jmfCountryCodeField._showedCountryCodeState = 0;
        }
    }

    function setCountryCodeNone(jmfCountryCodeField){
        jmfCountryCodeField.$input.value = '';
        if (jmfCountryCodeField._showedCountryCodeState !== 2){
            if (jmfCountryCodeField._$countryCodeNone === null){
                jmfCountryCodeField._$countryCodeNone = tp(tmpls.countryCodeCountryNameNone).countryNameNone;
            }
            a9.removeContent(jmfCountryCodeField._$countryCodeWrapper);
            jmfCountryCodeField._$countryCodeWrapper.appendChild(jmfCountryCodeField._$countryCodeNone);
            jmfCountryCodeField._showedCountryCodeState = 2;
        }
    }

    function setCountryCode(jmfCountryCodeField, countryCode){
        jmfCountryCodeField.$input.value = countryCode;
        if (jmfCountryCodeField._showedCountryCodeState === 1){
            jmfCountryCodeField._$countryCodeText.nodeValue = countryCode;
            jmfCountryCodeField._$countryCode.setAttribute('title', countryCode);
        } else{
            if (jmfCountryCodeField._$countryCodeText === null){
                jmfCountryCodeField._$countryCode = tp(tmpls.countryCodeCountryName).countryName;
                jmfCountryCodeField._$countryCodeText = a9.getTextNode(jmfCountryCodeField._$countryCode);
            }
            jmfCountryCodeField._$countryCodeText.nodeValue = countryCode;
            jmfCountryCodeField._$countryCode.setAttribute('title', countryCode);
            a9.removeContent(jmfCountryCodeField._$countryCodeWrapper);
            jmfCountryCodeField._$countryCodeWrapper.appendChild(jmfCountryCodeField._$countryCode);
            jmfCountryCodeField._showedCountryCodeState = 1;
        }
    }

    JMFCountryCodeField.prototype = {
        set: function(value){
            var jmfCountryCodeField = this;
            return setValue(jmfCountryCodeField, value, false);
        },
        get: function(){
            var jmfCountryCodeField = this;
            //get value code
            return jmfCountryCodeField._value;
        },
        appendTo: function($parent){
            var jmfCountryCodeField = this;
            jmfCountryCodeField.$parent = $parent;
            $parent.appendChild(jmfCountryCodeField.$r);
            return jmfCountryCodeField;
        },
        destructor: function(){
//            todo
        }
    };

    jmf.fields.countryCode = function(fieldModel, $parent, fieldValidatorDescriptor, jmForm){
        return new JMFCountryCodeField(fieldModel, $parent || null, fieldValidatorDescriptor || null, jmForm || null);
    };
});
