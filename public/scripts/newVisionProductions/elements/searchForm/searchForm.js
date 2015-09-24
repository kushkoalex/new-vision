NV.searchForm = function ($parent,searchUrl) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        searchFormDataModel = settings.dataModels.searchForm,
        eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
        $fragment,
        $artistCategorySelect,
        $artCategorySelect,
        $artCategorySelectWrapper,
        build,
        selectedTags=[],
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
    $sfTagsWrapper = build.sfTagsWrapper;
    $btnSubmit = build.btnSubmit;

    var $tags = a9.$n('cb');




    a9.addEvent($sfTagsWrapper, eventOnPointerEnd, function(){
        collectSelectedTags()
    });



    function onArtistCategorySelectChange() {
        var selectedIndex = this.selectedIndex,
            artBuild,
            $art
            ;


        artistCategorySelectSelectedIndex = selectedIndex;
        artistCategorySelectValue = this.options[selectedIndex].value;

        $fragment = global.document.createDocumentFragment();

        artBuild = tp('vSelect', {
            options: searchFormDataModel.authorCategories[selectedIndex].categories,
            selectedIndex: 0,
            n: 'artCategorySelect'
        }, $fragment);

        artCategorySelectSelectedIndex = 0;

        $artCategorySelectWrapper.innerHTML = '';
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

    function aaa() {
        var tags = searchFormDataModel.authorCategories[artistCategorySelectSelectedIndex].categories[artCategorySelectSelectedIndex].tags,
            $fragment = global.document.createDocumentFragment(),
            artBuild,
            $art
            ;


        tp('tagList', {
            options: tags,
            n: 'sfTags'
        }, $fragment);
        $sfTagsWrapper.innerHTML = '';

        $sfTagsWrapper.appendChild($fragment);


        //alert(artistCategorySelectValue+' '+artCategorySelectValue);
    }


    artCategorySelectSelectedIndex = 0;
    artistCategorySelectSelectedIndex = 0;

    artistCategorySelectValue = $artistCategorySelect.options[0].value;
    artCategorySelectValue = $artCategorySelect.options[0].value;

    a9.addEvent($artistCategorySelect, 'change', onArtistCategorySelectChange);
    a9.addEvent($artCategorySelect, 'change', onArtCategorySelectChange);




    aaa.call();


    var $layout = a9.$('searchFormLayout');
    var $popup = a9.$('searchFormPopup');

    a9.addEvent($layout, 'click', function(){
        this.style.display ='none';
    });

    a9.addEvent($popup, 'click', function(e){
        e.stopPropagation();
    });

    var $popuplink = a9.$c('popuplink')[0];

    a9.addEvent($popuplink, 'click', function(){
        $layout.style.display ='block';
    });

    a9.addEvent($btnSubmit, 'click', formSubmit);


    function collectSelectedTags(){
        selectedTags=[];
        var checkboxes = a9.$n('cb');
        for (var i = 0, n = checkboxes.length; i < n; i++) {

            if (checkboxes[i].checked) {
                //alert(checkboxes[i].getAttribute('data-value'));
                selectedTags.push(checkboxes[i].getAttribute('data-value'));
            }
        }

        if(selectedTags.length>0){
            a9.addClass($btnSubmit,'active');
        }
        else{
            a9.removeClass($btnSubmit,'active');
        }
    }


    function formSubmit() {
        console.log(selectedTags);

        collectSelectedTags();
        var form = a9.$('sForm');
        form.action = a9.supplant(searchUrl, {tagsId: selectedTags.join('-')});
        if(selectedTags.length>0) {
            form.submit();
        }
    }

};
