NV.mainPage = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        mainPageData = settings.dataModels.mainPage,
        $fragment,
        build,
        $mainBanners=[],
        $announcementImages=[]
        ;



    function buildMainPageForm(mainPageData){

        $fragment = global.document.createDocumentFragment();

        //a9.each(mainPageData.mainBanners, function(){
        //
        //
        //
        //});

        build = tp('imageFrame',mainPageData.mainBanners, $fragment);

        //$mainBanners.push()

        $mainPageContentWrapper.appendChild($fragment);



        a9.each(mainPageData.eventAnnouncements, function(announcement){

            console.log(announcement);

        });


        build = tp('announcements', mainPageData.eventAnnouncements, $fragment);

        $mainPageContentWrapper.appendChild($fragment);
    }







    var $mainPageContentWrapper = tp('mainPageContentWrapper', $parent).r;


    buildMainPageForm(mainPageData);


    //tp('mainPage', mainPageData , $parent);


};