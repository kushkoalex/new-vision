(function(a9){
    function SimpleInstancesBinding(dataAttribute){
        var simpleInstancesBinding = this;
        simpleInstancesBinding.dataAttribute = dataAttribute;
        simpleInstancesBinding.index = 0;
        simpleInstancesBinding.instances = [];
    }

    SimpleInstancesBinding.prototype = {
        /**
         * bind instance to node
         * @param {HTMLElement} $node
         * @param {*} instance
         * @returns {Number} instance index
         */
        bind: function($node, instance){
            var simpleInstancesBinding = this,
                index = simpleInstancesBinding.index;
            simpleInstancesBinding.instances[index] = instance;
            $node.setAttribute(simpleInstancesBinding.dataAttribute, index);
            simpleInstancesBinding.index = index + 1;
            return index;
        },
        /**
         * get instance by node
         * @param {HTMLElement} $node
         * @returns {*|null} instance (or null if instance none)
         */
        getByNode: function($node){
            var simpleInstancesBinding = this,
                index = $node.getAttribute(simpleInstancesBinding.dataAttribute),
                instance,
                u;
            if (index === null){
                return null;
            }
            instance = simpleInstancesBinding.instances[+index];
            if (instance !== u){
                return instance;
            }
            return null
        },
        /**
         * get instance by index
         * @param {Number} index
         * @returns {*|null} instance (or null if instance none)
         */
        getByIndex: function(index){
            var instance = this.instances[index],
                u;
            if (instance === u){
                return null;
            }
            return instance;
        },
        /**
         * remove instance bind
         * @param {HTMLElement} $node
         * @returns {SimpleInstancesBinding}
         */
        unbind: function($node){
            var simpleInstancesBinding = this,
                index = +$node.getAttribute(simpleInstancesBinding.dataAttribute),
                u;
            if (index !== null){
                simpleInstancesBinding.instances[+index] = u;
                $node.removeAttribute(simpleInstancesBinding.dataAttribute);
            }
            return simpleInstancesBinding;
        },
        destructor: function(){
            var simpleInstancesBinding = this;
            simpleInstancesBinding.instances.length = 0;
            simpleInstancesBinding.instances = null;
            simpleInstancesBinding.dataAttribute = null;
            simpleInstancesBinding.index = null;
        }
    };

    /**
     * create SimpleInstancesBinding
     * @param {String} dataAttribute
     * @returns {SimpleInstancesBinding}
     */
    a9.simpleInstanceBinding = function(dataAttribute){
        return new SimpleInstancesBinding(dataAttribute);
    }
}(A9));