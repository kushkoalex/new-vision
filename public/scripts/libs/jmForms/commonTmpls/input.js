JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9;

    /**
     *
     * @param {Object} settings
     * {
         //input v
         [v: {String}],
         //input c
         [c: {String}],
         //input n
         [n: {String|Array}],
         //input T
         [T: {String}]
         //input i
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

         //icon css class for visual input
         [icon: {String}]
         // input a
         [a: {Object}],
         //input name attribute
         [name: {String}],
         //placeholder text (add label)
         [placeholder: {String}]
         //innerContent
         [innerContent: {Array|Object|String}]
     }
     * @returns {Object}
     */
    tmpls.input = function(settings){
        var input,
            visual,
            result,
            a,
            T = settings.T || 'text',

            cInput = 'input jsRealInput',
            nInput = 'input',

            cVisual = '',
            nVisual = 'inputVisual',

            cWrapper,
            nWrapper,

            hasWrapper = false,
            index,

            inputInnerContent = [],
            innerContent,
            label,
            i,
            iMax,
            inputID = null,
            u;

        if (settings.c !== u){
            cInput += settings.c;
        }

        if (settings.n !== u){
            nInput= settings.n;
        }

        if (settings.cVisual !== u){
            cVisual = settings.cVisual;
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


        if (settings.a !== u){
            if (settings.a.id !== u){
                inputID = settings.a.id;
            }
            a = settings.a;
        }

        if (settings.name !== u){
            if (a === u){
                a = {name: settings.name};
            } else{
                a.name = settings.name;
            }
        }

        if (a === u){
            input = {e: 'input', T: T, c:  cInput, n: nInput};
        } else{
            input = {e: 'input', T: T, c:  cInput, n: nInput, a: a};
        }
        inputInnerContent.push(input);

        if (settings.v !== u){
            input.v = settings.v;
        }
        if (settings.i !== u){
            inputID = settings.i;
            input.i = inputID;
        }

        if (settings.icon !== u){
            inputInnerContent.push(tmpls.icon);
            index = cVisual.indexOf(' ');
            if (index === -1){
                cVisual += ' ' + cVisual + '_hasIcon';
            } else{
                cVisual += ' ' + cVisual.substr(0, index) + '_hasIcon';
            }
            cVisual += ' ' + settings.icon;
        }

        if (settings.placeholder !== u){
            label = {e: 'label', c: 'input-placeholder-label', t: settings.placeholder};
            if (inputID !== null){
                label.a = {for: inputID};
            }
            input.c += ' jsRealPlaceholderInput';
            if (hasWrapper){
                cWrapper += ' jsPlaceholderWrapper';
            } else{
                cVisual += ' jsPlaceholderWrapper';
            }
            inputInnerContent.unshift(label);
        }

        if (settings.innerContent !== u){
            innerContent = settings.innerContent;
            if (a9.isArray(innerContent)){
                for (i = 0, iMax = innerContent.length; i < iMax; i += 1) {
                    inputInnerContent.push(innerContent[i]);
                }
            } else{
                inputInnerContent.push(settings.innerContent);
            }
        }

        visual = {c: 'jsVisualInput ' + cVisual, n: nVisual, C:
            {c: 'input-inner', C: inputInnerContent}
        };

        if (hasWrapper){
            result = {c: 'jsInputWrapper ' + (cWrapper || ''), n: nWrapper, C:
                visual
            };
        } else{
            result = visual;
        }

        return result;
    };
});
