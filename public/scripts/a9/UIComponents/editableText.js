(function(a9){
    var simpleInstanceBinding = a9.simpleInstanceBinding('data-a9-editable-text-element-id'),
        eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
        editableModeCSSClass = 'isEditableTextEditableModeOn',
        editableTextInitCSSClass = 'isEditableTextInit',
        u;

    /**
     * editable text
     * @param {HTMLInputElement} $input   — inner input
     * @param {HTMLElement} [$actor] — actor (optional)
     * @constructor
     */
    function EditableText($input, $actor){
        var editableText = this,
            $wrapper,
            $save,
            $cancel,
            $value,
            query;

//        define basis
        editableText.isEditableModeOn = false;
        editableText.defaultValue = $input.getAttribute('data-a9-editable-text-default-value') || '';
        editableText.value = $input.value;

//        find and cache DOM elements
        editableText.$input = $input;
        editableText.$wrapper = $wrapper = a9.getParentByClass($input, 'jsEditableTextWrapper');

        query = a9.$cs($wrapper, 'jsEditableTextValue', 'jsEditableTextActor', 'jsEditableTextCancel', 'jsEditableTextSave');
        editableText.$value = $value = query.jsEditableTextValue[0];
        editableText.hasTitle = a9.hasAttribute($value, 'title');
        editableText.$valueText = a9.getTextNode($value);
        if ($actor === u){
            $actor = query.jsEditableTextActor[0];
        }
        editableText.$actor = $actor;
        editableText.$save = $save = query.jsEditableTextSave[0] || null;
        editableText.$cancel = $cancel = query.jsEditableTextCancel[0] || null;

//        add events
        simpleInstanceBinding.bind($input, editableText);
        a9.addEvent($input, 'keyup', onInputKeyUp);

        simpleInstanceBinding.bind($actor, editableText);
        a9.addEvent($actor, eventOnPointerEnd, onEditModeOn);

        if ($save !== null){
            simpleInstanceBinding.bind($save, editableText);
            a9.addEvent($save, eventOnPointerEnd, onSave);
        }

        if ($cancel !== null){
            simpleInstanceBinding.bind($cancel, editableText);
            a9.addEvent($cancel, eventOnPointerEnd, onCancel);
        }

        a9.addClass($wrapper, editableTextInitCSSClass);

    }

    function onEditModeOn(){
        simpleInstanceBinding.getByNode(this).editModeOn();
    }

    function onCancel(){
        simpleInstanceBinding.getByNode(this).editModeOff(false);
    }

    function onSave(){
        simpleInstanceBinding.getByNode(this).editModeOff(true);
    }

    function onInputKeyUp(e){
        if (a9.testEventOfKeyName(e, 'enter')){
            simpleInstanceBinding.getByNode(this).editModeOff(true);
        } else if (a9.testEventOfKeyName(e, 'esc')){
            simpleInstanceBinding.getByNode(this).editModeOff(false);
        }
    }


    EditableText.prototype = {
        /**
         * on edit mode
         * @param {String} [value] — value for edit
         * @returns {EditableText}
         */
        editModeOn: function(value){
            var editableText = this,
                u,
                $input;
            if (!editableText.isEditableModeOn){
                $input = editableText.$input;
                if (value !== u){
                    $input.value = value;
                } else{
                    $input.value = value = editableText.value;
                }

                a9.addClass(editableText.$wrapper, editableModeCSSClass);
                $input.focus();
                a9.cursorPosition.set($input, value.length);
                editableText.isEditableModeOn = true;
                a9.generateCustomEvent(editableText, 'editableNodeOn', value);
            }
            return editableText;
        },
        /**
         * off edit mode
         * @param {Boolean} [isUpdateValue] — is need update value
         * @returns {EditableText}
         */
        editModeOff: function(isUpdateValue){
            //console.log('editModeOff');
            //console.log('isUpdateValue '+isUpdateValue);

            var editableText = this,
                value,
                isUpdate = false;
            if (editableText.isEditableModeOn){

                if (isUpdateValue){
                    value = editableText.$input.value;
                    if (value === ''){
                        value = editableText.defaultValue;
                    }
                    if (value !== editableText.value){
                        editableText.value = value;
                        editableText.$valueText.nodeValue = value;
                        if (editableText.hasTitle){
                            editableText.$value.setAttribute('title', value);
                        }
                        isUpdate = true;
                    }
                }

                a9.removeClass(editableText.$wrapper, editableModeCSSClass);

                //fix for ie to hide cursor on keypress
                editableText.$input.blur();

                editableText.isEditableModeOn = false;

                a9.generateCustomEvent(editableText, 'editableNodeOff', value);

                if (isUpdate){
                    a9.generateCustomEvent(editableText, 'update', value);
                }
            }
            return editableText;
        },

        /**
         * set value
         * @param {String} value — new value
         * @param {Boolean} [isUpdateInEditInput] — flag for update value in edit input (for edit mode)
         * @returns {EditableText}
         */
        setValue: function(value, isUpdateInEditInput){
            var editableText = this;

            editableText.value = value;
            editableText.$valueText.nodeValue = value;

            if (editableText.isEditableModeOn && isUpdateInEditInput){
                editableText.$input.value = value;
            }

            return editableText;
        },

        destructor: function(){
            var editableText = this,
                $input = editableText.$input,
                $save = editableText.$save,
                $cancel = editableText.$cancel,
                $actor = editableText.$actor;

            a9.removeEvent($input, 'keyup', onInputKeyUp);
            simpleInstanceBinding.unbind($input);
            editableText.$input = null;

            a9.removeEvent($actor, eventOnPointerEnd, onEditModeOn);
            simpleInstanceBinding.unbind($actor);
            editableText.$actor = null;

            if ($save !== null){
                a9.removeEvent($save, eventOnPointerEnd, onSave);
                simpleInstanceBinding.unbind($save);
                editableText.$save = null;
            }

            if ($cancel !== null){
                a9.removeEvent($cancel, eventOnPointerEnd, onCancel);
                simpleInstanceBinding.unbind($cancel);
                editableText.$cancel = null;
            }

            a9.removeClass(editableText.$wrapper, editableTextInitCSSClass);
            editableText.$wrapper = null;

            editableText.$value = null;
            editableText.$valueText = null;

            editableText.value = null;
            editableText.defaultValue = null;

            a9.removeAllCEListeners(editableText);

        }
    };

    /**
     * editable text
     * @param {HTMLInputElement} $input — inner input
     * @returns {EditableText}
     */
    a9.editableText = function($input, $actor){
        var editableTextInput = simpleInstanceBinding.getByNode($input);
        if (editableTextInput !== null){
            return editableTextInput;
        } else{
            return new EditableText($input, $actor);
        }
    };
}(A9));
