(function(global, a9){
    var document = global.document,
        a9CursorPosition = a9.cursorPosition,
        a9InputSelection = a9.inputSelection,
        InputEditorPrototype;

    function InputEditor($input){
        var editableInput = this;
        editableInput.$input = $input;
    }

    InputEditorPrototype = InputEditor.prototype;

    InputEditorPrototype.input = function(value){
        var editableInput = this,
            $input = editableInput.$input,
            cursorPosition,
            selectionPosition,
            inputValue;

        if (document.activeElement === $input){
            cursorPosition = a9CursorPosition.get($input);
            selectionPosition = a9InputSelection.get($input);

            inputValue = $input.value;

            if (selectionPosition !== null){
                $input.value = inputValue.substr(0, selectionPosition.start) + value + inputValue.substr(selectionPosition.end);
                a9CursorPosition.set($input, cursorPosition + value.length);
            } else if (inputValue.length === cursorPosition){
                $input.value += value;
            } else{
                $input.value = inputValue.substr(0, cursorPosition) + value + inputValue.substr(cursorPosition);
                a9CursorPosition.set($input, cursorPosition + value.length);
            }
        } else{
            $input.value += value;
        }
    };

    InputEditorPrototype._delete = function(){
        var editableInput = this,
            $input = editableInput.$input,
            cursorPosition,
            selectionPosition,
            inputValue = $input.value;

        if (document.activeElement === $input){
            cursorPosition = a9CursorPosition.get($input);
            selectionPosition = a9InputSelection.get($input);
            if (selectionPosition !== null){
                $input.value = inputValue.substr(0, selectionPosition.start) + inputValue.substr(selectionPosition.end);
                a9CursorPosition.set($input, cursorPosition);
            } else if (cursorPosition !== 0){
                $input.value = inputValue.substr(0, cursorPosition - 1) + inputValue.substr(cursorPosition);
                a9CursorPosition.set($input, cursorPosition - 1);
            }
        } else if (inputValue.length !== 0){
            $input.value = inputValue.substr(0, inputValue.length - 1);
        }
    };

    InputEditorPrototype.destructor = function(){
        var editableInput = this;
        editableInput.$input = null;
    };

    a9.inputEditor = function($input){
        return new InputEditor($input);
    };

}(this, A9));