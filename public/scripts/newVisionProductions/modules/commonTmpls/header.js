(function (nv) {
    var tmpls = nv.tmpls,
        a9 = nv.global.A9,
        l10n = a9.l10n;


    tmpls.header = function (isMainPage) {
        var controlsDescriptors = nv.settings.controlsDescriptors,
            mainMenuData = nv.settings.dataModels.mainMenu,
            classLogo = 'logo';

        if (isMainPage) {
            classLogo += ' logo-white';
        }
        return {
            c: 'header',
            C: [
                {e:'a', h:controlsDescriptors.site.mainPageUrl, c: classLogo},
                {
                    e: 'a', h: controlsDescriptors.joinUsUrl, c: 'join-us',
                    C: {H: l10n('joinUs')}
                },
                tmpls.mainMenu(mainMenuData, isMainPage)
            ]
        };
    };

    tmpls.mainMenu = function (menuData, isMainPage) {
        var menuItems = [],
            menuItem,
        controlsDescriptors = nv.settings.controlsDescriptors,
            isActiveMenuItem=false,
            isSelectedMenuItem=false;
        for (var i = 0; i < menuData.length; i++) {
            isSelectedMenuItem = (controlsDescriptors.site.activeMenuItemId&&controlsDescriptors.site.activeMenuItemId==menuData[i].id) || menuData[i].selected;
            isActiveMenuItem = menuData[i].active;

            if(isActiveMenuItem){
                if(isMainPage){
                    menuItem = {
                        e: 'li', c:'active', C: {
                            e: 'a',
                            h: menuData[i].url,
                            t: menuData[i].title
                        }
                    };
                }
                else
                {
                    menuItem = {
                        e: 'li', c:'active', C: { e:'span',C:{
                            e: 'a',
                            h: menuData[i].url,
                            t: menuData[i].title
                        }}
                    };
                }

            }
            else if(isSelectedMenuItem)
            {
                if(isMainPage){
                    menuItem ={
                        e: 'li', C: {
                            t: menuData[i].title
                        }
                    };
                }else{
                    menuItem = {
                        e: 'li', C: { e:'span',
                            t: menuData[i].title
                        }
                    };
                }

            }
            else {
                if(isMainPage){
                    menuItem = {
                        e: 'li', C: {
                            e: 'a',
                            h: menuData[i].url,
                            t: menuData[i].title
                        }
                    };
                }else{
                    menuItem = {
                        e: 'li', C: {e:'span',C:{
                            e: 'a',
                            h: menuData[i].url,
                            t: menuData[i].title
                        }}
                    };
                }

            }

            menuItems.push(menuItem);
        }

        return {
            c: 'main-menu',
            C: {
                e: 'ul', C: [
                    menuItems
                ]
            }
        }
    };

}(NV));