(function (nv) {
    var a9 = nv.global.A9;

    nv.tmpls.vSelect = function (data) {

        var options = [];


        a9.each(data.options, function (option, i) {
            options.push({e: 'option', a: {value: option.value}, t: option.title})
        });

        return {e: 'select', n: data.n, C: options};


    };

    nv.tmpls.tagList = function (data) {
        var tags = [];
        a9.each(data.options, function (option, i) {
            tags.push({
                c: 'tag-wrapper', C: [
                    {
                        e: 'input', a: {type: 'checkbox', name: 'cb', 'data-value': option.value}
                    },
                    {
                        e: 'span', t: option.text
                    }]
            })
        });
        return tags;
    }

}(NV));