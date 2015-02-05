//todo to normal component
//todo checkY method
//todo check header or footer needs by classes
(function(global, a9){
    /**
     * приклеивающиеся панели
     * @param {HTMLElement} $rootNode элемент внутри которого панели (от него будет считаться)
     * @param {Boolean} isDoInit
     * @param {String} headerFixedCSSClass
     * @param {String} footerFixedCssClass
     * @returns {{init: init, calculate: calculate}}
     */
    a9.stickyPanels = function($rootNode, isDoInit, headerFixedCSSClass, footerFixedCssClass){
        var window = global,
            $html = window.document.documentElement,
            rootY,
            paymentWizardHeight,
            viewPortHeight,
            scrollTop,
            footerFixedY,
            isInit = false;

        function processingPaymentWizardY(){
            footerFixedY = rootY + paymentWizardHeight - viewPortHeight;
        }

        function calculate(){
            if (!isInit){
                viewPortHeight = a9.viewportHeight();
                isInit = true;
            }
            rootY = a9.getPositionY($rootNode);
            paymentWizardHeight = $rootNode.offsetHeight;
            scrollTop = window.scrollY;
            processingPaymentWizardY();
            checkFixedPanels();

        }

        function checkHeaderFixed(){
            if (scrollTop >= rootY){
                a9.addClass($rootNode, headerFixedCSSClass);
            } else{
                a9.removeClass($rootNode, headerFixedCSSClass);
            }
        }

        function checkFooterFixed(){
            if (scrollTop <= footerFixedY){
                a9.addClass($rootNode, footerFixedCssClass);
            } else{
                a9.removeClass($rootNode, footerFixedCssClass);
            }
        }

        function checkFixedPanels(){
            checkHeaderFixed();
            checkFooterFixed();
        }

        a9.addEvent(window, 'scroll', function(){
            if(a9.deviceInfo.isIE)
            {
                scrollTop = window.pageYOffset;
            }
            else
            {
                scrollTop = window.scrollY;
            }
            checkFixedPanels();
        });

        function resizeWindow(){
            viewPortHeight = a9.viewportHeight();
            calculate();
        }

        a9.addEvent(window, 'resize', resizeWindow);


        if (isDoInit === true){
            calculate();
        }

        return {
            calculate: calculate
        };

    };
}(this, A9));
