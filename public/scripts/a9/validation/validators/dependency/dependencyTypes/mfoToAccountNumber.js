(function(a9){

    var coefficients = [1, 3, 7, 1, 3, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];

    function multipliedByTheCorrespondingCoefficient(item, index){
        return item * coefficients[index];
    }

    function getLowOrder(number){
        var absNumber = Math.abs(number);
        if (absNumber < 10){
            return absNumber;
        } else{
            return absNumber % 10;
        }
    }

    a9.validation.validatorsData.dependencyTypes.mfoToAccountNumber = function(value, valueForDependency, validatorDescriptor){
        var parsedValue,
            hasDependencyValue = valueForDependency && valueForDependency.length === 6,
            parsedDependencyValue,

            controlValue,

            commonArray,

            result;

        if (!hasDependencyValue){
            return true;
        }

        parsedValue = a9.strToNumbersArray(value.replace(/\D/g, ''));

        controlValue = parsedValue[4];
        parsedValue[4] = 0;
        parsedDependencyValue = a9.strToNumbersArray(valueForDependency.substr(0, 5));

        commonArray = parsedDependencyValue.concat(parsedValue);

        a9.arrayMap(commonArray, multipliedByTheCorrespondingCoefficient);

        a9.arrayMap(commonArray, getLowOrder);

        result = a9.arraySum(commonArray);

        result = result + parsedValue.length;

        result = getLowOrder(result * 7);

        return result === controlValue;

    };

    //console.log(A9.validation.validatorsData.dependencyTypes.mfoToAccountNumber('12112728011234', '300001'));
    //console.log(A9.validation.validatorsData.dependencyTypes.mfoToAccountNumber('121117281', '300001'));
}(A9));