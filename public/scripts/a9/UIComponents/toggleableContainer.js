(function(a9){
    var deviceInfo = a9.deviceInfo,
        eventOnPointerEnd = deviceInfo.eventOnPointerEnd,
        isTransitions = deviceInfo.isTransitions,
        eTransitionEnd = deviceInfo.eTransitionEnd,
        requestAF = deviceInfo.requestAF,
        toggleableContainers = [],
        $headers = [],
        $contentWrappers = [],
        showedCSSClass = 'isToggleableContainerShowed',
        inDoingCSSClass = 'isToggleableContainerInDoing',
        opensCSSClass = 'isToggleableContainerOpens',
        closesCSSClass = 'isToggleableContainerCloses',
        openAttribute = 'data-a9-toggleable-container-open',
        toggleableContainerPrototype,
        requestAnimationFrameParameters = [];

    function ToggleableContainer($header, $body){
        var toggleableContainer = this,
            $contentWrapper;
        toggleableContainer.$header = $header;
        toggleableContainer.$body = $body;
        toggleableContainer.$contentWrapper
            = $contentWrapper
            = a9.getParentByClass($body, 'jsToggleableContainerContentWrapper');
        toggleableContainer.$wrapper
            = a9.getParentByClass($header, 'jsToggleableContainerWrapper');

        toggleableContainer.isOpen = false;
        toggleableContainer.isOpens = false;
        toggleableContainer.isInDoing = false;
        toggleableContainer._isIgnoreTransitionEnd = false;

        a9.addEvent($header, eventOnPointerEnd, onHeaderInteraction);

//        todo[2] animation without transitions for old browser
        if (isTransitions){
            a9.addEvent($contentWrapper, eTransitionEnd, onTransitionEnd);
        }

        toggleableContainers.push(toggleableContainer);
        $headers.push($header);
        $contentWrappers.push($contentWrapper);

        if (a9.hasAttribute($header, openAttribute)){
            toggleableContainer.forceShow();
        }
    }

    function onHeaderInteraction(){
        var toggleableContainer = toggleableContainers[a9.arrayIndexOf($headers, this)];
        if (toggleableContainer.isOpens){
            toggleableContainer.hide();
        } else{
            toggleableContainer.show();
        }
    }

    function onTransitionEnd(e){
        var toggleableContainer = toggleableContainers[a9.arrayIndexOf($contentWrappers, this)];
        if (e.target === toggleableContainer.$contentWrapper){
            onToggleEnd(toggleableContainer);
        }
    }

    function onToggleEnd(toggleableContainer){
        var $wrapper = toggleableContainer.$wrapper;
        toggleableContainer.isInDoing = false;
        if (toggleableContainer.isOpens){
            toggleableContainer.isOpen = true;
            toggleableContainer.$contentWrapper.style.height = 'auto';
            a9.removeClass($wrapper, opensCSSClass);
        } else{
            a9.removeClass($wrapper, closesCSSClass);
            a9.removeClass($wrapper, showedCSSClass);
            toggleableContainer.isOpen = false;
        }
        a9.removeClass($wrapper, inDoingCSSClass);
        a9.generateCustomEvent(toggleableContainer, 'toggled', toggleableContainer.isOpen);
    }

    toggleableContainerPrototype = ToggleableContainer.prototype;

    function nextAnimationFrame(fn, toggleContainer, parameter){
        requestAF(onNextAnimationFrame);
        requestAnimationFrameParameters.push(fn, toggleContainer, parameter);

    }
    function onNextAnimationFrame(){
        var fn = requestAnimationFrameParameters.shift(),
            toggleContainer = requestAnimationFrameParameters.shift(),
            parameter = requestAnimationFrameParameters.shift();
        fn(toggleContainer, parameter);
    }

    toggleableContainerPrototype.show = function(){
        var toggleableContainer = this,
            $wrapper;
        if (!toggleableContainer.isOpens){
            toggleableContainer.isOpens = true;
            $wrapper = toggleableContainer.$wrapper;
            a9.addClass($wrapper, showedCSSClass);
//            todo change after todo[2]
            if (!isTransitions){
                onToggleEnd(toggleableContainer);
            } else{
                toggleableContainer.isInDoing = true;
                a9.removeClass($wrapper, closesCSSClass);
                a9.addClass($wrapper, inDoingCSSClass);
                a9.addClass($wrapper, opensCSSClass);
                toggleableContainer.$contentWrapper.style.height = toggleableContainer.$body.offsetHeight + 'px';
            }

        }
        return toggleableContainer;
    };

    function continueHide(toggleableContainer){
//        second 2 animation frame delay for CSS3 animation (it's stupid and fub but need for CSS3 transitions)
        nextAnimationFrame(continueHide2, toggleableContainer);
    }

//    see continueHide(fn) inner comment
    function continueHide2(toggleableContainer){
        a9.addClass(toggleableContainer.$wrapper, closesCSSClass);
        toggleableContainer.$contentWrapper.style.height = '0px';
        toggleableContainer.isOpens = false;
    }

    toggleableContainerPrototype.hide = function(){
        var toggleableContainer = this,
            $wrapper;
        if (toggleableContainer.isOpens){
            toggleableContainer.isOpens = false;
//            todo change after todo[2]
            if (!isTransitions){
                onToggleEnd(toggleableContainer);
            } else{
                toggleableContainer.isInDoing = true;
                $wrapper = toggleableContainer.$wrapper;
                a9.removeClass($wrapper, opensCSSClass);
                a9.addClass($wrapper, inDoingCSSClass);
                toggleableContainer.$contentWrapper.style.height = toggleableContainer.$contentWrapper.offsetHeight + 'px';
//                animation frame delay for CSS3 animation
                nextAnimationFrame(continueHide, toggleableContainer);
            }
        }
        return toggleableContainer;
    };

    toggleableContainerPrototype.forceShow = function(){
        var toggleableContainer = this;
        if (!toggleableContainer.isOpens){
            toggleableContainer.isOpens = true;
            a9.addClass(toggleableContainer.$wrapper, showedCSSClass);
            onToggleEnd(toggleableContainer);
        }
    };

    toggleableContainerPrototype.forceHide = function(){
        var toggleableContainer = this;
        if (toggleableContainer.isOpens){
            toggleableContainer.isOpens = false;
            onToggleEnd(toggleableContainer);
        }
    };

    toggleableContainerPrototype.destructor = function(){
//        todo[1] destructor
    };

    a9.toggleableContainer = function($header, $inner){
        var index = a9.arrayIndexOf($headers, $header);
        if (index !== -1){
            return toggleableContainers[index];
        } else{
            return new ToggleableContainer($header, $inner);
        }
    };

}(A9));