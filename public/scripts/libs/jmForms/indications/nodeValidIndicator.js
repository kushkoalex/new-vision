JMFORMS.modulesForInit.push(function(jmf){
    var global = jmf.global,
        a9 = global.A9,
        validCSSClass = 'isJMFValidNode';

    function NodeValidIndicator(node){
        var nodeValidIndicator = this;
        nodeValidIndicator.node = node;
        a9.addCustomEvent(node, 'validate', onValidate);
        render(node);
    }

    function onValidate(){
        render(this);
    }

    function render(node){
        if (node.isValid){
            a9.addClass(node.e, validCSSClass);
        } else{
            a9.removeClass(node.e, validCSSClass);
        }
    }

    NodeValidIndicator.prototype.destructor = function(){
        //todo
    };

    jmf.indications.nodeValidIndicator = function(node){
        return new NodeValidIndicator(node);
    };
});