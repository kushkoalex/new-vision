JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls;
    
    tmpls.icon = {c: 'jmf-icon'};
    
    tmpls.tooltip = function(tooltipData){
        var type,
            content,
            textContent,
            u;

        if (typeof tooltipData === 'string'){
            type = tooltipData;
            content = tmpls.icon;
        } else{
            type = tooltipData.type;

            if ('H' in tooltipData){
                textContent = {c: 'jmf-tooltip-text', H: tooltipData.H}
            } else if ('text' in tooltipData){
                textContent = {c: 'jmf-tooltip-text', t: tooltipData.text};
            }

            if (textContent !== u){
                content = [
                    tmpls.icon,
                    {c: 'jmf-tooltip-hover-part'},
                    {c: 'jmf-tooltip-content-wrapper', C:[
                        {c: 'jmf-tooltip-text-wrapper', C:
                            textContent
                        },
                        {c: 'jmf-tooltip-text-triangle-wrapper', C: [
                            {c: 'jmf-tooltip-text-triangle-border'},
                            {c: 'jmf-tooltip-text-triangle'}
                        ]}
                    ]}
                ];
            } else{
                content = '';
            }
        }

        return {c: 'jmf-tooltip jmf-tooltip_' + type,
            n: 'tooltip',
            C: content
        };
    };
});