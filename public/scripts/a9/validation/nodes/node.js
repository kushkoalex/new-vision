(function(a9){
    var nodePrototype,
        u,
        validation = a9.validation,
        nodeIDAttribute = validation.nodeIDAttribute;

    function Node(id, nodeDescriptor, parentNode, validationInstance){
        var node = this,
            i,
            iMax,
            validatorName,
            nodeDescriptorValidator = nodeDescriptor.validator;
        node.id = id;
        node.validationInstance = validationInstance;
        node.data = {};
        node.e = nodeDescriptor.e || a9.$(nodeDescriptor.i);
        if (node.e !== null){
            node.e.setAttribute(nodeIDAttribute, '' + id);
        }
        node.isValid = false;
        node.isValidateOnce = false;
        node.invalidReason = '';
        node.invalidMessage = '';
        node.child = [];
        node.isChildValid = false;
        node.parent = parentNode;
        node.validatorDescriptor = nodeDescriptorValidator;

        if ('validator' in nodeDescriptor){
            if (typeof nodeDescriptorValidator === 'string'){
                if (nodeDescriptorValidator in validation.validators){
                    validatorName = nodeDescriptorValidator;
                } else{
                    validatorName = 'nodeBoolean';
                }
            } else{
                if (nodeDescriptorValidator.n in validation.validators){
                    validatorName = nodeDescriptorValidator.n;
                } else{
                    validatorName = 'nodeBoolean';
                }
            }
        } else{
            validatorName = 'nodeBoolean';
        }

        node.validatorName = validatorName;

        if (('onValidate' in nodeDescriptor)
            && (nodeDescriptor.onValidate in validation.onValidate)){
            a9.addCustomEvent(node, 'validate', validation.onValidate[nodeDescriptor.onValidate]);
        }
        if (node.child !== u){
            for (i = 0, iMax = nodeDescriptor.C.length; i < iMax; i += 1){
                node.child[i] = validationInstance.createNode(nodeDescriptor.C[i], node);
            }
        }
    }

    nodePrototype = Node.prototype;
    nodePrototype.childValidate = validation.nodeBasisMethods.childValidate;
    nodePrototype.onValidateEnd = validation.nodeBasisMethods.onValidateEnd;

    nodePrototype.validate = function(){
        var node = this,
            i = 0,
            iMax = node.child.length;
        for (; i < iMax; i += 1){
            node.child[i].validate();
        }
    };

    nodePrototype.destructor = function(){
        var node = this;
        if (node.e !== null){
            node.e.removeAttribute(nodeIDAttribute);
            node.e = null;
        }
        a9.removeAllCEListeners(node);
        node.id = null;
        node.validator = null;
        node.validatorDescriptor = null;
        node.onValidate = null;
        node.parent = null;
        node.child.length = 0;
        node.child = null;
        node.data = null;
        node.childValidate = null;
        node.onValidateEnd = null;
        node.validationInstance = null;
    };

    validation.nodes.node = function(id, nodeDescriptor, parentNode, validationInstance){
        return new Node(id, nodeDescriptor, parentNode, validationInstance);
    };
}(A9));
