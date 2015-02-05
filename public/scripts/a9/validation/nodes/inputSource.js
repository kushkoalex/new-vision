(function(a9){
    var inputSourcePrototype,
        validation = a9.validation,
        nodeIDAttribute = validation.nodeIDAttribute,
        u;

    function domNodeValidateOnEvent(){
        validateElementValue(validation.getNode(this.getAttribute(nodeIDAttribute)));
    }

    function validateElementValue(inputSource){
        var i,
            iMax,
            value,
            validationInstance;
        if ('valueAttribute' in inputSource){
            value = inputSource.e.getAttribute(inputSource.valueAttribute);
        } else{
            value = inputSource.e.value;
        }
        inputSource.isValidateOnce = true;
        inputSource.isValid = true;
        inputSource.value = value;
        inputSource.firstInvalid = null;
        for (i = 0, iMax = inputSource.validatorsDescriptors.length; i < iMax; i += 1){
            inputSource.isValids[i] =
                validation.validators[inputSource.validatorsDescriptors[i].n](
                    value,
                    inputSource.validatorsDescriptors[i],
                    inputSource);
            if (!inputSource.isValids[i]){
                inputSource.isValid = false;
                if (inputSource.firstInvalid === null){
                    inputSource.firstInvalid = inputSource.validatorsDescriptors[i];
                }
            }
        }
        a9.generateCustomEvent(inputSource, 'validate', inputSource.isValid, inputSource);
        if (inputSource.parent !== u){
            inputSource.parent.childValidate(inputSource);
        } else{
            validationInstance = inputSource.validationInstance;
            if (!validationInstance.isValidateOnce){
                validationInstance.isValidateOnce = true;
            }
            validationInstance.isValid = inputSource.isValid;
            a9.generateCustomEvent(validationInstance, 'validate', inputSource.isValid);
        }
    }

    function InputSource(id, nodeDescriptor, parentNode, validationInstance){
        var inputSource = this,
            valueAttribute,
            nodeDescriptorMask = nodeDescriptor.mask,
            nodeDescriptorMaskItem,
            i;

        inputSource.id = id;
        inputSource.validationInstance = validationInstance;
        inputSource.isDOMValidationNode = true;
        if (nodeDescriptor.data){
            inputSource.data = a9.cloneObject(nodeDescriptor.data);
        } else{
            inputSource.data = {};
        }
        inputSource.e = nodeDescriptor.e || a9.$(nodeDescriptor.i);
        inputSource.e.setAttribute(nodeIDAttribute, '' + id);
        inputSource.e.swf01_validation_inputSourceNode = inputSource;
        inputSource.isValid = false;
        inputSource.isValidateOnce = false;
        inputSource.isValids = [];
        inputSource.parent = parentNode;
        inputSource.message = '';

        if ('valueAttribute' in nodeDescriptor){
            valueAttribute = nodeDescriptor.valueAttribute;
            inputSource.valueAttribute = valueAttribute;
            inputSource.value = inputSource.e.getAttribute(valueAttribute);
        } else{
            inputSource.value = inputSource.e.value;
        }
        if (a9.isArray(nodeDescriptor.validators)){
            inputSource.validatorsDescriptors = nodeDescriptor.validators;
        } else{
            inputSource.validatorsDescriptors = [nodeDescriptor.validators];
        }
        if (('onValidate' in nodeDescriptor)
            && (nodeDescriptor.onValidate in validation.onValidate)){
            a9.addCustomEvent(inputSource, 'validate', validation.onValidate[nodeDescriptor.onValidate]);
        }

        if ('mask' in nodeDescriptor){
            if (typeof nodeDescriptorMask === 'string') {
                inputSource.masks = [
                    a9.masking.make(
                        inputSource.e,
                        nodeDescriptorMask,
                        nodeDescriptor.on,
                        true
                    )
                ];
            } else if (a9.isArray(nodeDescriptorMask)){
                inputSource.masks = [];
                for (i = nodeDescriptorMask.length; i--;) {
                    nodeDescriptorMaskItem = nodeDescriptorMask[i];
                    inputSource.masks.push(a9.masking.make(
                        inputSource.e,
                        nodeDescriptorMaskItem.n,
                        nodeDescriptorMaskItem.on || nodeDescriptor.on,
                        true,
                        nodeDescriptorMaskItem
                    ));
                }
            } else{
                inputSource.masks = [
                    a9.masking.make(
                        inputSource.e,
                        nodeDescriptorMask.n,
                        nodeDescriptorMask.on || nodeDescriptor.on,
                        true,
                        nodeDescriptorMask
                    )
                ];
            }
            inputSource.mask = inputSource.masks[0];
        } else{
            inputSource.masks = u;
            inputSource.mask = u;
        }

        if (!('on' in nodeDescriptor) && !(nodeDescriptor.on in validation.on)){
            validation.on.blur(inputSource.e, domNodeValidateOnEvent);
            inputSource.off = validation.off.blur;
        } else{
            validation.on[nodeDescriptor.on](inputSource.e, domNodeValidateOnEvent);
            inputSource.off = validation.off[nodeDescriptor.on];
        }

        if (inputSource.value.length !== 0){
            validationInstance.onReadyStack.push(inputSource.validate, inputSource);
        }

    }

    inputSourcePrototype = InputSource.prototype;

    inputSourcePrototype.validate = function(){
        validateElementValue(this);
    };

    inputSourcePrototype.destructor = function(){
        var inputSource = this,
            inputSourceMasks = inputSource.masks,
            i;
        a9.removeAllCEListeners(inputSource);
        inputSource.id = null;
        inputSource.validationInstance = null;
        inputSource.off(inputSource.e, domNodeValidateOnEvent);
        inputSource.off = null;
        inputSource.e.removeAttribute(nodeIDAttribute);
        inputSource.e = null;
        inputSource.isValids.length = 0;
        inputSource.isValids = null;
        inputSource.validatorsDescriptors.length = 0;
        inputSource.validatorsDescriptors = null;
        inputSource.parent = null;
        inputSource.validate = null;
        inputSource.data = null;
        inputSource.message = null;
        inputSource.firstInvalid = null;
        if (inputSourceMasks !== u){
            for (i = inputSourceMasks.length; i--;) {
                inputSourceMasks[i].destructor();
            }
            inputSource.masks = null;
            inputSource.mask = null;
        }
    };

    validation.nodes.inputSource = function(id, nodeDescriptor, parentNode, validationInstance){
        return new InputSource(id, nodeDescriptor, parentNode, validationInstance);
    };
}(A9));
