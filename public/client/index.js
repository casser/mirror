
$(window).on('load',function(){
    window.mr = Mirror.new('#loan-amount');
});
/*
$(window).on('load',function(){
    var host = window.location.hash=='#host';
    window.ws = new WebSocket("ws://"+window.location.hostname+":8081")
    window.ws.id = Math.random();

    function onScroll(e){
        window.ws.send(JSON.stringify([window.ws.id,1,$(window).scrollTop(),$(window).scrollLeft()]));
    }
    function onClick(e){
        if($(e.target).attr('id')){
            var msg = JSON.stringify([window.ws.id,2,$(e.target).attr('id')])
            console.info(msg);
            window.ws.send(msg);
        }
    }
    function onChange(e){
        if($(e.target).attr('id')){
            var msg = JSON.stringify([window.ws.id,3,$(e.target).attr('id'),$(e.target).val()])
            console.info(msg);
            window.ws.send(msg);
        }
    }
    window.ws.onopen = function () {
        console.log("Connection opened");
        if(host){
            $( window ).bind("scroll" ,onScroll);
            $('*').bind("click" ,onClick);
            $('*').bind("change keyup" ,onChange);
        }
    };
    window.ws.onclose = function () {
        console.log("Connection closed")
    };
    window.ws.onerror = function () {
        console.error("Connection error")
    };
    window.ws.onmessage = function (event) {
        var msg = JSON.parse(event.data);
        if(!host) {
            if (msg[0] != window.ws.id) {
                switch (msg[1]) {
                    case 1 :
                        $(window).scrollTop(msg[2]);
                        $(window).scrollLeft(msg[3]);
                        break;
                    case 2 :
                        console.info(msg[2]);
                        document.getElementById(msg[2]).click();
                        break;
                    case 3 :
                        console.info(msg[2]);
                        $('#'+msg[2]).val(msg[3]);
                        break;
                }
            } else {
                //console.info("Mine "+event.data);
            }
        }
    };
    router.go();
});
*/


