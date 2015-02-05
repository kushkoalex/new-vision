(function(a9){
    a9.validation.validators.nodeAnd = function(node, childNode){
        var i,
            iMax;
        node.isValid = true;
        for (i = 0, iMax = node.child.length; i < iMax; i += 1){
            if (!node.child[i].isValid){
                node.isValid = false;
            }
        }
        node.isValidateOnce = true;
    }
}(A9));
