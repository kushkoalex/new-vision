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
                {e: 'a', h: controlsDescriptors.site.mainPageUrl, c: classLogo},
                tmpls.languageSwitcher(),
                {
                    e: 'a', h: controlsDescriptors.joinUsUrl, c: 'join-us',
                    C: {H: l10n('joinUs')}
                },
                tmpls.mainMenu(mainMenuData, isMainPage)
            ]
        };
    };

    tmpls.languageSwitcher = function () {
        var languages = nv.settings.languages,
            currentLanguage = nv.settings.currentLanguage,
            content = [],
            languageItem,
            location = nv.global.location,
        //fullPath = location.protocol + '//' + location.host,
            clearLocation = location.href.toString().split(location.host)[1],
            locationWithoutLanguage='',
            locationWithoutLanguageArray;

        //console.log(location);


        //location = 'http://fashion-intention.com/ua/post/10';
        //clearLocation = '/ua/post/10';
        //clearLocation = '/ua/';

        //console.log(clearLocation.split('/ua/'));

        if(clearLocation.length==3){
            clearLocation+='/'
        }

        if (clearLocation.length > 0) {
            locationWithoutLanguageArray = clearLocation.split('/'+currentLanguage+'/');
            if (locationWithoutLanguageArray.length > 1) {
                locationWithoutLanguage = locationWithoutLanguageArray[1];
            }
        }
        else {
            locationWithoutLanguage = '';
        }

        if (locationWithoutLanguage.indexOf('/') == 0) {
            locationWithoutLanguage = locationWithoutLanguage.substr(1);
        }

        console.log(locationWithoutLanguage);


        for (var i = 0; i < languages.length; i++) {
            if (languages[i].code == currentLanguage) {
                languageItem = {e: 'span', t: languages[i].label}
            } else {


                languageItem = {
                    e: 'a',
                    h: '/' + languages[i].code + '/' + locationWithoutLanguage,
                    t: languages[i].label
                }
            }
            content.push(languageItem);
        }

        return {
            c: 'language-switcher', C: content
        }
    };

    tmpls.mainMenu = function (menuData, isMainPage) {
        var menuItems = [],
            menuItem,
            controlsDescriptors = nv.settings.controlsDescriptors,
            isActiveMenuItem = false,
            isSelectedMenuItem = false;
        for (var i = 0; i < menuData.length; i++) {
            isSelectedMenuItem = (controlsDescriptors.site.activeMenuItemId && controlsDescriptors.site.activeMenuItemId == menuData[i].id) || menuData[i].selected;
            isActiveMenuItem = menuData[i].active;

            if (isActiveMenuItem) {
                if (isMainPage) {
                    menuItem = {
                        e: 'li', c: 'active', C: {
                            e: 'a',
                            h: menuData[i].url,
                            t: menuData[i].title
                        }
                    };
                }
                else {
                    menuItem = {
                        e: 'li', c: 'active', C: {
                            e: 'span', C: {
                                e: 'a',
                                h: menuData[i].url,
                                t: menuData[i].title
                            }
                        }
                    };
                }

            }
            else if (isSelectedMenuItem) {
                if (isMainPage) {
                    menuItem = {
                        e: 'li', C: {
                            t: menuData[i].title
                        }
                    };
                } else {
                    menuItem = {
                        e: 'li', C: {
                            e: 'span',
                            t: menuData[i].title
                        }
                    };
                }

            }
            else {
                if (isMainPage) {
                    menuItem = {
                        e: 'li', C: {
                            e: 'a',
                            h: menuData[i].url,
                            t: menuData[i].title
                        }
                    };
                } else {
                    menuItem = {
                        e: 'li', C: {
                            e: 'span', C: {
                                e: 'a',
                                h: menuData[i].url,
                                t: menuData[i].title
                            }
                        }
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