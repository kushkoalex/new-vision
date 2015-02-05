(function(a9){
    a9.validation.validators.sameValues = function(node, childNode){
        var i,
            iMax,
            valueCache = node.child[0].value;
        node.isValid = true;
        for (i = 0, iMax = node.child.length; i < iMax; i += 1){
            if (!node.child[i].isValidateOnce){
                node.isValid = false;
                node.invalidReason = 'missMatch';
                node.invalidMessage = node.validatorDescriptor.invalidMessages.missMatch;
                return;
            }
            if ((!node.child[i].isValid) || (valueCache !== node.child[i].value)){
                node.isValid = false;
                node.invalidReason = 'missMatch';
                node.invalidMessage = node.validatorDescriptor.invalidMessages.missMatch;
                break;
            }
        }
        node.isValidateOnce = true;
    }
}(A9));