(function(global){
    var message='hello';
    global.message = message;
    console.log(global.message);
})(this);