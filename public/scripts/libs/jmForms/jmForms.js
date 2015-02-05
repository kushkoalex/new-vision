(function(global){
    var inInit = false,
        jmForms = {
        version: '0.1.12',
        global: global,
        settings: null,
        helpers: {},
        tmpls: {},
        fields: {},
        formulas: {},
        indications: {},
        modulesForInit: [],
        fieldTypesByValueTypes: {
            'number': 'defaultInput',
            'string': 'defaultInput',
            'decimal': 'defaultInput',
            'date': 'defaultDate',
            'calendar': 'calendarDate',
            'boolean': 'defaultBoolean'
        },
        defaultFieldType: 'defaultInput',
        make: null,
        init: function(settings){
            if (!inInit){
                jmForms.settings = settings;
                global.A9.initModules(jmForms);
                inInit = true;
            }
        }
    };
    global.JMFORMS = jmForms;
}(this));

JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        jmfFieldsList = jmf.fields,
        fieldTypesByValueTypes = jmf.fieldTypesByValueTypes,
        defaultFieldType = jmf.defaultFieldType,
        document = global.document,
        searchValidatorAnswer = a9.createAnswerForGetObjectFromTree();

    /**
     *
     * @param {Array} fields
     * @param {Array|Object} [validationDescriptor]
     * @param {HTMLElement} [$parent]
     * @constructor
     */
    function JMForm(fields, validationDescriptor, $parent){
        var jmForm = this,
            i,
            iMax,
            _fieldsNames,
            _fieldsByName,
            fieldValidatorDescriptor = null,
            jmField,
            u,
            hasFormValidationDescriptor = validationDescriptor !== null,
            $documentFragment = document.createDocumentFragment(),
            hasAsyncInputs = false,
            fieldName,
            fieldType,
            fieldValueType,
            hasFieldValidator = false,
            currentFieldType,
            localSearchValidatorAnswer,
            fieldResultValidatorDescriptor,
            validatorsFromFieldsCollection = null;

        jmForm.inInit = false;
        jmForm._fieldsNames = _fieldsNames = [];
        jmForm._fieldsByName = _fieldsByName =  {};

        jmForm.validation = null;
        jmForm.isValid = false;
        jmForm._indicationsInstances = null;
        jmForm._validationDescriptor = validationDescriptor;
        jmForm._fieldsListLeftBeforeInit = null;
        jmForm._fieldsCountLeftBeforeInit = 0;
        jmForm.$r = $documentFragment;
        jmForm.$parent = null;

        //инитим поля
        for (i = 0, iMax = fields.length; i < iMax; i += 1){

            fieldName = fields[i].name;
            fieldValueType = fields[i].valueType;
            fieldType = fields[i].type;


            //смотрим еслть ли глобальный валидатор
            //get validator
            if (hasFormValidationDescriptor){
                //ищем его для поля (т.к. надо будет заменить ему "n" на "e" с элементом DOM
                localSearchValidatorAnswer = a9.getObjectFromTree(validationDescriptor.C || validationDescriptor, 'C', 'n', fieldName, searchValidatorAnswer);
                hasFieldValidator = localSearchValidatorAnswer !== null;
                if (hasFieldValidator){
                    fieldValidatorDescriptor = localSearchValidatorAnswer.searchableObject;
                } else{
                    fieldValidatorDescriptor = u;
                }
            }

            if (fieldValueType in fieldTypesByValueTypes){
                currentFieldType = fieldTypesByValueTypes[fieldValueType];
            } else{
                currentFieldType = defaultFieldType;
            }

            //check in fields list
            if (fieldType in jmfFieldsList){
                currentFieldType = fieldType;
            }

            //init field
            jmField = jmfFieldsList[currentFieldType](fields[i], $documentFragment, fieldValidatorDescriptor, jmForm);
            fieldResultValidatorDescriptor = jmField.validatorDescriptor;

            //check validator change and replace in validators list if is change
            if (hasFormValidationDescriptor
                && hasFieldValidator
                && (fieldResultValidatorDescriptor !== fieldValidatorDescriptor)){
                //после инита поля смотрим не поменяло ли оно валидатор, если поменяло заменяем его в общем списке валидаторов
                //нужно для того чтобы большие компоненты могли создавать большие узлы или вообще свои валидационные деревья
                localSearchValidatorAnswer.collection[localSearchValidatorAnswer.index] = fieldResultValidatorDescriptor;
            } else if (!hasFieldValidator
                && (fieldResultValidatorDescriptor !== null)){
                if (validatorsFromFieldsCollection === null){
                    validatorsFromFieldsCollection = [];
                }
                validatorsFromFieldsCollection.push(fieldResultValidatorDescriptor);
            }

            //store field in form
            _fieldsNames.push(fieldName);
            _fieldsByName[fieldName] = jmField;

            //check field value change
            a9.addCustomEvent(
                jmField,
                'valueChange',
                fieldValueChange,
                jmForm,
                fieldName
            );

            //check field init
            if (!jmField.isInit){
                if (!hasAsyncInputs){
                    hasAsyncInputs = true;
                    jmForm._fieldsListLeftBeforeInit = [fieldName];
                } else{
                    jmForm._fieldsListLeftBeforeInit.push(fieldName);
                }
                jmForm._fieldsCountLeftBeforeInit += 1;
                //add init listener
                a9.addCustomEvent(
                    jmField,
                    'init',
                    fieldInit,
                    jmForm,
                    fieldName
                );
            }
        }

        searchValidatorAnswer.clean();

        //если поля нагенерили валидаторов сами дополняем валидацию формы сами
        if (validatorsFromFieldsCollection !== null){
            if (hasFormValidationDescriptor){
                if (a9.isArray(validationDescriptor)){
                    a9.arraysMerge(validatorsFromFieldsCollection, validationDescriptor);
                } else{
                    a9.arraysMerge(validatorsFromFieldsCollection, validationDescriptor.C);
                }
            } else{
                jmForm._validationDescriptor = validatorsFromFieldsCollection;
            }
        }

        a9.generateCustomEvent(jmForm, 'fieldsListCompleted');

        //check async
        if (hasAsyncInputs){
            a9.addCustomEvent(jmForm, 'fieldsInit', fieldsInit);
        } else{
            initForm(jmForm);
        }

        if ($parent !== null){
            jmForm.appendTo($parent);
        }
    }

    function initForm(jmForm){
        var validation,
            indicationsInstances,
            indications = jmf.indications;
        if (jmForm._validationDescriptor !== null){
            jmForm.validation = validation = a9.validation.make(jmForm._validationDescriptor);
            a9.addCustomEvent(validation, 'validate', formValidate, jmForm);
            jmForm.isValid = validation.isValid;
            jmForm._indicationsInstances = indicationsInstances = [];
            a9.each(validation.nodes, function(node){
                if (node.isDOMValidationNode){
                    switch (node.e.type){
                        case 'password':
                        case 'text':
                        case 'textarea':
                        case 'checkbox':
                        //todo remove after fix country code validation
                        case 'hidden':
                            indicationsInstances.push(indications.inputSource(node));
                            break;
                    }
                } else if (node.e){
                    indicationsInstances.push(indications.nodeValidIndicator(node));
                }
            });
        } else{
            jmForm.isValid = true;
        }
        jmForm.isInit = true;
        a9.generateCustomEvent(jmForm, 'init');
    }

    function formValidate(isValid){
        var jmForm = this;
        jmForm.isValid = isValid;
        a9.generateCustomEvent(jmForm, 'validate', isValid);
    }

    function fieldsInit(){
        var jmForm = this;
        a9.removeCustomEvent(jmForm, 'fieldsInit', fieldsInit);
        initForm(jmForm);
    }

    function fieldValueChange(fieldName, fieldValue){
        //this in jmForm instance
        var jmForm =  this;
        a9.generateCustomEvent(jmForm, 'field.value.change', fieldName, fieldValue);
    }

    function fieldInit(fieldName){
        //this in jmForm instance
        var jmForm =  this;
        if (a9.arrayIndexOf(jmForm._fieldsListLeftBeforeInit, fieldName) !== -1){
            a9.removeCustomEvent(
                jmForm._fieldsByName[fieldName],
                'init',
                fieldInit,
                jmForm
            );
            jmForm._fieldsCountLeftBeforeInit -= 1;
            if (jmForm._fieldsCountLeftBeforeInit === 0){
                jmForm._fieldsListLeftBeforeInit = null;
                a9.generateCustomEvent(jmForm, 'fieldsInit');
            }
        }
    }

    JMForm.prototype = {
        /**
         *
         * @param {String|Array|Object} fieldQuery
         *    если передан масси, будет искать поля относительно свойств name объектов масива,
         *        и задавать им значения из свойств value объектов массива
         *    если передан объект, будет искать поля относительно свойств объекта
         *    если строка, то только одно поле
         * @param {*} [fieldValue] значения для поля fieldQuery
         * @returns {JMForm}
         */
        set: function(fieldQuery, fieldValue){
            var jmForm = this,
                p,
                i,
                iMax,
                _fieldsByName,
                fieldName,
                jmField,
                u;
            if (typeof fieldQuery === 'string'){
                jmField = jmForm._fieldsByName[fieldQuery];
                if (jmField !== u){
                    jmField.set(fieldValue);
                }
            } else if (a9.isArray(fieldQuery)){
                for (i = 0, iMax = fieldQuery.length; i < iMax; i += 1){
                    fieldName = fieldQuery[i].name;
                    if (fieldName !== u){
                        jmField = jmForm._fieldsByName[fieldName];
                        if (jmField !== u){
                            jmField.set(fieldQuery[i].value);
                        }
                    }
                }
            } else{
                _fieldsByName = jmForm._fieldsByName;
                for (p in fieldQuery){
                    jmField = _fieldsByName[p];
                    if (jmField !== u){
                        jmField.set(fieldQuery[p]);
                    }
                }
            }
            return jmForm;
        },
        /**
         *
         * @param {String|Object} [fieldsQuery]
         *    если пустой, вернёт значения всех полей
         *    если объект, будет искать поля со относительно свойств объекта
         *    если строка, будет искать поле
         * @returns {*}
         */
        get: function(fieldsQuery){
            var jmForm = this,
                p,
                _fieldsByName,
                jmField,
                result,
                u;
            if (typeof fieldsQuery === 'string'){
                jmField = jmForm._fieldsByName[fieldsQuery];
                if (jmField !== u){
                    result = jmField.get();
                } else{
                    result = null;
                }
            } else if (fieldsQuery !== u){
                result = fieldsQuery;
                _fieldsByName = jmForm._fieldsByName;
                for (p in fieldsQuery){
                    jmField = _fieldsByName[p];
                    if (jmField !== u){
                        fieldsQuery[p] = jmField.get();
                    } else{
                        fieldsQuery[p] = null;
                    }
                }
            } else{
                result = {};
                _fieldsByName = jmForm._fieldsByName;
                for (p in _fieldsByName){
                    result[p] = _fieldsByName[p].get();
                }
            }
            return result;
        },
        /**
         *
         * @returns {JMForm}
         */
        validate: function(){
            var jmForm = this;
            if (jmForm.validation !== null){
                jmForm.validation.validate();
            }
            return jmForm;
        },
        /**
         *
         * @returns {JMForm}
         */
        render: function(){
            var jmForm = this;
            a9.generateCustomEvent(jmForm, 'render');
            return jmForm;
        },
        /**
         *
         * @param {HTMLElement} $parent
         * @returns {JMForm}
         */
        appendTo: function($parent){
            var jmForm = this;
            jmForm.$parent = $parent;
            $parent.appendChild(jmForm.$r);
            jmForm.render();
            return jmForm;
        },
        destructor: function(){
//            todo
        }
    };


    jmf.make = function(fields, validation, $parent){
        var u,
            _validation = null,
            _$parent = null;
        if (validation !== u){
            if ('nodeName' in validation){
                _$parent = validation;
            } else{
                _validation = validation;
                if ($parent !== u){
                    _$parent = $parent;
                }
            }
        }
        return new JMForm(fields, _validation, _$parent);
    };

});
