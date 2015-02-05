(function(a9){
    var validation,
        validationInstancePrototype,
        nodesConstructs,
        validators,
        i,
        u,
        nodeBasisMethods,
        allNodes = [],
        allNodesCounter = 0;

    nodeBasisMethods = {
        childValidate: function(childNode){
            var node = this,
                child = node.child,
                i = child.length,
                isChildValid = true;
            for (; i-- ;){
                if (!child[i].isValid){
                    isChildValid = false;
                    break;
                }
            }
            node.isChildValid = isChildValid;
            validators[node.validatorName](node, childNode);
            if (node.isValidateOnce){
                node.onValidateEnd(childNode);
            }
            return node;
        },
        onValidateEnd: function(childNode){
            var node = this,
                validationInstance;
            a9.generateCustomEvent(node, 'validate', node.isValid, node, childNode);
            if (node.parent !== u){
                node.parent.childValidate(node);
            } else if ('validationInstance' in node){
                validationInstance = node.validationInstance;
                if (!validationInstance.isValidateOnce){
                    validationInstance.isValidateOnce = true;
                }
                validationInstance.isValid = node.isValid;
                a9.generateCustomEvent(validationInstance, 'validate', node.isValid);
            }
            return node;
        }
    };

    validation = {
        nodes: {},
        nodeBasisMethods: nodeBasisMethods,
        helpers: {},
        validators: {},
        validatorsData: {},
        microvalidators: {},
        on: {},
        off: {},
        onValidate: {},
        nodeIDAttribute: 'data-a9-validation-node',
        getNode: function(id){
            return allNodes[+id] || null;
        },
        make: function(mainNodeDescriptor, onValidate){
            validation = new Validation(mainNodeDescriptor);
            if (typeof onValidate === 'function'){
                a9.addCustomEvent(validation, 'validate', onValidate);
            }
            return validation;
        }
    };

    nodesConstructs = validation.nodes;
    validators = validation.validators;

    function Validation(mainNodeDescriptor){
        var validation = this,
            i = 0,
            iMax,
            onReadyStack;
        validation.isInCheck = false;
        validation.isValid = false;
        validation.isValidateOnce = false;
        validation.nodes = [];
        validation.onReadyStack = onReadyStack = [];
        if (a9.isArray(mainNodeDescriptor)){
            validation.mainNode = validation.createNode({T: 'node', C: mainNodeDescriptor});
        } else{
            validation.mainNode = validation.createNode(mainNodeDescriptor);
        }
        for (iMax = onReadyStack.length; i < iMax; i += 1){
            onReadyStack[i].call(onReadyStack[i += 1]);
        }
        validation.onReadyStack = null;
    }

    validationInstancePrototype = Validation.prototype;

    validationInstancePrototype.validate = function(){
        var validation = this;
        validation.isInCheck = true;
        validation.mainNode.validate();
        validation.isInCheck = false;
        return validation;
    };

    validationInstancePrototype.validateNodeByDOMElement = function($DOMElement){
        var validation = this,
            validatedNode = a9.getObjectOfList(validation.nodes, 'e', $DOMElement);
        if (validatedNode){
            validatedNode.validate();
        }
        return validation;
    };

    validationInstancePrototype.createNode = function (nodeDescriptor, parent){
        var validationInstance = this,
            validationNode,
            id = allNodesCounter;
        allNodesCounter += 1;
        if (nodeDescriptor.T
            && (nodesConstructs[nodeDescriptor.T])){
            validationNode = nodesConstructs[nodeDescriptor.T](id, nodeDescriptor, parent, validationInstance);
        } else{
            validationNode = nodesConstructs.inputSource(id, nodeDescriptor, parent, validationInstance);
        }
        allNodes[id] = validationNode;
        validationInstance.nodes.push(validationNode);
        return validationNode;
    };

    validationInstancePrototype.destructor = function(){
        var validation = this,
            nodes = validation.nodes;
        for (i = nodes.length; i-- ;){
            allNodes[nodes[i].id] = u;
            nodes[i].destructor();
        }
        a9.removeAllCEListeners(validation);
        nodes.length = 0;
        validation.nodes = null;
        validation.isValid = null;
        validation.isValidateOnce = null;
        validation.onValidate = null;
        validation.mainNode = null;
        validation.createNode = null;
        validation.validate = null;
        validation.destructor = null;
        return validation;
    };

    a9.validation = validation;


}(A9));

//on/off
(function(a9){
    a9.validation.on.focus = function($element, nodeValidator){
        a9.addEvent($element, 'focus', nodeValidator);
    };
    a9.validation.off.focus = function($element, nodeValidator){
        a9.removeEvent($element, 'focus', nodeValidator);
    };
}(A9));

(function(a9){
    a9.validation.on.blur = function($element, nodeValidator){
        a9.addEvent($element, 'blur', nodeValidator);
        a9.addCustomEvent($element, 'fictionBlur', nodeValidator);
    };
    a9.validation.off.blur = function($element, nodeValidator){
        a9.removeEvent($element, 'blur', nodeValidator);
        a9.removeCustomEvent($element, 'fictionBlur', nodeValidator);
    };
}(A9));

(function(a9){
    a9.validation.on.change = function($element, nodeValidator){
        a9.addCustomEvent($element, '__valueChange', nodeValidator);
    };
    a9.validation.off.change = function($element, nodeValidator){
        a9.removeCustomEvent($element, '__valueChange', nodeValidator);
    };
}(A9));

//onValidate
(function(a9){
    a9.validation.onValidate.console = function(){
        console.log(this.isValid);
        console.log(this.value);
    };
}(A9));

(function(a9){
    a9.validation.onValidate.nodeConsole = function(){
        console.log(this.isValid);
        console.log(this);
    };
}(A9));