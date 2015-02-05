JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9;

    /**
     *
     * @param {Object} settings
     * {
         //textarea v
         [v: {String}],
         //textarea c
         [c: {String}],
         //textarea n
         [n: {String|Array}],
         //textarea T
         [T: {String}]
         //textarea i
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

         //icon css class for visual textarea
         [icon: {String}]
         // textarea a
         [a: {Object}],
         //textarea name attribute
         [name: {String}],
         //placeholder text (add label)
         [placeholder: {String}]
         //innerContent
         [innerContent: {Array|Object|String}]
     }
     * @returns {Object}
     */
    tmpls.textarea = function(settings){
        var textarea,
            visual,
            result,
            a,
            T = settings.T || 'text',

            cInput = 'textarea jsRealInput',
            nInput = 'textarea',

            cVisual = '',
            nVisual = 'textareaVisual',

            cWrapper,
            nWrapper,

            hasWrapper = false,
            index,

            textareaInnerContent = [],
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
                nWrapper = 'textareaWrapper';
            }
        }


        if (settings.a !== u){
            a = settings.a;
            if (a.id !== u){
                inputID = a.id;
            }
        }

        if (settings.name !== u){
            if (a === u){
                a = {name: settings.name};
            } else{
                a.name = settings.name;
            }
        }

        if (a === u){
            textarea = {e: 'textarea', T: T, c:  cInput, n: nInput};
        } else{
            textarea = {e: 'textarea', T: T, c:  cInput, n: nInput, a: a};
        }
        textareaInnerContent.push(textarea);

        if (settings.v !== u){
            textarea.v = settings.v;
        }
        if (settings.i !== u){
            inputID = settings.i;
            textarea.i = inputID;
        }

        if (settings.icon !== u){
            textareaInnerContent.push(tmpls.icon);
            index = cVisual.indexOf(' ');
            if (index === -1){
                cVisual += ' ' + cVisual + '_hasIcon';
            } else{
                cVisual += ' ' + cVisual.substr(0, index) + '_hasIcon';
            }
            cVisual += ' ' + settings.icon;
        }

        if (settings.placeholder !== u){
            label = {e: 'label', c: 'textarea-placeholder-label', t: settings.placeholder};
            if (inputID !== null){
                label.a = {for: inputID};
            }
            textarea.c += ' jsRealPlaceholderInput';
            if (hasWrapper){
                cWrapper += ' jsPlaceholderWrapper';
            } else{
                cVisual += ' jsPlaceholderWrapper';
            }
            textareaInnerContent.unshift(label);
        }

        if (settings.innerContent !== u){
            innerContent = settings.innerContent;
            if (a9.isArray(innerContent)){
                for (i = 0, iMax = innerContent.length; i < iMax; i += 1) {
                    textareaInnerContent.push(innerContent[i]);
                }
            } else{
                textareaInnerContent.push(settings.innerContent);
            }
        }

        visual = {c: 'jsVisualInput ' + cVisual, n: nVisual, C:
            {c: 'textarea-inner', C: textareaInnerContent}
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
