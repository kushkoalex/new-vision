(function(global, a9){
    a9.router = function(externalLinks, externalLinksCallbackPath, isByHash, onChange){
        var location = global.location,
            history = global.history,
            staticPath = location.protocol + '//' + location.host,
            staticPathLength = staticPath.length,
            historyObject = {
                note: null,
                path: '/'
            },
            pathCache = [],
            strPathCache = '',
            hrefCache,
            checkCache,
            links,
            linkPath,
            i,
            j,
            jMax,
            isFromLink = false,
            isNotFromLoad = true,
            setAddress,
            router = {
                onChange: onChange || [],
                set: null,
                get: function(){
                    return pathCache;
                },
                linksForRouter: function(node){
                    links = a9.$tn('a', node);
                    for (i = links.length; i-- ;){
                        router.linkForRouter(links[i]);
                    }
                    links = i = null;
                },
                linkForRouter: function(link){
                    // TODO разобраться с событиями и для тача
                    link.onclick = linkForRouter;
                    return link;
                }
            },
            u;

        if ((isByHash === true)
            || !(
                ('history' in global)
                && ('onpopstate' in global)
                && ('pushState' in history)
            )){
            checkCache = location.href.substr(staticPathLength + 1);
            if (checkCache.indexOf('#') !== 0){
                location.href = staticPath + '#/' + checkCache;
            }
            checkCache = staticPathLength + 2;
            setAddress = function(path){
                location.hash = path;
            };
            function checkPath(){
                if (hrefCache !== location.href){
                    hrefCache = location.href;
                    if (isFromLink){
                        isFromLink = false;
                    } else{
                        parseState(location.href.substr(checkCache));
                    }
                }
            }
            checkPath();
            a9.repeatedInspections.add(checkPath);
        } else{
            checkCache = location.href.substr(staticPathLength + 1);
            if (checkCache.indexOf('#') === 0){
                location.href = staticPath + checkCache.substr(1);
            }
            setAddress = function(path, note){
                historyObject.note = note = note || new Date().getTime().toString();
                historyObject.path = path;
                history.pushState(historyObject, note, path);
            };
            if (a9.deviceInfo.isWebKit){
                global.addEventListener('load', function(){
                    isNotFromLoad = false;
                });
            }
            function popState(){
                if (isNotFromLoad){
                    parseState(location.href.substr(staticPathLength));
                } else{
                    isNotFromLoad = true;
                }
            }
            global.addEventListener('popstate', popState);
            popState();
            checkCache = null;
        }

        router.set = function(){
            var path = '/' + a9.joinArgs(arguments, '/');
            setAddress(path);
            parseState(path);
        };

        function parseState(path){
            strPathCache = path;
            a9.split(path, '/', pathCache);
            pathCache.shift();
            if (pathCache[pathCache.length - 1] === ''){
                pathCache.pop();
            }
            jMax = router.onChange.length;
            if (jMax > 0){
                for (j = 0; j < jMax; j += 1){
                    router.onChange[j].apply(router, pathCache);
                }
            }
            jMax = j = path = null;
        }

        externalLinks = externalLinks || '/auth/';
        externalLinksCallbackPath = externalLinksCallbackPath || '?callback=';

        function toLink(link, path, trueLink){
            if (path.indexOf(trueLink) === 0){
                location.href = link.href + externalLinksCallbackPath + strPathCache;
            } else{
                isFromLink = path !== strPathCache;
                setAddress(path, link.getAttribute('data-history'));
                parseState(path);
            }
        }

        function linkForRouter(e){
            if (e === u){
                global.event.returnValue = false;
            } else{
                e.preventDefault();
            }
            linkPath = this.href.substr(staticPathLength);
            if (a9.isArray(externalLinks)){
                for (i = externalLinks.length; i-- ;){
                    toLink(this, linkPath, externalLinks[i]);
                }
            } else{
                toLink(this, linkPath, externalLinks);
            }
        }
        return router;
    };
}(this, A9));