(function(a9){
    a9.validation.validators.nodeOr = function(node, childNode){
        var i,
            iMax;
        node.isValid = false;
        for (i = 0, iMax = node.child.length; i < iMax; i += 1){
            if (node.child[i].isValid){
                node.isValid = true;
            }
        }
        node.isValidateOnce = true;
    }
}(A9));
