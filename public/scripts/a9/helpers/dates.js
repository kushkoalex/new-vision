(function(a9){
    var date = new Date(),
        getDate,
        getDateLocal,
        getDaysSizeOfMonth,
        u;
        a9.dayTimeSize =
            new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
            - new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1).getTime();

    a9.getDate = getDate = function(date){
        return date instanceof Date ? date : new Date(date);
    };

    a9.getDateLocal = getDateLocal = function(date){
        if(date instanceof Date)
        {
            return date;
        }
        var d = new Date(date);
        return new Date(d.valueOf() + d.getTimezoneOffset() * 60000);
    };


    a9.getDayStartMS = function(date, dateOffset){
        return a9.getDayFromMS(date, dateOffset).getTime();
    };

    a9.getYearStart = function(date){
        var _date = getDate(date);
        return new Date(_date.getFullYear(), 0, 1);
    };

    a9.getDayFromMS = function(date, dateOffset){
        var _date = getDate(date);
        return new Date(_date.getFullYear(),
            _date.getMonth(),
            typeof dateOffset === 'number' ?
                _date.getDate() + dateOffset :
                _date.getDate()
        );
    };

    //a9.dateMSToHM = function(date){
    //    var _date = getDate(date),
    //        str = _date.getMinutes().toString();
    //    if (str.length === 1){
    //        str = '0' + str;
    //    }
    //    return _date.getHours() + ':' + str;
    //};

    a9.dateMSToHM = function(date){
        //console.log(date);
        var _tmpDate = getDate(date);
        var _date = getDateLocal(date),
            str = _date.getMinutes().toString();
        if (str.length === 1){
            str = '0' + str;
        }

        //console.log(_tmpDate);
        //console.log(_date);


        return _date.getHours() + ':' + str;
    };


    a9.dateMSToLocalHM = function(date){

        new Date(date.valueOf() + date.getTimezoneOffset() * 60000)

        var _date = getDate(date),
            str = _date.getMinutes().toString();
        if (str.length === 1){
            str = '0' + str;
        }
        return _date.getHours() + ':' + str;
    };

    a9.getMonthsGap = function(startMonthDate, endMonthDate){
        var date = getDate(startMonthDate),
            year = date.getFullYear(),
            month = date.getMonth(),
            year2,
            month2;
        date = getDate(endMonthDate);
        year2 = date.getFullYear();
        month2 = date.getMonth();
        if (year !== year2){
            return Math.abs(Math.abs(month - month2) - Math.abs(year - year2) * 12);
        }
        return Math.abs(month - month2);
    };

    a9.dateToString = function(date){
        var _date = getDate(date);
        return _date.getDate() + ' ' + a9.l10n('month_with_day_' + _date.getMonth());
    };

    a9.getMonthStartMS = function(date, dateOffset){
        return a9.getMonthFromMS(date, dateOffset).getTime();
    };

    a9.getMonthFromMS = function(date, dateOffset){
        var _date = getDate(date);
        return new Date(_date.getFullYear(),
            typeof dateOffset === 'number' ?
                _date.getMonth() + dateOffset :
                _date.getMonth()
        );
    };

    a9.getDaysSizeOfMonth = getDaysSizeOfMonth = function(date){
        var _date = getDate(date);
        return new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();
    };

    /**
     * Api date format to Date
     * @param {String} apiDateFormat
     * @returns {Date}
     */
    a9.dateFromAPIDate = function(apiDateFormat){
        var year = +apiDateFormat.substr(0, 4),
            month = +apiDateFormat.substr(5, 2) - 1,
            dayDate = +apiDateFormat.substr(8, 2),
            hours,
            minutes,
            seconds;
        if (apiDateFormat.length !== 10){
            hours = +apiDateFormat.substr(11, 2);
            minutes = +apiDateFormat.substr(14, 2);
            seconds = +apiDateFormat.substr(17, 2);
            return new Date(year, month, dayDate, hours, minutes, seconds);
        }
        return new Date(year, month, dayDate);
    };

    /**
     * Date object or date timestamp to API str Date
     * @param {Date|Number} date date or timestamp
     * @param {Boolean} [isWithFullTime]
     * @param {String} [mainSeparator]
     * @param {String} [hoursSeparator]
     * @param {String} [minutesAndSecondsSeparator]
     * @returns {*}
     */
    a9.dateToAPIDate = function(date, isWithFullTime, mainSeparator, hoursSeparator, minutesAndSecondsSeparator){
        var dateForWork = getDate(date),
            u,
            _mainSeparator = mainSeparator !== u ? mainSeparator : '-',
            _hoursSeparator = hoursSeparator !== u ? hoursSeparator : ' ',
            _minutesAndSecondsSeparator = minutesAndSecondsSeparator !== u ?  minutesAndSecondsSeparator : ':',
            month = dateForWork.getMonth() + 1,
            dayDate = dateForWork.getDate(),
            result = dateForWork.getFullYear() + _mainSeparator,
            time;
        if (month >= 10){
            result += month;
        } else{
            result += '0' + month;
        }

        if (dayDate >= 10){
            result += _mainSeparator + dayDate;
        } else{
            result += _mainSeparator + '0' + dayDate;
        }

        if (isWithFullTime){
            time = dayDate.getHours();
            if (time < 10){
                result += _hoursSeparator + '0' + time;
            } else{
                result += _hoursSeparator + time;
            }
            time = dayDate.getMinutes();
            if (time < 10){
                result += _minutesAndSecondsSeparator + '0' + time;
            } else{
                result += _minutesAndSecondsSeparator + time;
            }
            time = dayDate.getSeconds();
            if (time < 10){
                result += _minutesAndSecondsSeparator + '0' + time;
            } else{
                result += _minutesAndSecondsSeparator + time;
            }
        }

        return result;
    };


    /**
     * return date from str format DDMMYYYY with fixed
     * @param {String} dateIntoString DDMMYYYY;
     * @returns {Date} result date
     */
    a9.dateFromDDMMYYYY = function(dateIntoString){
        var dayDate = +dateIntoString.substr(0, 2),
            month = +dateIntoString.substr(2, 2),
            year = +dateIntoString.substr(4),
            maxDayDate;

        if (month > 12){
            month = 12;
        }

        maxDayDate = new Date(year, month, 0).getDate();

        if (dayDate > maxDayDate){
            dayDate = maxDayDate;
        }

        return new Date(year, month - 1, dayDate);
    };

    /**
     * return date in str format DDMMYYYY from Date
     * @param {Date|Number} date Date or timestamp
     * @returns {String}
     */
    a9.dateToDDMMYYYY = function(date){
        var _date = getDate(date),
            dayDate = _date.getDate(),
            month = _date.getMonth() + 1,
            result = '';
        if (dayDate < 10){
            result += '0' + dayDate;
        } else{
            result += dayDate;
        }
        if (month < 10){
            result += '0' + month;
        } else{
            result += month;
        }
        return result + _date.getFullYear();
    };

//    todo fix previous methods

    /**
     * recycles dateFormat to Date
     * @param {Date|Number|String} dateFormat [DateObject|timestamp|DDMMYYYY]
     * @returns {Date}
     */
    a9.date_getDateFromDateFormat = function(dateFormat){
        switch (typeof dateFormat){
            case 'string':
                return a9.dateFromDDMMYYYY(dateFormat);
            case 'number':
                return new Date(dateFormat);
            default:
                return dateFormat
        }
    };

    /**
     * get days count range
     * @param {Date|Number|String} startDate [[dateFormat]]
     * @param {Date|Number|String} endDate [[dateFormat]]
     * @returns {Number}
     */
    a9.date_getDaysCount = function(startDate, endDate){
        var _startDate = a9.date_getDateFromDateFormat(startDate),
            _endDate = a9.date_getDateFromDateFormat(endDate),

            startDateYear = _startDate.getFullYear(),
            startDateMonth = _startDate.getMonth(),
            startDateDate = _startDate.getDate(),

            endDateYear = _endDate.getFullYear(),
            endDateMonth = _endDate.getMonth(),
            endDateDate = _endDate.getDate(),

            currentMonth,

            count = 0;

        if ((startDateYear === endDateYear)
            && (startDateMonth === endDateMonth)){
            count = endDateDate - (startDateDate - 1);
        } else{
            count = new Date(startDateYear, startDateMonth + 1, 0).getDate() - (startDateDate - 1);
            if (startDateMonth === 12){
                startDateMonth = 1;
            } else{
                startDateMonth += 1;
            }
            for (; startDateYear <= endDateYear; startDateYear += 1){
                if (startDateYear === endDateYear){
                    currentMonth = endDateMonth;
                } else{
                    currentMonth = 11;
                }
                for (; startDateMonth <= currentMonth; startDateMonth += 1){
                    count += new Date(startDateYear, startDateMonth + 1, 0).getDate();
                }
                startDateMonth = 0;
            }
            count -= new Date(endDateYear, endDateMonth + 1, 0).getDate() - endDateDate;
        }


        return count;
    };

    (function(){
        /**
         * Create dateRangeObject
         * @param {Date} [startDate]
         * @param {Date} [endDate]
         * @param {Number} [daysCount] — days size
         * @constructor
         */
        function DateRangeObject(startDate, endDate, daysCount){
            var dateRangeObject = this;
            dateRangeObject.startDate = startDate || null;
            dateRangeObject.endDate = endDate || null;
            dateRangeObject.daysCount = daysCount || 0;
        }

        /**
         * Create dateRangeObject
         * @param {Date} [startDate]
         * @param {Date} [endDate]
         * @param {Number} [daysCount] — days size
         * @returns {DateRangeObject}
         */
        a9.date_createDateRangeObject = function(startDate, endDate, daysCount){
            return new DateRangeObject(startDate, endDate, daysCount);
        };
    }());

    /**
     * get previous calendar week range
     * @param {Date|Number|String} dateFormat — date for calculation
     * @param {Number} [firstDayOfWeek] week day number (0-6) (1 by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getPreviousCalendarWeek = function(dateFormat, firstDayOfWeek, dateRangeObject){
        var _firstDayOfWeek = typeof firstDayOfWeek === 'number' ? firstDayOfWeek : 1,
            date = a9.date_getDateFromDateFormat(dateFormat),
            currentDayOfInputWeek = date.getDay(),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth(),
            inputDate = date.getDate();
        if (currentDayOfInputWeek === _firstDayOfWeek){
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - 7);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - 1);
        } else if (_firstDayOfWeek < currentDayOfInputWeek){
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + _firstDayOfWeek - 7);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + _firstDayOfWeek - 1);
        } else{
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek - (7 - _firstDayOfWeek) - 7);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek - (7 - _firstDayOfWeek) - 1);
        }

        _dateRangeObject.daysCount = 7;
        return _dateRangeObject;
    };

    /**
     * get current calendar week range
     * @param {Date|Number|String} dateFormat — date for calculation
     * @param {Number} [firstDayOfWeek] week day number (0-6) (1 by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getCalendarWeek = function(dateFormat, firstDayOfWeek, dateRangeObject){
        var _firstDayOfWeek = typeof firstDayOfWeek === 'number' ? firstDayOfWeek : 1,
            date = a9.date_getDateFromDateFormat(dateFormat),
            currentDayOfInputWeek = date.getDay(),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth(),
            inputDate = date.getDate();
        if (currentDayOfInputWeek === _firstDayOfWeek){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate + 6);
        } else if (_firstDayOfWeek < currentDayOfInputWeek){
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + _firstDayOfWeek);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + _firstDayOfWeek + 6);
        } else{
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek - (7 - _firstDayOfWeek));
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek - (7 - _firstDayOfWeek) + 6);
        }

        _dateRangeObject.daysCount = 7;
        return _dateRangeObject;
    };

    /**
     * get next calendar week range
     * @param {Date|Number|String} dateFormat — date for calculation
     * @param {Number} [firstDayOfWeek] week day number (0-6) (1 by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getNextCalendarWeek = function(dateFormat, firstDayOfWeek, dateRangeObject){
        var _firstDayOfWeek = typeof firstDayOfWeek === 'number' ? firstDayOfWeek : 1,
            date = a9.date_getDateFromDateFormat(dateFormat),
            currentDayOfInputWeek = date.getDay(),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth(),
            inputDate = date.getDate();
        if (currentDayOfInputWeek === _firstDayOfWeek){
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate + 7);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate + 7 + 6);
        } else if (_firstDayOfWeek < currentDayOfInputWeek){
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + (7 + _firstDayOfWeek));
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + (7 + _firstDayOfWeek) + 6);
        } else{
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + _firstDayOfWeek);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - currentDayOfInputWeek + _firstDayOfWeek + 6);
        }

        _dateRangeObject.daysCount = 7;
        return _dateRangeObject;
    };

    /**
     * get previous week range
     * @param {Date|Number|String} dateFormat — date for calculation
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getPreviousWeek = function(dateFormat, isInputDateInclusive, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(dateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear,
            inputMonth,
            inputDate;
        if (isInputDateInclusive){
            _dateRangeObject.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6);
            _dateRangeObject.endDate = date;
        } else{
            inputYear = date.getFullYear();
            inputMonth = date.getMonth();
            inputDate = date.getDate();
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate - 7);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - 1);
        }
        _dateRangeObject.daysCount = 7;
        return _dateRangeObject;
    };

    /**
     * get next week range
     * @param {Date|Number|String} DateFormat — date for calculation
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getNextWeek = function(DateFormat, isInputDateInclusive, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(DateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear,
            inputMonth,
            inputDate;
        if (isInputDateInclusive){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
        } else{
            inputYear = date.getFullYear();
            inputMonth = date.getMonth();
            inputDate = date.getDate();
            _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate + 1);
            _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate + 7);
        }
        _dateRangeObject.daysCount = 7;
        return _dateRangeObject;
    };

    /**
     * get past days range of calendar week
     * @param {Date|Number|String} dateFormat — date for calculation
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {Number} [firstDayOfWeek] week day number (0-6) (1 by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getPastDaysOfCalendarWeek = function(dateFormat, isInputDateInclusive, firstDayOfWeek, dateRangeObject){
        var _firstDayOfWeek = typeof firstDayOfWeek === 'number' ? firstDayOfWeek : 1,
            date = a9.date_getDateFromDateFormat(dateFormat),
            currentDayOfInputWeek = date.getDay(),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear,
            inputMonth,
            inputDate,
            size;

        if (currentDayOfInputWeek === _firstDayOfWeek){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = date;
            _dateRangeObject.daysCount = isInputDateInclusive ? 1 : 0;
        } else{
            if (currentDayOfInputWeek > _firstDayOfWeek){
                size = currentDayOfInputWeek - _firstDayOfWeek;
            } else{
                size = 7 - _firstDayOfWeek + currentDayOfInputWeek;
            }

            if (isInputDateInclusive){
                _dateRangeObject.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - size);
                _dateRangeObject.endDate = date;
                _dateRangeObject.daysCount = size + 1;
            } else{
                inputYear = date.getFullYear();
                inputMonth = date.getMonth();
                inputDate = date.getDate();
                _dateRangeObject.startDate =  new Date(inputYear, inputMonth, inputDate - size);
                _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - 1);
                _dateRangeObject.daysCount = size;
            }
        }
        return _dateRangeObject;
    };

    /**
     * get future days range of calendar week
     * @param {Date|Number|String} dateFormat — date for calculation
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {Number} [firstDayOfWeek] week day number (0-6) (1 by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getFutureDaysOfCalendarWeek = function(dateFormat, isInputDateInclusive, firstDayOfWeek, dateRangeObject){
        var _firstDayOfWeek = typeof firstDayOfWeek === 'number' ? firstDayOfWeek : 1,
            lastDayOfInputWeek,
            date = a9.date_getDateFromDateFormat(dateFormat),
            currentDayOfInputWeek = date.getDay(),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear,
            inputMonth,
            inputDate,
            size;

        lastDayOfInputWeek = _firstDayOfWeek === 0 ? 6 : _firstDayOfWeek - 1;

        if (currentDayOfInputWeek === lastDayOfInputWeek){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = date;
            _dateRangeObject.daysCount = isInputDateInclusive ? 1 : 0;
        } else{
            if (currentDayOfInputWeek > lastDayOfInputWeek){
                size = 7 - currentDayOfInputWeek - lastDayOfInputWeek;
            } else{
                size = lastDayOfInputWeek - currentDayOfInputWeek;
            }

            if (isInputDateInclusive){
                _dateRangeObject.startDate = date;
                _dateRangeObject.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + size);
                _dateRangeObject.daysCount = size + 1;
            } else{
                inputYear = date.getFullYear();
                inputMonth = date.getMonth();
                inputDate = date.getDate();
                _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate + 1);
                _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate + size);
                _dateRangeObject.daysCount = size;
            }
        }
        return _dateRangeObject;
    };

    /**
     * get range of previous month
     * @param {Date|Number|String} dateFormat
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getPreviousMonth = function(dateFormat, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(dateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth();
        _dateRangeObject.startDate = new Date(inputYear, inputMonth - 1, 1);
        _dateRangeObject.endDate = new Date(inputYear, inputMonth, 0);
        _dateRangeObject.daysCount = a9.date_getDaysCount(
            _dateRangeObject.startDate,
            _dateRangeObject.endDate
        );
        return _dateRangeObject;
    };

    /**
     * get range of next month
     * @param {Date|Number|String} dateFormat
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getNextMonth = function(dateFormat, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(dateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth();
        _dateRangeObject.startDate = new Date(inputYear, inputMonth + 1, 1);
        _dateRangeObject.endDate = new Date(inputYear, inputMonth + 2, 0);
        _dateRangeObject.daysCount = a9.date_getDaysCount(
            _dateRangeObject.startDate,
            _dateRangeObject.endDate
        );
        return _dateRangeObject;
    };

    /**
     * get past days range of month
     * @param {Date|Number|String} dateFormat
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getPastDaysOfMonth = function(dateFormat, isInputDateInclusive, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(dateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth(),
            inputDate = date.getDate();
        if (inputDate === 1){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = date;
            _dateRangeObject.daysCount = isInputDateInclusive ? 1 : 0;
        } else{
            if (isInputDateInclusive){
                _dateRangeObject.startDate = new Date(inputYear, inputMonth, 1);
                _dateRangeObject.endDate = date;
                _dateRangeObject.daysCount = inputDate;
            } else{
                _dateRangeObject.startDate = new Date(inputYear, inputMonth, 1);
                _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - 1);
                _dateRangeObject.daysCount = inputDate - 1;
            }
        }
        return _dateRangeObject;
    };

    /**
     * get future days range of month
     * @param {Date|Number|String} dateFormat
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getFutureDaysOfMonth = function(dateFormat, isInputDateInclusive, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(dateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth(),
            inputDate = date.getDate(),
            lastDate = new Date(inputYear, inputMonth + 1, 0),
            lastDateOfInputMonth = lastDate.getDate();
        if (inputDate === lastDateOfInputMonth){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = date;
            _dateRangeObject.daysCount = isInputDateInclusive ? 1 : 0;
        } else{
            if (isInputDateInclusive){
                _dateRangeObject.startDate = date;
                _dateRangeObject.endDate = lastDate;
                _dateRangeObject.daysCount = lastDateOfInputMonth - inputDate;
            } else{
                _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate + 1);
                _dateRangeObject.endDate = lastDate;
                _dateRangeObject.daysCount = lastDateOfInputMonth - inputDate - 1;
            }
        }
        return _dateRangeObject;
    };

    /**
     * get past days range of year
     * @param {Date|Number|String} dateFormat
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getPastDaysOfYear = function(dateFormat, isInputDateInclusive, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(dateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth(),
            inputDate = date.getDate();

        if ((inputMonth === 0)
            && (inputDate === 1)){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = date;
            _dateRangeObject.daysCount = isInputDateInclusive ? 1 : 0;
        } else{
            _dateRangeObject.startDate = new Date(inputYear, 0, 1);
            if (isInputDateInclusive){
                _dateRangeObject.endDate = date;
            } else{
                _dateRangeObject.endDate = new Date(inputYear, inputMonth, inputDate - 1);
            }
            _dateRangeObject.daysCount = a9.date_getDaysCount(
                _dateRangeObject.startDate,
                _dateRangeObject.endDate
            );

        }

        return _dateRangeObject;
    };

    /**
     * get future days range of year
     * @param {Date|Number|String} dateFormat
     * @param {Boolean} [isInputDateInclusive] — (false by default)
     * @param {DateRangeObject} [dateRangeObject]
     * @returns {DateRangeObject}
     */
    a9.date_getFutureDaysOfYear = function(dateFormat, isInputDateInclusive, dateRangeObject){
        var date = a9.date_getDateFromDateFormat(dateFormat),
            _dateRangeObject = dateRangeObject || a9.date_createDateRangeObject(),
            inputYear = date.getFullYear(),
            inputMonth = date.getMonth(),
            inputDate = date.getDate(),
            lastDateOfInputMonth = new Date(inputYear, inputMonth + 1, 0).getDate();

        if ((inputMonth === 11)
            && (inputDate === lastDateOfInputMonth)){
            _dateRangeObject.startDate = date;
            _dateRangeObject.endDate = date;
            _dateRangeObject.daysCount = isInputDateInclusive ? 1 : 0;
        } else{
            if (isInputDateInclusive){
                _dateRangeObject.startDate = date;
            } else{
                _dateRangeObject.startDate = new Date(inputYear, inputMonth, inputDate + 1);
            }
            _dateRangeObject.endDate = new Date(inputYear + 1, 0, 0);
            _dateRangeObject.daysCount = a9.date_getDaysCount(
                _dateRangeObject.startDate,
                _dateRangeObject.endDate
            );

        }
        return _dateRangeObject;
    };

    a9.parseDayFromString = function(day, month, year){
        var maxValueLength = 2,
            minDayValue = '01',
            maxDayValue,
            parseDayFromString;
        a9.parseDayFromString = parseDayFromString = function(day){
            if (day.length > maxValueLength){
                return parseDayFromString(day.substr(0, maxValueLength))
            } else{
                day = +day;
                if (isNaN(day) || (day === 0)){
                    return minDayValue;
                } else if (day < 10) {
                    return '0' + day;
                } else{
                    if ((month === u) || (month > 12)){
                        maxDayValue = 31;
                    } else{
                        if ((year === u) && (month === '02')){
                            maxDayValue = 29;
                        } else {
                            if (year === u) {
                                year = date.getFullYear();
                            }
                            maxDayValue = getDaysSizeOfMonth(new Date(year, month, 0));
                        }
                    }
                    if (day > maxDayValue) {
                        return maxDayValue;
                    } else{
                        return day;
                    }
                }
            }
        };
        return parseDayFromString(day);
    };

    a9.parseUnfinishedDayFromString = function(day, month, year){
        day = +day;
        if (isNaN(day)){
            return '01';
        } else if (((month === '02') && (day < 3)) || ((month !== '02') && (day < 4))) {
            return day;
        } else{
            return a9.parseDayFromString(day, month, year);
        }
    };

    a9.parseMonthFromString = function(month){
        var maxValueLength = 2,
            minMonthValue = '01',
            maxMonthValue = 12,
            parseMonthFromString;
        a9.parseMonthFromString = parseMonthFromString = function(month){
            if (month.length > maxValueLength){
                return parseMonthFromString(month.substr(0, maxValueLength))
            } else{
                month = +month;
                if (isNaN(month) || (month === 0)){
                    return minMonthValue;
                } else if (month < 10) {
                    return '0' + month;
                } else if (month > maxMonthValue) {
                    return maxMonthValue;
                } else{
                    return month;
                }
            }
        };
        return parseMonthFromString(month);
    };

    a9.parseUnfinishedMonthFromString = function(month){
        month = +month;
        if (isNaN(month)){
            return '01';
        } else if (month < 2) {
            return month;
        } else{
            return a9.parseMonthFromString(month);
        }
    };

    a9.parseYearFromString = function(year){
        var maxValueLength = 4,
            parseYearFromString;
        a9.parseYearFromString = parseYearFromString = function(year){
            if (year.length > maxValueLength){
                return parseYearFromString(year.substr(0, maxValueLength))
            } else{
                year = +year;
                if (isNaN(year) || (year < 0)) {
                    return '';
                } else{
                    return year;
                }
            }
        };
        return parseYearFromString(year);
    };

    a9.getDateYearBefore = function(date, yearsGap){
        var _date = getDate(date);
        return new Date(_date.getFullYear() - (yearsGap || 1),
            _date.getMonth(),
            _date.getDate()
        );
    };

    a9.getDateYearAfter = function(date, yearsGap){
        var _date = getDate(date);
        return new Date(_date.getFullYear() + (yearsGap || 1),
            _date.getMonth(),
            _date.getDate()
        );
    };


}(A9));
