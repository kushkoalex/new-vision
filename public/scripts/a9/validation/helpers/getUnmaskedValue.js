(function(a9){
    a9.validation.helpers.getUnmaskedValue = function(value, validatorDescriptor, inputSourceNode){
        var maskInstance,
            u;

        if (inputSourceNode === u){
            return value;
        }

        if ('relatedMask' in validatorDescriptor){
            maskInstance = a9.getObjectOfList(inputSourceNode.masks, 'maskName', validatorDescriptor.relatedMask);
            if (maskInstance !== null){
                return a9.masking.getMaskInfoForInstance(maskInstance, value).unmaskedValue;
            }
        }

        maskInstance = inputSourceNode.mask;
        if (maskInstance === u){
            return value;
        } else{
            return a9.masking.getMaskInfoForInstance(maskInstance, value).unmaskedValue;
        }
    };
}(A9));
