(function(a9){
    var objects = [],
        objectsInGenerationEvent = [],
        objectsOfEvents = [],
        arrayIndexOf = a9.arrayIndexOf,
        arraySlice = a9.arraySlice,
        objectLength = a9.objectLength,
        generateEventNameStatePrefix = '__isGenerate__',
        generateEventNameTasksStackPrefix = '__tasksStack__';

    function indexHandlerOfObjectEventData(objectEventData, handler, ctx){
        var i = 0,
            iMax = objectEventData.length;
        for (; i < iMax; i += 3){
            if ((objectEventData[i] === handler) && (objectEventData[i + 1] === ctx)){
                return i;
            }
        }
        return -1;
    }

    /**
     * Добавить обработчик кастомного события
     * @param {*} object объект, на котором слушается кастомное событие
     * @param {String} eventName имя события
     * @param {Function} handler обработчик
     * @param {*} [ctx] контекст handler
     * @param {*} [data] первый параметр handler
     */
    a9.addCustomEvent = function(object, eventName, handler, ctx, data){
        var index = arrayIndexOf(objects, object),
            objectEvents;

        if (index === -1){
            index = objects.push(object);
            index -= 1;
            objectsOfEvents[index] = objectEvents = {};
        } else{
            objectEvents = objectsOfEvents[index];
        }

        if (eventName in objectEvents){
            if (objectEvents[generateEventNameStatePrefix + eventName]){
                objectEvents[generateEventNameTasksStackPrefix + eventName].push(true, handler, ctx, data);
            } else{
                objectEvents[eventName].push(handler, ctx || null, data || null);
            }
        } else{
            objectEvents[generateEventNameStatePrefix + eventName] = false;
            objectEvents[generateEventNameTasksStackPrefix + eventName] = [];
            objectEvents[eventName] = [handler, ctx || null, data || null];
        }

    };


    /**
     * удалить обработчик кастомного события
     * @param {*} object объект, обработчик кастомного события которого нужно удалить
     * @param {String} eventName имя события
     * @param {Function} handler обработчик
     * @param {*} [ctx] контекст handler
     */
    a9.removeCustomEvent = function(object, eventName, handler, ctx){
        var index = arrayIndexOf(objects, object),
            handlerIndex,
            objectOfEvents,
            objectEventData;

        if (index !== -1){
            objectOfEvents = objectsOfEvents[index];
            if (eventName in objectOfEvents){
                if (objectOfEvents[generateEventNameStatePrefix + eventName]){
                    objectOfEvents[generateEventNameTasksStackPrefix + eventName].push(false, handler, ctx);
                } else{
                    objectEventData = objectOfEvents[eventName];
                    handlerIndex = indexHandlerOfObjectEventData(objectEventData, handler, ctx || null);
                    if (handlerIndex !== -1){
                        if (objectEventData.length === 3){
                            if (objectLength(objectOfEvents) === 1){
                                arraySlice(objects, index, 1);
                                arraySlice(objectsOfEvents, index, 1);
                            } else{
                                delete objectOfEvents[eventName];
                                delete objectOfEvents[eventName];
                            }
                        } else{
                            arraySlice(objectEventData, handlerIndex, 3);
                        }
                    }
                }

            }

        }
    };

    /**
     * генерировать кастомное событие
     * @param {*} object объект, на котором нужно сгенерировать кастомное событие
     * @param {String} eventName имя события
     * @param {*|...} [parameter] первый параметр обработчика
     */
    a9.generateCustomEvent = function(object, eventName, parameter){
        var index = arrayIndexOf(objects, object),
            objectOfEvents,
            objectEventData,
            tasksStack,
            i,
            iMax,
            args,
            eventData;

        if (index !== -1){
            objectOfEvents = objectsOfEvents[index];
            if (eventName in objectOfEvents){
                //set generate flag
                objectOfEvents[generateEventNameStatePrefix + eventName] = true;
                objectEventData = objectOfEvents[eventName];
                //check parameters count
                iMax = arguments.length;
                if (iMax > 3){
                    args = [];
                    for (i = 2; i < iMax; i += 1){
                        args.push(arguments[i]);
                    }
                    for (i = 0, iMax = objectEventData.length; i <  iMax; i += 3){
                        eventData = objectEventData[i + 2];
                        if (eventData === null){
                            objectEventData[i].apply(objectEventData[i + 1] || object, args);
                        } else{
                            args.unshift(eventData);
                            objectEventData[i].apply(objectEventData[i + 1] || object, args);
                            args.shift();
                        }
                    }
                } else{
                    for (i = 0, iMax = objectEventData.length; i <  iMax; i += 3){
                        eventData = objectEventData[i + 2];
                        if (eventData === null){
                            objectEventData[i].call(objectEventData[i + 1] || object, parameter);
                        } else{
                            objectEventData[i].call(objectEventData[i + 1] || object, eventData, parameter);
                        }
                    }
                }
                //unset generate flag
                objectOfEvents[generateEventNameStatePrefix + eventName] = false;
                //check tasks
                tasksStack = objectOfEvents[generateEventNameTasksStackPrefix + eventName];
                iMax = tasksStack.length;
                if (iMax !== 0){
                    i = 0;
                    while (i < iMax){
                        if (tasksStack[i]){
                            a9.addCustomEvent(object, eventName, tasksStack[i + 1], tasksStack[i + 2], tasksStack[i + 3]);
                            i += 4;
                        } else{
                            a9.removeCustomEvent(object, eventName, tasksStack[i + 1], tasksStack[i + 2]);
                            i += 3;
                        }
                    }
                    //clear tasks
                    tasksStack.length = 0;
                }
            }
        }
    };

    /**
     * удалить всех слушателей всех событий объекта
     * @param {*} object
     */
    a9.removeAllCEListeners = function(object){
        var index = arrayIndexOf(objects, object),
            objectOfEvents,
            p;

        if (index !== -1){
            objectOfEvents = objectsOfEvents[index];
            for (p in objectOfEvents){
                objectOfEvents[p].length = 0;
                delete objectOfEvents[p];
            }
            arraySlice(objects, index, 1);
            arraySlice(objectsOfEvents, index, 1);
        }
    };
}(A9));