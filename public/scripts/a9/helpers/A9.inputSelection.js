//todo set method
//todo for ie
(function(global, a9){
    var getSelectionObject = {start: 0, end: 0};
    a9.inputSelection = {
        get: function($input){
            var start = $input.selectionStart,
                end = $input.selectionEnd;
            if (start === end){
                return null;
            }
            getSelectionObject.start = start;
            getSelectionObject.end = end;
            return getSelectionObject;
        },
        set: function($input){

        }
    }
}(this, A9));