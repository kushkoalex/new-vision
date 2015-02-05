/**
 * Обект через который можно задавать чистый цсс
 * @type {A9.pureCSS}
 *     A9.pureCSS = {
 *         /**
 *          * Создаёт таблицу стилей
 *          * @returns {HTMLElement} таблица стилей
 *         createSheet: function(){}
 *         /**
 *          * Вставляет одно правило в таблицу стилей (некоторый внутренний метод выданный на ружу для продвинутого использованя)
 *          * @param {HTMLElement} sheet таблица стилей
 *          * @param {String} css строка правил вида '.myClass{background: #f00;border:1px solid #000}'
 *          * @param {Number} index индекс
 *         rule: function(sheet, css, index){}
 *         /**
 *          * Вставляет в умолчалную таблицу стилей цсс стили
 *          * @param {String} css строка правил вида '.myClass{background: #f00;border:1px solid #000}'
 *          * @param {String} css [option] строка правил вида '.myClass{background: #f00;border:1px solid #000}'
 *          * ...
 *          * @param {String} css [option] строка правил вида '.myClass{background: #f00;border:1px solid #000}'
 *         add: function(css, css, css, ...){}
 *     }
 */
A9.pureCSS = function(){
    var pureCSS = {
            createSheet: null,
            rule: null,
            add: null
        },
        head = (document.head || document.getElementsByTagName('head')[0]),
        styleTag,
        sheet,
        rule = -1,
        i = 0,
        iMax;
    pureCSS.createSheet = function(){
        styleTag = document.createElement('style');
//        styleTag.appendChild(document.createTextNode(''));
        styleTag.setAttribute('type', 'text/css');
        head.appendChild(styleTag);
        return  styleTag.sheet || styleTag.styleSheet;
    };
    sheet = pureCSS.createSheet();
    pureCSS.rule = typeof sheet.insertRule === 'function' ?
        function(sheet, css, index){
            sheet.insertRule(css, index);
        } : function(sheet, css, index){
            sheet.addRule(css.substring(0, css.indexOf('{')), css.substring(css.indexOf('{') + 1, css.indexOf('}')), index);
        };
    pureCSS.add = function(css){
        for (i = 0, iMax = arguments.length; i < iMax ; i += 1){
            rule += 1;
            pureCSS.rule(sheet, arguments[i], rule);
        }
    };
    return pureCSS;
}();
