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
                tmpls.mainMenu(mainMenuData)
            ]
        };
    };

    tmpls.mainMenu = function (menuData) {
        var menuItems = [], menuItem;
        for (var i = 0; i < menuData.length; i++) {
            menuItem = {
                e: 'li', C:{
                    e: 'a',
                    h: menuData[i].url,
                    t: menuData[i].title
                }
            };
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