JMFORMS.modulesForInit.push(function(jmf){
    var tmpls = jmf.tmpls,
        a9 = jmf.global.A9,
        l10n = a9.l10n,
        selectOptions = {
            c: '',
            n: '',
            optionsList: []
        },
        idIndex = 0;

    tmpls.calendarDate = function(fieldModel){
        var result,
            currentId = 'jmfFieldDefaultDate_' + idIndex,
            a = {
                name: fieldModel.name,
                id: currentId
            },
            cGlobalWrapper = 'jmf-field-wrapper jmf-field-default-date-field-wrapper',
            content,
            u;

        idIndex += 1;

        if (fieldModel.isEditable === false){
            a.readonly = 'readonly';
            cGlobalWrapper += ' jmf-field-default-date-field-readonly';
        }

        content = [
            tmpls.label({
                'for': currentId,
                c: 'jmf-field-default-date-field-label',
                H: l10n(fieldModel.label, 'firstUpper'),
                isRequired: fieldModel.isRequired
            }),
            tmpls.input({
                cVisual: 'jmf-field-input jmf-field-default-date-input',
                cWrapper: 'jmfValidateInputSourceWrapper jmf-field-default-date-input-wrapper',
                v: fieldModel.value,
                a: a,
                icon: 'jmf-field-default-date'
            })
        ];

        if (fieldModel.tooltip !== u){
            content.push(tmpls.tooltip({type: 'info', H: l10n(fieldModel.tooltip)}));
        }

        result = {c: cGlobalWrapper, C: content};

        return result;
    };

    tmpls.calendarFieldIcon = function(forID){
        return {e: 'label', c: 'jmf-input-calendar-indicator', n: 'indicator', a: {'for': forID}, C: tmpls.icon};
    };

    tmpls.calendarFieldCalendarWrapper = function(){
        return {c: 'jmf-input-calendar-wrapper', n: 'inner'};
//        return {c: 'jmf-input-calendar-wrapper', C:
//            {c: 'jmf-input-calendar-vcenter-fix', C:
//                {c: 'jmf-input-calendar-vcenter-fix-inner', n: 'inner'}
//            }
//        };
    };

    /**
     * needNodes:
     *      calendar
     *      prevMonth
     *      month
     *      nextMonth
     *      weekdays
     *      days
     *      close
     */
    tmpls.jfm_calendar = function(mode){
        return {c: 'jmf-input-calendar jmf-input-calendar_' + mode + '_mode', n: 'calendar', C: [
            {c: 'jmf-input-calendar-close', n: 'close'},
            {c: 'jmf-input-calendar-month-prev', n: 'prevMonth'},
            {c: 'jmf-input-calendar-controls', n: 'controls'},
            {c: 'jmf-input-calendar-month-next', n: 'nextMonth'},
            {c: 'jmf-input-calendar-weekdays', n: 'weekdays'},
            {c: 'jmf-input-calendar-days', n: 'days'}
        ]};
    };

    tmpls.jfm_calendarControls_switchMonths = function(){
        return {c: 'jmf-input-calendar-month-current'};
    };

    tmpls.jfm_calendarControls_chooseMonthYear = function(calendar){
        var i,
            iMax,
            controls = [],
            monthsCount = 12,
            yearFrom = calendar.dateLimitFrom.getFullYear(),
            yearTo = calendar.dateLimitTo.getFullYear(),
            optionsList = selectOptions.optionsList;

        selectOptions.c = 'jmf-input-calendar-month-select';
        selectOptions.n = 'month';
        optionsList.length = 0;
        for (i = 0, iMax = monthsCount; i < iMax; i += 1) {
            selectOptions.optionsList.push({
                v: i,
                t: l10n('month_' + i)
            });
        }
        controls.push(tmpls.select(selectOptions));

        selectOptions.c = 'jmf-input-calendar-year-select';
        selectOptions.n = 'year';
        optionsList.length = 0;
        for (i = yearFrom, iMax = yearTo; i <= iMax; i += 1) {
            selectOptions.optionsList.push({
                v: i,
                t: i
            });
        }
        controls.push(tmpls.select(selectOptions));

        return controls;
    };

    tmpls.jfm_calendarWeekDay = function(i){
        return {c: 'jmf-input-calendar-week-day', t: l10n('weekDay' + i)};
    };

    /**
     * needNodes:
     *      month
     */
    tmpls.jfm_calendarMonth = function(){
        return {c: 'jmf-input-calendar-month', n: 'month'};
    };

    /**
     * needNodes:
     *      day
     */
    tmpls.jfm_calendarDay = function(day){
        return {c: 'jmf-input-calendar-day jmf-input-calendar-day-month-' + day.getMonth() + ' isCurrentMonth', t: day.getDate(), n: 'day'};
    };

    tmpls.jfm_calendarDayDisabled = function(day){
        return {c: 'jmf-input-calendar-day jmf-input-calendar-day-month-' + day.getMonth() + ' isDisabledCalendarDay', t: day.getDate()};
    };

    tmpls.jfm_calendarDayOtherMonth = function(day){
        return {c: 'jmf-input-calendar-day jmf-input-calendar-day-month-' + day.getMonth() + ' isNotCurrentMonth', t: day.getDate()};
    };

    /**
     * needNodes:
     *      week
     */
    tmpls.jfm_calendarMonthWeek = function(){
        return {c: 'jmf-input-calendar-month-week', n: 'week'};
    };

    tmpls.select = function(options){
        var i,
            iMax,
            optionsList = options.optionsList,
            $optionsList = [];

        for (i = 0, iMax = optionsList.length; i < iMax; i += 1) {
            $optionsList.push(tmpls.selectOption(optionsList[i]));
        }

        return {e: 'select', c: options.c, n: options.n, C: $optionsList};
    };

    tmpls.selectOption = function(option){
        return {e: 'option', v: option.v, t: option.t};
    };
});

