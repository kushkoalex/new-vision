/**
 * Ховер
 * ! Работает НА ВСЁМ !
 * @param {HTMLElement} $node DOMNode относительно которого нужно отслеживать ховер
 * @param {Function} [inCallback] калбек начала ховера
 * @param {Function} [outCallback] калбек конца ховера
 * @param {Function} [moveCallback] калбек движения по элементу во время ховера
 * @returns {Function} destructor
 */
(function(global, a9){
    var clearTimeout = global.clearTimeout,
        setTimeout = global.setTimeout,
        $body,
        a9Store = a9.store,
        storage = [],
        i,
        iMax = 0,
        timeOut,
        hoveredIndex,
        u,
        isHoverFriendly;
    if (a9.deviceInfo.isTouch){
        isHoverFriendly = null;
        global.addEventListener('pageshow', function(){
            clearTimeout(timeOut);
            if (hoveredIndex !== -1){
                reset();
            }
        });
        function reset(){
            storage[hoveredIndex + 4] = false;
            if ((hoveredIndex !== u) && (storage[hoveredIndex + 2] !== u)){
                storage[hoveredIndex + 2].call(storage[hoveredIndex], u, true);
            }
            hoveredIndex = -1;
        }
        function countReset(index){
            hoveredIndex = index;
            clearTimeout(timeOut);
            timeOut = setTimeout(reset, 1000);
        }
        a9.hover = function($node, inCallBack, outCallBack, moveCallBack){
            if ($body === u){
                $body = global.document.body;
                $body.addEventListener('touchmove', function(e){
                    for (i = 0; i < iMax; i += 5){
                        if (a9.testParentOf(a9Store.touchOnElement, storage[i])){
                            if (!storage[i + 4] && (storage[i + 1] !== u)){
                                storage[i + 1].call(storage[i], e);
                            }
                            if (storage[i + 3] !== u){
                                storage[i + 3].call(storage[i], e);
                            }
                            storage[i + 4] = true;
                            countReset(i);
                        } else if (storage[i + 4]){
                            storage[i + 4] = false;
                            if (storage[i + 2] !== u){
    //                            false in call is touchmove out flag
                                storage[i + 2].call(storage[i], e, false);
                            }
                        }
                    }
                });
                $body.addEventListener('touchstart', function(e){
                    for (i = 0; i < iMax; i += 5){
                        if (a9.testParentOf(a9Store.touchOnElement, storage[i])){
                            storage[i + 4] = true;
                            countReset(i);
                            if (storage[i + 1] !== u){
                                storage[i + 1].call(storage[i], e);
                            }
                        }
                    }
                });
                $body.addEventListener('touchend', function(e){
                    for (i = 0; i < iMax; i += 5){
                        if (storage[i + 4]){
                            storage[i + 4] = false;
                            clearTimeout(timeOut);
                            if ((storage[i + 2] !== u) && a9.testParentOf(a9Store.touchOnElement, storage[i])){
    //                            true in call is touchend out flag
                                storage[i + 2].call(storage[i], e , true);
                            }
                        }

                    }
                });
            }
            storage.push($node, inCallBack, outCallBack, moveCallBack, false);
            iMax += 5;
            return {
                destructor: function destructor(onDestruction){
                    a9.slice(storage, a9.arrayIndexOf(storage, $node), 5);
                    iMax -= 5;
                    $node = inCallBack = outCallBack = moveCallBack = null;
                    if (onDestruction !== u){
                        onDestruction();
                    }
                    destructor = onDestruction = null;
                }
            };
        };
    } else{
        timeOut = hoveredIndex = null;
        a9.hover = function($node, inCallBack, outCallBack, moveCallBack){
            var timeout,
                isIn = false,
                eventCache;
            if ($body === u){
                $body = global.document.body;
                isHoverFriendly = $node.onmouseleave !== u;
            }
            function hoverOut(e){
                isIn = false;
                e = e || eventCache;
                if (outCallBack !== u){
                    outCallBack.call($node, e);
                }
            }
            function hoverIn(e){
                if (inCallBack !== u){
                    inCallBack.call($node, e);
                }
            }
            if (moveCallBack !== u){
                a9.addEvent($node, 'mousemove', moveCallBack);
            }
            if (isHoverFriendly){
                a9.addEvent($node, 'mouseenter', hoverIn);
                a9.addEvent($node, 'mouseleave', hoverOut);
                return {
                    destructor: function destructor(onDestruction){
                        a9.removeEvent($node, 'mouseenter', hoverIn);
                        a9.removeEvent($node, 'mouseleave', hoverOut);
                        if (moveCallBack !== u){
                            a9.removeEvent($node, 'mousemove', moveCallBack);
                        }
                        moveCallBack = inCallBack = outCallBack = hoverIn = hoverOut = $node = timeout = eventCache = isIn = null;
                        if (onDestruction !== u){
                            onDestruction();
                        }
                        destructor = onDestruction = null;
                    }
                };
            } else{
                function over(e){
                    if (!isIn){
                        isIn = true;
                        hoverIn(e);
                    } else{
                        clearTimeout(timeout);
                    }
                }
                function out(e){
                    eventCache = e;
                    timeout = setTimeout(hoverOut, 1);
                }
                a9.addEvent($node, 'mouseover', over);
                a9.addEvent($node, 'mouseout', out);
                return {
                    destructor: function destructor(onDestruction){
                        a9.removeEvent($node, 'mouseover', over);
                        a9.removeEvent($node, 'mouseout', out);
                        a9.removeEvent($node, 'mousemove', moveCallBack);
                        moveCallBack = inCallBack = outCallBack = hoverIn = hoverOut = over = out = $node = timeout = eventCache = isIn = null;
                        if (onDestruction !== u){
                            onDestruction();
                        }
                        destructor = onDestruction = null;
                    }
                };
            }
        };
    }

}(this, A9));