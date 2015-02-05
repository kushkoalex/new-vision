JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls;



    tmpls.tumbler = function(tumblerSettings){
        var checkbox = {e: 'input', T: 'checkbox', c: 'jsRealTumbler', n: 'realTumbler'},
            result,
            a,
            u;



        if (tumblerSettings.isChecked === true){
            a = {checked: 'checked'};
        }

        if (tumblerSettings.name !== u){
            if (a === u){
                a = {name: tumblerSettings.name}
            } else{
                a.name = tumblerSettings.name;
            }
        }

        if (a !== u){
            checkbox.a = a;
        }


        result = {c: 'jsTumblerWrapper jmf-tumbler-wrapper', C:
            {c: 'jsTumblerVisual jmf-tumbler', C: [
                {c: 'jmf-tumbler-inner', C:
                    {c: 'jmf-tumbler-carriage-wrapper', C:
                        {c: 'jmf-tumbler-carriage-layer jsTumblerStatesLayer', C: [
                            {c: 'jmf-tumbler-on-text-wrapper jsTumblerOn', C:
                                {c: 'jmf-tumbler-on-text-inner', C:
                                    {c: 'jmf-tumbler-on-text', t: tumblerSettings.onText || ''}
                                }
                            },
                            {c: 'jmf-tumbler-off-text-wrapper jsTumblerOff', C:
                                {c: 'jmf-tumbler-off-text', t: tumblerSettings.offText || ''}
                            },
                            {c: 'jmf-tumbler-carriage jsTumblerCarriage', C:[
                                checkbox,
                                {c: 'jmf-tumbler-carriage-line_1'},
                                {c: 'jmf-tumbler-carriage-line_2'},
                                {c: 'jmf-tumbler-carriage-line_3'}
                            ]}
                        ]}
                    }
                }
            ]}
        };

        return result;
    };

});
