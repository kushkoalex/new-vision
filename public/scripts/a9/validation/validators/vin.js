(function(a9){
    var reg = /I|O|Q|[^&A-Z&0-9]/g;
    a9.validation.validators.vin = function(value){
        var validateValue = value.toUpperCase().replace(reg, '');
        return (value === validateValue) && (value.length === 17);
    };
}(A9));