/**
 * Объект для работы с позицыей курсора в input/textarea
 * @type {A9.cursorPosition}
 * SWF01.cursorPosition = {
 *     /**
 *      * Получить позицию курсора
 *      * @param {HTMLElement} $input input/textarea
 *     get: function(object){}
 *     /**
 *      * Задать позицию курсора
 *      * @param {HTMLElement} $input input/textarea
 *      * @param {Number} position позиция курсора
 *     set: function(object, position){}
 * }
 *
 */
(function(global, a9){
    var cursorPosition = global.document.selection ? {
            get: function($input){
                var range = document.selection.createRange();
                range.moveStart('textedit', -1);
                return range.text.length;
            },
            set: function($input, position){
                var range = $input.createTextRange();
                range.collapse(true);
                range.moveStart('character', position);
                range.select();
            }
        } : {
            get: function($input){
                return $input.selectionStart;
            },
            set: function($input, position){
                $input.setSelectionRange(position, position);
            }
        };

    a9.cursorPosition = cursorPosition;

    a9.trackLastKeyDownCursorPosition = function(){
        var cursorPos = null,
            $lastTarget,
            tracker = {
                get: function($target){
                    return $target === $lastTarget ? cursorPos : null;
                }
            };

        a9.addEvent(global.document, 'keydown', function(e){
            var _$lastTarget = e.target,
                tagName = _$lastTarget.tagName;
            
            if ((tagName === 'TEXTAREA')
                || ((tagName === 'INPUT')
                    && _$lastTarget.type === 'text')){
                $lastTarget = e.target;
                cursorPos = cursorPosition.get($lastTarget);
            }
        });
        a9.trackLastKeyDownCursorPosition = function(){
            return tracker;
        };
        return a9.trackLastKeyDownCursorPosition();
    };
})(this, A9);
