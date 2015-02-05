/**
 * Получить имя кноки клавиатуры относительно события
 * @param {Event} e событие клавиатуры
 * @returns {String} name имя кнопки
 */
(function(a9){
    var deviceInfo = a9.deviceInfo,
        keysList = [];
//    todo to object
    keysList[8] = 'back';
    keysList[9] = 'tab';
    keysList[13] = 'enter';
    keysList[16] = 'shift';
    keysList[17] = 'ctrl';
    keysList[18] = 'alt';
    keysList[20] = 'caps';
    keysList[27] = 'esc';
    keysList[32] = 'space';
    keysList[33] = 'pUp';
    keysList[34] = 'pDown';
    keysList[35] = 'end';
    keysList[36] = 'home';
    keysList[37] = 'aLeft';
    keysList[38] = 'aTop';
    keysList[39] = 'aRight';
    keysList[40] = 'aBottom';
    keysList[45] = 'insert';
    keysList[46] = 'delete';
    keysList[48] = '0';
    keysList[49] = '1';
    keysList[50] = '2';
    keysList[51] = '3';
    keysList[52] = '4';
    keysList[53] = '5';
    keysList[54] = '6';
    keysList[55] = '7';
    keysList[56] = '8';
    keysList[57] = '9';
    keysList[59] = keysList[186] = ';';
    keysList[61] = keysList[187] = '=';
    keysList[65] = 'a';
    keysList[66] = 'b';
    keysList[67] = 'c';
    keysList[68] = 'd';
    keysList[69] = 'e';
    keysList[70] = 'f';
    keysList[71] = 'g';
    keysList[72] = 'h';
    keysList[73] = 'i';
    keysList[74] = 'j';
    keysList[75] = 'k';
    keysList[76] = 'l';
    keysList[77] = 'm';
    keysList[78] = 'n';
    keysList[79] = 'o';
    keysList[80] = 'p';
    keysList[81] = 'q';
    keysList[82] = 'r';
    keysList[83] = 's';
    keysList[84] = 't';
    keysList[85] = 'u';
    keysList[86] = 'v';
    keysList[87] = 'w';
    keysList[88] = 'x';
    keysList[89] = 'y';
    keysList[90] = 'z';
    keysList[96] = 'n0';
    keysList[97] = 'n1';
    keysList[98] = 'n2';
    keysList[99] = 'n3';
    keysList[100] = 'n4';
    keysList[101] = 'n5';
    keysList[102] = 'n6';
    keysList[103] = 'n7';
    keysList[104] = 'n8';
    keysList[105] = 'n9';
    keysList[111] = 'n/';
    keysList[106] = 'n*';
    keysList[107] = 'n+';
    keysList[109] = keysList[189] = '-';
    keysList[110] = 'nPoint';
    keysList[112] = 'f1';
    keysList[113] = 'f2';
    keysList[114] = 'f3';
    keysList[115] = 'f4';
    keysList[116] = 'f5';
    keysList[117] = 'f6';
    keysList[118] = 'f7';
    keysList[119] = 'f8';
    keysList[120] = 'f9';
    keysList[121] = 'f10';
    keysList[122] = 'f11';
    keysList[123] = 'f12';
    keysList[124] = keysList[44] = 'f13';
    keysList[125] = keysList[145] = 'f14';
    keysList[126] = keysList[19] = 'f15';
    keysList[127] = 'f16';
    keysList[128] = keysList[63252] = 'f17';
    keysList[129] = keysList[63253] = 'f18';
    keysList[130] = keysList[63254] = 'f19';
    keysList[144] = 'numPad';
    keysList[188] = '<';
    keysList[190] = '>';
    keysList[191] = '?';
    keysList[192] = '~';
    keysList[219] = '[';
    keysList[220] = '|';
    keysList[221] = ']';
    keysList[222] = '"';
    keysList[224] = keysList[91] = keysList[93] = 'cmd';

    if (deviceInfo.isMac && deviceInfo.isOpera){
        keysList[57392] = 'ctrl';
        keysList[17] = 'cmd';
    }
    if (deviceInfo.isWindows){
        keysList[19] = 'pause';
        keysList[44] = 'prtSc';
        keysList[91] = 'win';
        keysList[145] = 'scrollLock';
        if (deviceInfo.isOpera){
            keysList[42] = 'n*';
            keysList[43] = 'n+';
            keysList[47] = 'n/';
        }
    }

    a9.getKeyNameOfEvent = function(e){
        return keysList[e.keyCode];
    };
}(A9));

(function(a9){
    /**
     * Проверить соответсвие нажатой кнопки имени
     * @param {Event} e событие клавиатуры
     * @param {String} keyName имя кнопки
     * @returns {Boolean} true/false
     */
    a9.testEventOfKeyName = function(e, keyName){
        return a9.getKeyNameOfEvent(e) === keyName;
    };
}(A9));

(function(globa, a9){
    var pressingKeys = [],
        document = globa.document;
    /**
     * Проверить нажата ли кнопка клавиатуры в данный момент
     * @param {String} keyName имя кнопки
     * @returns {boolean} true/false
     */
    a9.testPressedKey = function(keyName){
        for (var i = pressingKeys.length; i-- ;){
            if (pressingKeys[i] == keyName){
                return true;
            }
        }
        return false;
    };
    function del(keyName){
        var index = a9.arrayIndexOf(pressingKeys, keyName);
        if (index !== -1){
            pressingKeys.splice(index, 1);
        }
    }
    a9.addEvent(document, 'keydown', function(e){
        var cache = a9.getKeyNameOfEvent(e);
        if (!a9.testPressedKey(cache)){
            pressingKeys.push(cache);
        }
    });
    a9.addEvent(document, 'keyup', function (e){
        del(a9.getKeyNameOfEvent(e));
    });
    a9.active.blur.push(function(){
        pressingKeys.length = 0;
    });
}(this, A9));