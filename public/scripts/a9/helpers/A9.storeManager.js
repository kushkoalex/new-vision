(function(a9){
    function StoreManager(onAddFn, onRemoveFn, args){
        var storeManager = this;

        storeManager.onAdd = onAddFn;
        storeManager.onRemove = onRemoveFn;
        storeManager.objects = [];
        storeManager.objectsCount = [];

        if (a9.isArray(args)){
            storeManager.args = args;
        } else{
            storeManager.args = [args];
        }
    }

    StoreManager.prototype = {
        add: function(object){
            var storeManager = this,
                index = a9.arrayIndexOf(storeManager.objects, object);
            if (index === -1){
                storeManager.onAdd.apply(object, storeManager.args);
                storeManager.objects.push(object);
                storeManager.objectsCount.push(1);
            } else{
                storeManager.objectsCount[index] += 1;
            }
        },
        remove: function(object){
            var storeManager = this,
                index = a9.arrayIndexOf(storeManager.objects, object);
            if (index === -1){
                //console.log('error: all objects of this store were already removed');
                //console.log(object);
            } else if (storeManager.objectsCount[index] === 1){
                storeManager.onRemove.apply(object, storeManager.args);
                a9.deleteElementsInArray(storeManager.objects, object);
                a9.deleteElementsInArray(storeManager.objectsCount, index);
            } else{
                storeManager.objectsCount[index] -= 1;
            }
        },
        isEmpty: function(){
            return this.objects.length === 0;
        },
        destructor: function(){
            var storeManager = this;
            storeManager.onAdd = null;
            storeManager.onRemove = null;
            storeManager.objects = null;
            storeManager.objectsCount = null;
        }
    };

    /**
     * create StoreManager
     * @param {Function} onAddFn
     * @param {Function} onRemoveFn
     * @param {Array|}   args
     * @returns {StoreManager}
     */
    a9.storeManager = function(onAddFn, onRemoveFn, args){
        return new StoreManager(onAddFn, onRemoveFn, args);
    }
}(A9));
