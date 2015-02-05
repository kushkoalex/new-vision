/**
 *
 * For work need
 *
 * from localization:
 *     firstDayOfWeek (0 or 1)
 * from helpers:
 *     dates
 *     DOMEvents
 *     customEvents
 *     localization
 *     tmpl
 *
 *
 * templates:
 *
 * [prefix] + calendar
 * needNodes:
 *      calendar
 *      prevMonth
 *      month
 *      nextMonth
 *      weekdays
 *      days
 *
 * [prefix] + calendarWeekDay
 * @param {Number} weekNumber
 *
 * [prefix] + calendarMonth
 * needNodes:
 *      month
 *
 * [prefix] + calendarDay
 * needNodes:
 *      day
 *
 * [prefix] + calendarDayOtherMonth
 * @param {Date} day
 *
 * [prefix] + calendarMonthWeek
 * @param {Date} day
 * needNodes:
 *      week
 *
 *
 * @methods
 *      prevMonth
 *          go to prev month
 *
 *      nextMonth
 *          go to next month
 *
 *      setDate
 *          change calendar date
 *          @param {Date|Number} date
 *
 *      getDate
 *          current date as object
 *          @return {Date} date
 *
 *      getTimestamp
 *          current date as timestamp
 *          @return {Number} date
 *
 *      destructor
 */
(function(global, a9){
    var tp,
        l10n = a9.l10n,
        addEvent = a9.addEvent,
        removeEvent = a9.removeEvent,
        calendarPrototype,
        calendarIndex = 1,
        calendarsStorage = {},
        calendarDataAttr = 'data-a9-calendar-index',
        dateAttr = 'data-a9-date',
        currentDayClass = 'isCurrentDay',
        eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
        defaultCalendarPrefix = '',
        defaultFirstDayOfWeek = 0,
        defaultMode = 'switchMonths',
//        defaultMode = 'chooseMonthYear',
        disabledWeekCSSClass = 'isDisabledCalendarWeek',
        defaultYearsLimit = 10,

        calendarControls,
        isInit = false,
        u;

    /**
     * @param {Object} options
     *      @param [prefix]
     *      @param [currentDate]
     *      @param [dateLimitFrom]
     *      @param [dateLimitTo]
     *      @param [yearsLimit]
     *      @param [mode]
     *      @param [firstDayOfWeek]
     * @constructor
     */
    function Calendar(options){
        var calendar = this,
            build,
            $weekdays,
            tmpls,
            prefix = options.prefix || defaultCalendarPrefix,
            mode = options.mode || defaultMode,
            dateLimitFrom,
            dateLimitTo,
            yearsLimit = options.yearsLimit || defaultYearsLimit,
            firstDayOfWeek,
            $prevMonth,
            $nextMonth,
            index,
            i;

        if ('tmpls' in options){
            tmpls = options.tmpls;
            calendar.template = function(templateName){
                return tmpls[prefix + templateName];
            }
        } else{
            calendar.template = function(templateName){
                return prefix + templateName;
            }
        }

        if ('firstDayOfWeek' in options){
            firstDayOfWeek = options.firstDayOfWeek;
        } else{
            firstDayOfWeek = l10n('firstDayOfWeek');
            if (firstDayOfWeek === 'firstDayOfWeek'){
                firstDayOfWeek = defaultFirstDayOfWeek;
            } else{
                firstDayOfWeek = +firstDayOfWeek;
            }
        }

        // basic setup
        calendar.firstDayOfWeek = firstDayOfWeek;
        calendar.mode = mode;
        calendar.index = index = calendarIndex += 1;
        calendar.currentDate = null;
        calendar.currentDateInMS = 0;
        calendar.months = {};
        calendar.$days = {};
        calendar.currentMonth = null;
        calendar.ctx = null;
        calendarsStorage[index] = calendar;

        // date limits
        if ('dateLimitFrom' in options){
            calendar.dateLimitFrom = dateLimitFrom = a9.getDate(options.dateLimitFrom);
        }
        if ('dateLimitTo' in options){
            calendar.dateLimitTo = dateLimitTo = a9.getDate(options.dateLimitTo);
        }
        if (dateLimitTo === u){
            if (dateLimitFrom === u){
                calendar.dateLimitFrom = dateLimitFrom = new Date();
            }
            calendar.dateLimitTo = new Date(dateLimitFrom.getFullYear() + yearsLimit, dateLimitFrom.getMonth(), dateLimitFrom.getDay());
        } else if (dateLimitFrom === u){
            calendar.dateLimitFrom = new Date(dateLimitTo.getFullYear() - yearsLimit, dateLimitTo.getMonth(), dateLimitTo.getDay());
        }

        // dom elements
        build = tp(calendar.template('calendar'), mode);
        calendar.$r = build.calendar;
        calendar.$weekdays = $weekdays = build.weekdays;
        calendar.$daysContainer = build.days;
        calendar.$close = build.close;
        calendar.$prevMonth = $prevMonth = build.prevMonth;
        calendar.$nextMonth = $nextMonth = build.nextMonth;
        calendar.$currentMonth = null;
        calendar.$currentDay = null;

        // prev/next switch
        $prevMonth.setAttribute(calendarDataAttr, index);
        $nextMonth.setAttribute(calendarDataAttr, index);
        addEvent($prevMonth, eventOnPointerEnd, prevMonth);
        addEvent($nextMonth, eventOnPointerEnd, nextMonth);

        // controls init
        calendar.calendarControls = calendarControls[mode];
        calendar.calendarControls.init(calendar, build.controls);

        // build weekdays labels
        if (firstDayOfWeek === 0) {
            for (i = 0; i <= 6; i += 1) {
                tp(calendar.template('calendarWeekDay'), i, $weekdays);
            }
        } else{
            for (i = 1; i <= 6; i += 1) {
                tp(calendar.template('calendarWeekDay'), i, $weekdays);
            }
            tp(calendar.template('calendarWeekDay'), 0, $weekdays);
        }

        // set initial date
        if ('currentDate' in options){
            setDate(calendar, options.currentDate);
        } else{
            switchToMonth(calendar, a9.getMonthStartMS(new Date()));
        }

        // append to parent
        if ('$parent' in options){
            options.$parent.appendChild(calendar.$r)
        }
    }

    calendarControls = {
        switchMonths: {
            init: function(calendar, $parent){
                calendar.$month = tp(calendar.template('calendarControls_' + calendar.mode), $parent).r;
            },
            onMonthYearChange: function(calendar, date){
                a9.getTextNode(calendar.$month).nodeValue = l10n('month_' + date.getMonth()) + ' ' + date.getFullYear();
            },
            destructor: function(calendar){
                calendar.$month = null;
            }
        },
        chooseMonthYear: {
            init: function(calendar, $parent){
                var build = tp(calendar.template('calendarControls_' + calendar.mode), calendar, $parent),
                    index = calendar.index,
                    $selectMonth,
                    $selectYear;

                calendar.$selectMonth = $selectMonth = build.month;
                calendar.$selectYear = $selectYear = build.year;

                $selectMonth.setAttribute(calendarDataAttr, index);
                $selectYear.setAttribute(calendarDataAttr, index);
                addEvent($selectMonth, 'change', changeMonth);
                addEvent($selectYear, 'change', changeYear);
            },
            disabledControlMonthCSSClass: 'isDisabledCalendarControlMonth',
            onMonthYearChange: function(calendar, date){
                var year = date.getFullYear(),
                    minMonth = 0,
                    maxMonth = 11,

                    dateLimitFrom = calendar.dateLimitFrom,
                    dateLimitTo = calendar.dateLimitTo,
                    disabledControlMonthCSSClass = this.disabledControlMonthCSSClass,
                    monthsOptions = calendar.$selectMonth.options,
                    monthsOptionsCount = monthsOptions.length,
                    i;

                if (year === dateLimitFrom.getFullYear()){
                    minMonth = dateLimitFrom.getMonth();
                }
                if (year === dateLimitTo.getFullYear()){
                    maxMonth = dateLimitTo.getMonth();
                }

                for (i = monthsOptionsCount; i--;) {
                    if ((i < minMonth) || (i > maxMonth)){
                        a9.addClass(monthsOptions[i], disabledControlMonthCSSClass);
                    } else{
                        a9.removeClass(monthsOptions[i], disabledControlMonthCSSClass);
                    }
                }

                setOptionWithValue(calendar.$selectMonth, date.getMonth());
                setOptionWithValue(calendar.$selectYear, date.getFullYear());
            },
            destructor: function(calendar){
                removeEvent(calendar.$selectMonth, 'change', changeMonth);
                removeEvent(calendar.$selectYear, 'change', changeYear);
                calendar.$selectMonth = null;
                calendar.$selectYear = null;
            }
        }
    };

    Calendar.prototype = calendarPrototype = {};

    function setMonth(calendar, date){
        var currentDate = calendar.currentDate.getDate();

        date = new Date(date.getFullYear(), date.getMonth(), currentDate);
        if (currentDate !== date.getDate()){
            date = a9.getDayFromMS(a9.getMonthStartMS(date) - 1);
        }
        setDate(calendar, date);
    }

    function setYear(calendar, date){
        if (calendar.currentDate.getDate() !== date.getDate()){
            date = a9.getDayFromMS(a9.getMonthStartMS(date) - 1);
        }
        setDate(calendar, date);
    }

    // set date
    function setDate(calendar, date){
        var newDate = date !== u ? a9.getDate(date) : new Date(),
            month,
            dateLimitFrom = calendar.dateLimitFrom,
            dateLimitTo = calendar.dateLimitTo;
        if (newDate < dateLimitFrom){
            newDate = dateLimitFrom;
        } else if (newDate > dateLimitTo) {
            newDate = dateLimitTo;
        }

        if (calendar.currentDate !== newDate) {
            month = a9.getMonthStartMS(newDate);
            calendar.currentDate = newDate;
            calendar.currentDateInMS = newDate.getTime();
            switchToMonth(calendar, month);
            if (calendar.$currentDay !== null) {
                a9.removeClass(calendar.$currentDay, currentDayClass);
            }
            calendar.$currentDay = calendar.$days[a9.getDayStartMS(newDate)];
            a9.addClass(calendar.$currentDay, currentDayClass);
            a9.generateCustomEvent(calendar, 'dateChange', newDate);
        }
    }

    // creates/changes month
    function switchToMonth(calendar, month){
        var monthDate;
        if (calendar.currentMonth !== month) {
            if (calendar.$currentMonth !== null) {
                a9.removeElement(calendar.$currentMonth);
            }
            if (!(month in calendar.months)) {
                generateMonth(calendar, month);
            }
            monthDate = new Date(month);
            calendar.calendarControls.onMonthYearChange(calendar, monthDate);
            calendar.currentMonth = month;
            calendar.$currentMonth = calendar.months[month];
            calendar.$daysContainer.appendChild(calendar.$currentMonth);
        }
    }

    function generateMonth(calendar, month){
        var $month = calendar.months[month] = tp(calendar.template('calendarMonth')).month,
            $days = calendar.$days,
            index = calendar.index,
            dayTimestamp,
            day,
            i,
            daySize = a9.getDaysSizeOfMonth(month),
            firstDay = new Date(month).getDay(),
            nextMonth,
            nextMonthTimestamp,
            firstDayOfWeek = calendar.firstDayOfWeek,
            dateLimitFrom = calendar.dateLimitFrom,
            dateLimitTo = calendar.dateLimitTo,
            $week,
            isWeekDisabled;

        function generateDay(day, isCurrentMonth){
            var $day;
            if (day.getDay() === firstDayOfWeek){
                if (($week !== u) && isWeekDisabled){
                    a9.addClass($week, disabledWeekCSSClass);
                }
                isWeekDisabled = true;
                $week = tp(calendar.template('calendarMonthWeek'), $month).week;
            }
            if (isCurrentMonth) {
                if ((day < dateLimitFrom) || (day > dateLimitTo)){
                    tp(calendar.template('calendarDayDisabled'), day, $week)
                } else{
                    isWeekDisabled = false;
                    $day = tp(calendar.template('calendarDay'), day, $week).day;
                    dayTimestamp = day.getTime();
                    $days[dayTimestamp] = $day;
                    $day.setAttribute(calendarDataAttr, index);
                    $day.setAttribute(dateAttr, dayTimestamp);
                    addEvent($day, eventOnPointerEnd, changeDay);
                }
            } else{
                tp(calendar.template('calendarDayOtherMonth'), day, $week)
            }
        }

        // generate days from previous month
        if (firstDay !== firstDayOfWeek) {
            for (i = firstDay < firstDayOfWeek ? (-firstDay - 7 + firstDayOfWeek) : (firstDayOfWeek - firstDay); i < 0; i += 1) {
                generateDay(a9.getDayFromMS(month, i), false);
            }
        }

        // generate days for current month
        for (i = 0; i < daySize; i += 1) {
            generateDay(a9.getDayFromMS(month, i), true);
        }

        // generate days from next month
        nextMonth = a9.getMonthFromMS(month, 1);
        if (nextMonth.getDay() !== firstDayOfWeek) {
            i = 0;
            nextMonthTimestamp = nextMonth.getTime();

            day = a9.getDayFromMS(nextMonthTimestamp, i);
            while (day.getDay() !== firstDayOfWeek){
                generateDay(day, false);
                i += 1;
                day = a9.getDayFromMS(nextMonthTimestamp, i);
            }
        }
    }

    // callbacks from UI iteractions
    function changeDay(){
        var calendar = calendarsStorage[this.getAttribute(calendarDataAttr)],
            timestamp = +this.getAttribute(dateAttr);
        setDate(calendar, timestamp);
    }
    function changeMonth(){
        var select = this,
            calendar = calendarsStorage[select.getAttribute(calendarDataAttr)],
            currentDate = calendar.currentDate;
        setMonth(calendar, new Date(currentDate.getFullYear(), select[select.selectedIndex].value))
    }
    function changeYear(){
        var select = this,
            calendar = calendarsStorage[select.getAttribute(calendarDataAttr)],
            currentDate = calendar.currentDate;
        setYear(calendar, new Date(select[select.selectedIndex].value, currentDate.getMonth(), currentDate.getDate()));
    }
    function prevMonth(){
        var calendar = calendarsStorage[this.getAttribute(calendarDataAttr)];
        setMonth(calendar, a9.getMonthFromMS(calendar.currentMonth, -1));
    }
    function nextMonth(){
        var calendar = calendarsStorage[this.getAttribute(calendarDataAttr)];
        setMonth(calendar, a9.getMonthFromMS(calendar.currentMonth, 1));
    }

    // selects option in select if found value
    function setOptionWithValue(select, value){
        var i,
            options = select.options;
        for (i = options.length; i--;) {
            if (options[i].value == value){
                select.selectedIndex = i;
                return i;
            }
        }
        return null;
    }

    calendarPrototype.setDate = function(date){
        setDate(this, date);
    };
    calendarPrototype.getDate = function(){
        return this.currentDate;
    };

    calendarPrototype.getTimestamp = function(){
        return this.currentDateInMS;
    };

    calendarPrototype.destructor = function(){
        var calendar = this,
            $days = calendar.$days,
            p;

        removeEvent(calendar.$prevMonth, eventOnPointerEnd, prevMonth);
        removeEvent(calendar.$nextMonth, eventOnPointerEnd, nextMonth);
        calendarControls[calendar.mode].destructor(calendar);
        for (p in $days) {
            removeEvent($days[p], eventOnPointerEnd, changeDay);
        }
        calendarsStorage[calendar.index] = null;
        a9.removeElement(calendar.$r);

        calendar.firstDayOfWeek = calendar.mode = calendar.template = calendar.index = calendar.currentDate = calendar.currentDateInMS = calendar.months = calendar.$days = calendar.currentMonth = calendar.ctx = calendar.dateLimitFrom = calendar.dateLimitTo = calendar.$r = calendar.$weekdays = calendar.$daysContainer = calendar.$close = calendar.$prevMonth = calendar.$nextMonth = calendar.$currentMonth = calendar.$currentDay = calendar.calendarControls = calendar.setDate = calendar.getDate = calendar.getTimestamp = calendar.destructor = null;
    };

    a9.calendar = function(options){
        if (!isInit){
            tp = global.cnCt.tp;
            isInit = true;
        }
        return new Calendar(options);
    };
})(this, A9);
