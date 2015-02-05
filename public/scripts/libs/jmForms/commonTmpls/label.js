JMFORMS.modulesForInit.push(function(jmf){
    var l10n = jmf.global.A9.l10n;
    jmf.tmpls.label = function(settings){
        var labelText = {c: 'jmf-field-label-text-wrapper', H: settings.H};
        if (!settings.isRequired){
            labelText.C = {c: 'jmf-field-label-required-status', t: l10n('jmfFieldNotRequired')};
        }
        return {e: 'label',
            a: {'for': settings['for']},
            c: 'jmf-field-label ' + settings.c,
            C: {c: 'jmf-field-label-inner',
                C: {c: 'jmf-field-label-text',
                    C: labelText
                }
            }
        };
    };
});
