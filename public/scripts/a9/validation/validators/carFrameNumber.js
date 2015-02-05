(function(a9){
    var reg = /[^&A-Z&0-9&\-]/g;
    a9.validation.validators.carFrameNumber = function(value){
        var validateValue = value.toUpperCase().replace(reg, '');
        return (value === validateValue) && (value.length >= 10) && (value.length <= 13);
    };
}(A9));