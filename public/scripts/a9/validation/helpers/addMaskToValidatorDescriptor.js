(function(a9){
    a9.validation.helpers.addMaskToValidatorDescriptor = function(validatorDescriptor, mask){
        var validatorMask = validatorDescriptor.mask,
            u,
            hasValidatorMask = validatorMask !== u,
            inputMask,
            searchableMask;

        if (hasValidatorMask){
            if (typeof mask === 'string'){
                inputMask = {n: mask};
            } else{
                inputMask = mask;
            }

            if (typeof validatorMask === 'string'){
                if (validatorMask !== inputMask.n){
                    validatorDescriptor.mask = [
                        {n: validatorMask},
                        inputMask
                    ];
                }
            } else if (a9.isArray(validatorMask)){
                searchableMask = a9.getObjectOfList(validatorMask, 'n', inputMask.n);
                if (searchableMask === null){
                    validatorMask.push(inputMask);
                }
            } else{
                if (validatorMask.n !== inputMask.n){
                    validatorDescriptor.mask = [
                        validatorMask,
                        inputMask
                    ];
                }
            }

        } else{
            validatorDescriptor.mask = mask;
        }

    };
}(A9));
