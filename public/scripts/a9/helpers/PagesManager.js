(function(global, a9){
    var pagesManagerPrototype,
        pagePrototype,
        u,
        nonePageName = u,
        pagesBuildersNamespace;

    a9.setPagesNamespace = function(namespace){
        pagesBuildersNamespace = namespace;
    };

    a9.Page = function(pageSystemName, pageNameInApp, pageParent){
        var page = this,
            cnCt = global.cnCt,
            build = cnCt.tp(pageNameInApp || 'page_' + pageSystemName);
        page.isShowed = false;
        page.beforeShow = null;
        page.afterShow = null;
        page.beforeUpdate = null;
        page.afterUpdate = null;
        page.beforeHide = null;
        page.afterHide = null;
        page.systemName = pageSystemName;
        page.$page = build.page;
        page.$content = build.content;
        page.ofPM = null;
        page.pm = null;
        page.parentPage = null;
        page.isHasChild = false;
        if (pageParent instanceof a9.PagesManager){
            pageParent.addPage(page);
        } else if (pageParent instanceof a9.Page){
            if (pageParent.pm === null){
                pageParent.pm = new a9.PagesManager(pageParent.$content);
                pageParent.isHasChild = true;
            }
            page.parentPage = pageParent;
            pageParent.pm.addPage(page);
        }
        page.appModule = pagesBuildersNamespace[pageNameInApp || 'page_' + pageSystemName](build, page);
    };
    pagePrototype = a9.Page.prototype;

    pagePrototype.show = function(childPageName){
        var page = this;
        page.isShowed = true;
        if (page.beforeShow !== null){
            page.beforeShow.apply(page, arguments);
        }
        page.ofPM.$content.appendChild(page.$page);
        if (page.afterShow !== null){
            page.afterShow.apply(page, arguments);
        }
        if (page.isHasChild){
            page.pm.switchPage.apply(page.pm, arguments);
        }
        return page;
    };
    pagePrototype.update = function(childPageName){
        var page = this;
        if (page.beforeUpdate !== null){
            page.beforeUpdate.apply(page, arguments);
        }
        if (page.isHasChild){
            page.pm.switchPage.apply(page.pm, arguments);
        }
        if (page.afterUpdate !== null){
            page.afterUpdate.apply(page, arguments);
        }
        return page;
    };
    pagePrototype.hide = function(){
        var page = this;
        if (page.isHasChild){
            page.pm.hide(arguments);
        }
        if (page.beforeHide !== null){
            page.beforeHide(arguments);
        }
        page.ofPM.$content.removeChild(page.$page);
        if (page.afterHide !== null){
            page.afterHide(arguments);
        }
        page.isShowed = false;
        return page;
    };
    pagePrototype.destructor = function(){
        var page = this;
        if (page.isHasChild){
            page.pm.destruct();
            page.pm = null;
        }
        page.ofPM.removePage(page);
        page.ofPM = null;
        if ((page.appModule !== u) && ('destructor' in page.appModule)){
            page.appModule.destructor();
            page.appModule = null;
        }
        page.parentPage = null;
        page.$page = null;
        page.$content = null;
        page.systemName = null;
        //methods
        page.show = null;
        page.beforeShow = null;
        page.afterShow = null;
        page.hide = null;
        page.beforeHide = null;
        page.afterHide = null;
        page.destructor = null;
    };

    a9.PagesManager = function($content){
        var pagesManager = this;
        pagesManager.pages = {};
        pagesManager.$content = $content;
        pagesManager.currentPageName = nonePageName;
    };
    pagesManagerPrototype = a9.PagesManager.prototype;

    pagesManagerPrototype.addPage = function(page){
        var pagesManager = this;
        pagesManager.pages[page.systemName] = page;
        page.ofPM = pagesManager;
        return pagesManager;
    };
    pagesManagerPrototype.createPage = function(pageSystemName, pageNameInApp, pageParent){
        var pagesManager = this,
            page = new a9.Page(pageSystemName, pageNameInApp, pageParent);
        pagesManager.addPage(page);
        return page;
    };
    pagesManagerPrototype.removePage = function(page){
        var pagesManager = this;
        delete pagesManager.pages[page.systemName];
        return pagesManager;
    };
    pagesManagerPrototype.switchPage = function(){
        var pagesManager = this;
        return pagesManager.show.apply(pagesManager, arguments);
    };
    pagesManagerPrototype.show = function(pageSystemName){
        var pagesManager = this,
            pages = pagesManager.pages,
            currentPageName = pagesManager.currentPageName,
            page;
        if (pageSystemName in pages){
            if (currentPageName === pageSystemName){
                page = pagesManager.pages[currentPageName];
                page.update.apply(page, a9.copyArray(arguments, u, 1));
                return null;
            } else if (currentPageName !== nonePageName){
                page = pages[currentPageName];
                page.hide(arguments);
            }
            pagesManager.currentPageName = pageSystemName;
            page = pages[pageSystemName];
            page.show.apply(page, a9.copyArray(arguments, u, 1));
            return true;
        } else if (currentPageName !== nonePageName){
            page = pages[currentPageName];
            page.hide(arguments);
            pagesManager.currentPageName = nonePageName;
        }
        return false;
    };
    pagesManagerPrototype.hide = function(){
        var pagesManager = this,
            page = pagesManager.pages[pagesManager.currentPageName];
        if (page !== u){
            page.hide(arguments);
            pagesManager.currentPageName = nonePageName;
        }
        return pagesManager;
    };
    pagesManagerPrototype.clearPages = function(list){
        var pagesManager = this,
            pages = pagesManager.pages,
            p,
            i,
            pageName;
        if (list === u){
            for (p in pages){
                pages[p].destructor();
            }
        } else{
            for (i = list.length; i-- ;){
                if (typeof list[i] === 'string'){
                    pageName = list[i];
                } else{
                    pageName = list[i].n;
                }
                if (pagesManager.currentPageName === pageName){
                    pages[pageName].hide();
                    pagesManager.currentPageName = nonePageName;
                }
                pages[pageName].destructor();
            }
        }
        return pagesManager;
    };
    pagesManagerPrototype.destructor = function(){
        var pagesManager = this;
        pagesManager.clearPages();
        pagesManager.pages = null;
        pagesManager.$content = null;
        pagesManager.currentPageName = null;
//        methods
        pagesManager.addPage = null;
        pagesManager.createPage = null;
        pagesManager.removePage = null;
        pagesManager.switchPage = null;
        pagesManager.show = null;
        pagesManager.hide = null;
        pagesManager.clearPages = null;
        pagesManager.destructor = null;
    };

    a9.initPages = function(pages, parent){
        var i,
            iMax,
            u,
            page;
        for (i = 0, iMax = pages.length; i < iMax; i += 1){
            if (typeof pages[i] === 'string'){
                new a9.Page(pages[i], u, parent);
            } else{
                if ('N' in pages[i]){
                    page = new a9.Page(pages[i].n, pages[i].N, parent);
                } else{
                    page = new a9.Page(pages[i].n, u, parent);
                }
                if ('C' in pages[i]){
                    a9.initPages(pages[i].C, page);
                }
            }
        }
    };

    a9.clearPages = function(pages, parent){
        //todo
        parent.clearPages(pages);
    }
}(this, A9));