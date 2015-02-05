(function(a9){
    var validation = a9.validation,
        logicalPrototype,
        u;

    function validChange(isValid, logicalNodeObject){
        var logicalNode = logicalNodeObject.logicalNode;
        logicalNode.isValid = isValid;
        logicalNode.validate();
    }

    function LogicalNode(id, nodeDescriptor, parentNode, validationInstance){
        var logical = this,
            logicalNodeObject = nodeDescriptor.logicalObject;
        //logical.e = nodeDescriptor.e || a9.$(nodeDescriptor.i);
        logical.id = id;
        logical.parent = parentNode;
        logical.isValid = logicalNodeObject.isValid;
        logical.isValidateOnce = false;
        logical.logicalNodeObject = logicalNodeObject;
        logicalNodeObject.logicalNode = logical;
        logicalNodeObject.onChange.push(validChange);
        if (logical.isValid){
            logical.validate();
        }
    }

    validation.nodes.logical = function(id, nodeDescriptor, parentNode, validationInstance){
        return new LogicalNode(id, nodeDescriptor, parentNode, validationInstance);
    };

    logicalPrototype = LogicalNode.prototype;

    logicalPrototype.validate = function(){
        var logical = this;
        if (!logical.isValidateOnce){
            logical.isValidateOnce = true;
        }
        if (logical.parent !== u){
            logical.parent.childValidate(logical);
        }
    };

    logicalPrototype.destructor = function(){
        var logical = this;
        logical.parent = null;
        a9.deleteElementsInArray(logical.logicalNodeObject.onChange, validChange);
        logical.logicalNodeObject = null;
        logical.isValid = null;
        logical.validate = null;
        logical.destructor = null;
    };
}(A9));
