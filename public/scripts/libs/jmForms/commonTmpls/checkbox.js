JMFORMS.modulesForInit.push(function(jmf){

    /**
     *
     * @param {Object} settings
     * {
         //checkbox c
         [c: {String}],
         //checkbox n
         [n: {String|Array}],
         //checkbox i
         [isChecked: {Boolean}]
         //checkbox i
         [i: {String}]

         //c Visual Input
         [cVisual: {String}],
         //n Visual Input
         [nVisual: {String|Array}],

         //c Input Wrapper
         [cWrapper: {String}],
         //n Input Wrapper
         [nWrapper: {String|Array}],
         //wrapper flag
          hasWrapper: {Boolean}

         // input a
         [a: {Object}],
         //input name attribute
         [name: {String}],
         //placeholder text (add label)
         [placeholder: {String}]
     }
     * @returns {Object}
     */
    jmf.tmpls.checkbox = function(settings){
        var checkbox,
            c = 'checkbox jsRealCheckbox',
            n = 'checkbox',
            a,

            cVisual = '',
            nVisual = 'visualCheckbox',
            visual,

            cWrapper,
            nWrapper,
            hasWrapper = false,

            result,
            u;

        if (settings.c !== u){
            c += ' ' + settings.c;
        }
        if (settings.n !== u){
            n = settings.n;
        }

        if (settings.a !== u){
            a = settings.a;
        }

        if (settings.name !== u){
            if (a === u){
                a = {name: settings.name};
            } else{
                a.name = settings.name;
            }
        }

        if (settings.isChecked === true){
            if (a === u){
                a = {checked: 'checked'};
            } else{
                a.checked = 'checked';
            }
        }

        if (a !== u){
            checkbox = {e: 'input', T: 'checkbox', c: c, n: n, a: a}
        } else{
            checkbox = {e: 'input', T: 'checkbox', c: c, n: n}
        }

        if (settings.i !== u){
            checkbox.i = settings.i;
        }

        if (settings.cVisual !== u){
            cVisual += ' ' + settings.cVisual;
        }
        if (settings.nVisual !== u){
            nVisual = settings.nVisual;
        }

        if (settings.cWrapper !== u){
            cWrapper = settings.cWrapper;
        }

        if (settings.nWrapper !== u){
            nWrapper = settings.nVisual;
        }

        if ((settings.hasWrapper === true)
            || (cWrapper !== u)
            || (nWrapper !== u)){
            hasWrapper = true;
            if (nWrapper === u){
                nWrapper = 'inputWrapper';
            }
        }

        visual = {c: 'jsVisualCheckbox ' + cVisual, n: nVisual, C: [
            {c: 'checkbox-icon', C: checkbox}
        ]};

        if (hasWrapper){
            result = {c: 'jsCheckboxWrapper ' + (cWrapper || ''), n: nWrapper,
                C: visual
            }
        } else{
            result = visual;
        }

        return result;

    };
});