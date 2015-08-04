NV.searchForm = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        searchFormDataModel = settings.dataModels.searchForm,
        $fragment,
        $artistCategorySelect,
        $artCategorySelect,
        $artCategorySelectWrapper,
        build,

        artistCategorySelectSelectedIndex,
        artistCategorySelectValue,
        artCategorySelectSelectedIndex,
        artCategorySelectValue,
        $sfTagsWrapper,
        $btnSubmit,
        $sForm
        ;


    build = tp('searchForm', searchFormDataModel, $parent);
    $artistCategorySelect = build.artistCategorySelect;
    $artCategorySelect = build.artCategorySelect;
    $artCategorySelectWrapper = build.artCategorySelectWrapper;
    $sfTagsWrapper=build.sfTagsWrapper;
    $btnSubmit=build.btnSubmit;
    //$sForm=build.sForm;

    function onArtistCategorySelectChange() {
        var selectedIndex = this.selectedIndex,
            artBuild,
            $art
            ;




        artistCategorySelectSelectedIndex=selectedIndex;
        artistCategorySelectValue = this.options[selectedIndex].value;

        $fragment = global.document.createDocumentFragment();

        artBuild =tp('vSelect', {
            options: searchFormDataModel.authorCategories[selectedIndex].categories,
            selectedIndex: 0,
            n: 'artCategorySelect'
        }, $fragment);

        artCategorySelectSelectedIndex=0;

        $artCategorySelectWrapper.innerHTML='';
        $art = artBuild.artCategorySelect;



        $artCategorySelectWrapper.appendChild($fragment);
        a9.addEvent($art, 'change', onArtCategorySelectChange);
        aaa.call();
    }

    function onArtCategorySelectChange() {
        artCategorySelectSelectedIndex = this.selectedIndex;
        artCategorySelectValue = this.options[this.selectedIndex].value;
        aaa.call();

    }

    function aaa(){
        var tags  = searchFormDataModel.authorCategories[artistCategorySelectSelectedIndex].categories[artCategorySelectSelectedIndex].tags,
        $fragment = global.document.createDocumentFragment(),

            artBuild,
            $art
            ;


        tp('tagList', {
            options: tags,
            n: 'sfTags'
        }, $fragment);
        $sfTagsWrapper.innerHTML='';

        $sfTagsWrapper.appendChild($fragment);


        //alert(artistCategorySelectValue+' '+artCategorySelectValue);
    }





    artCategorySelectSelectedIndex=0;
    artistCategorySelectSelectedIndex=0;

    artistCategorySelectValue = $artistCategorySelect.options[0].value;
    artCategorySelectValue = $artCategorySelect.options[0].value;

    a9.addEvent($artistCategorySelect, 'change', onArtistCategorySelectChange);
    a9.addEvent($artCategorySelect, 'change', onArtCategorySelectChange);

    aaa.call();


    a9.addEvent($btnSubmit, 'click', formSubmit);

    function formSubmit(){
        var checkboxes = a9.$n('cb'),
            tagsId =[];

        for(var i=0, n=checkboxes.length;i<n;i++) {

            if(checkboxes[i].checked){
                //alert(checkboxes[i].getAttribute('data-value'));
                tagsId.push(checkboxes[i].getAttribute('data-value'));
            }

        }


        //alert(tagsId.join('-'));

var form  = a9.$('sForm');

        form.action = a9.supplant(settings.controlsDescriptors.site.searchFilterUrl,{tagsId:tagsId.join('-')});
        form.submit();


        //console.log(checkboxes);
    }

};
