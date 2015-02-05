JMFORMS.modulesForInit.push(function(jmf){
    jmf.helpers.getInputValue = function($input){
        //todo $input validation and masked value
        return $input.value;
    };
});
