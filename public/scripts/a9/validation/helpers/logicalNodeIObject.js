(function(a9){
    var logicalNodeObjectPrototype,
        u;
    function LogicalNodeObject(isValid, logicalNode){
        var logicalNodeObject = this;
        if (isValid !== u){
            logicalNodeObject.isValid = isValid;
        } else{
            logicalNodeObject.isValid = false;
        }
        logicalNodeObject.logicalNode = logicalNode || null;
        logicalNodeObject.onChange = [];
    }

    logicalNodeObjectPrototype = LogicalNodeObject.prototype;
    logicalNodeObjectPrototype.setValid = function(isValid){
        var logicalNodeObject = this,
            i,
            iMax,
            onChange;
        if (logicalNodeObject.isValid !== isValid){
            logicalNodeObject.isValid = isValid;
            onChange = logicalNodeObject.onChange;
            iMax = onChange.length;
            if (iMax !== 0){
                for (i = 0; i < iMax; i += 1){
                    onChange[i](isValid, logicalNodeObject);
                }
            }
        }
        return logicalNodeObject;
    };
    logicalNodeObjectPrototype.destructor = function(){
        var logicalNodeObject = this;
        logicalNodeObject.onChange.length = 0;
        logicalNodeObject.onChange = null;
        logicalNodeObject.logicalNode = null;
        logicalNodeObject.isValid = null;
    };

    a9.validation.helpers.logicalNodeObject = function(isValid, logicalNode){
        return new LogicalNodeObject(isValid, logicalNode);
    };
}(A9));
