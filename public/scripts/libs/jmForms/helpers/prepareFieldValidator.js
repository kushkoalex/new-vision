JMFORMS.modulesForInit.push(function(jmf){
    var a9 = jmf.global.A9,
        l10n = a9.l10n;

    function dependencyInit(dependencyValidator){
        var jmField = this,
            jmForm = jmField.jmForm,
            formFieldForDependency = jmForm._fieldsByName[dependencyValidator.formElementName];

        if (formFieldForDependency){
            dependencyValidator.fieldForDependency = formFieldForDependency;
            a9.addCustomEvent(
                formFieldForDependency,
                'valueChange',
                function(){
                    var jmField = this;
                    jmField.jmForm.validation.validateNodeByDOMElement(jmField.$input);
                },
                jmField
            );
        }
    }
    jmf.helpers.prepareFieldValidator = function(jmField, fieldModel, fieldValidatorDescriptor, jmForm){
        var validator,
            dependencyValidator;
        if (fieldValidatorDescriptor !== null){
            delete fieldValidatorDescriptor.n;
            if (!('e' in fieldValidatorDescriptor)){
                fieldValidatorDescriptor.e = jmField.$input;
            }
            if (fieldModel.isRequired === true){
                validator = a9.getObjectOfList(fieldValidatorDescriptor.validators, 'n', 'required');
                if (validator === null){
                    fieldValidatorDescriptor.validators.push(
                        //todo messages
                        {n: 'required', invalidMessage: l10n('jmf_validation_requiredField')}
                    );
                }
            }
            dependencyValidator = a9.getObjectOfList(fieldValidatorDescriptor.validators, 'n', 'dependency');
            if (dependencyValidator
                && (dependencyValidator.from === 'formElement')){
                a9.addCustomEvent(jmForm, 'init', dependencyInit, jmField, dependencyValidator);
            }
        } else if (fieldModel.isRequired === true){
            fieldValidatorDescriptor = {
                e: jmField.$input,
                on: fieldModel.validateOn,
                validators: [
                    //todo messages
                    {n: 'required', invalidMessage: l10n('jmf_validation_requiredField')}
                ]
            };
        }
        return fieldValidatorDescriptor;
    };
});
