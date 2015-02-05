(function (global, a9) {
    var switchSliders = [],
        index = 0,
        addEvent = a9.addEvent,
        switchSliderAttribute = 'data-a9-switch-slider-id',
        switchedOnCSSClass = 'isSwitchedOn',
        u;


    function CustomSwitchSlider($switchSlider, checked) {



        var switchSlider = this,
            instanceIndex;


        switchSlider.switchedOn = checked;

        instanceIndex = index.toString();
        switchSliders[index] = switchSlider;

        $switchSlider.setAttribute(switchSliderAttribute, instanceIndex);

        switchSlider.index = index;

        switchSlider.$w = $switchSlider;

        switchSlider.$i = a9.$tn('input', $switchSlider)[0];




        addEvent($switchSlider, 'mousedown', onMouseDown);



        initSlider(switchSlider);


        index += 1;
    }

    function onMouseDown(e) {

        var switchSlider = switchSliders[+this.getAttribute(switchSliderAttribute)];
        //e.preventDefault();

        if (!switchSlider.switchedOn) {
            a9.addClass(switchSlider.$w, switchedOnCSSClass);
            switchSlider.switchedOn = true;
            switchSlider.$i.value = 'on';
        } else {
            a9.removeClass(switchSlider.$w, switchedOnCSSClass);
            switchSlider.switchedOn = false;
            switchSlider.$i.value = 'off';
        }
    }

    function initSlider(switchSlider)
    {
        if (switchSlider.switchedOn) {
            a9.addClass(switchSlider.$w, switchedOnCSSClass);
            switchSlider.switchedOn = true;
            switchSlider.$i.value = 'on';
        } else {
            a9.removeClass(switchSlider.$w, switchedOnCSSClass);
            switchSlider.switchedOn = false;
            switchSlider.$i.value = 'off';
        }
    }


    a9.switchSlider = function ($switchSlider, checked) {

        if ($switchSlider.hasAttribute(switchSliderAttribute)) {
            return switchSliders[+$switchSlider.getAttribute(switchSliderAttribute)];
        }
        return new CustomSwitchSlider($switchSlider, checked)

    }


}(this, A9));