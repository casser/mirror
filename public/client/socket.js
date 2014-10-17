/**
 * @class MirrorSocket
 */

MirrorEmitter.declare('MirrorSocket',{
    ':commands' : {
        WELCOME  : 1,
        PAIR     : 2,
        CUSTOMER : 3
    },
    static      : function(socket){
        if(socket.commands){
            for(var key in socket.commands){
                //MirrorConfig.COMMANDS[key] = socket.commands[key];
                MirrorConfig.COMMANDS[socket.commands[key]] ={
                    id   : socket.commands[key],
                    emit : key.toLowerCase(),
                    name : 'on'+key.toCamelCase().capitalize()
                }
            }
        }
    },
    new         : function(mirror){
        this.super();
        this.mirror = mirror;
        this.url = "ws://"+window.location.hostname+":8001";
        this.command = {};
        for(var c in MirrorConfig.COMMANDS){
            var cmd = MirrorConfig.COMMANDS[c];
            this.command[cmd.emit] = cmd.id;
        }
    },
    connect     : function(mode,name){
        var self = this;
        this.ws = WebSocket.new(this.url+'/'+mode+'/'+(name?name:'Anonymous'));
        this.ws.onopen      = function (event) {
            self.onOpen(event);
        };
        this.ws.onclose     = function (event) {
            self.onClose(event);
        };
        this.ws.onerror     = function (event) {
            self.onError(event);
        };
        this.ws.onmessage   = function (event) {
            self.onMessage(event.data);
        };
    },
    emit        : function(event,data){
        console.info('on '+event,data);
        this.super.apply(this,arguments);
    },
    send        : function(){
        this.ws.send(JSON.stringify(Array.prototype.slice.call(arguments)));
    },
    close       : function(){
        if(this.ws){
            try{
                this.ws.close();
            }catch(e){
                console.info(e);
            }
        }
    },
    onClose     : function(event){
        this.mirror.logout();
    },
    onOpen      : function(event){},
    onError     : function(event){
        console.info(event);
    },
    onMessage   : function(data){
        try{
            var c,cmd,msg = JSON.parse(data);
            if(msg instanceof Array){
                cmd = MirrorConfig.COMMANDS[c=msg.shift()];
                if(cmd){
                    this.emit.apply(this,[cmd.emit].concat(msg));
                    if(this[cmd.name]){
                        this[cmd.name].apply(this,msg);
                    }else{
                        this.onCommand.apply(this,[cmd].concat(msg));
                    }
                }else{
                    throw new Error('invalid command '+data);
                }
            }else{
                throw new Error('invalid command'+data);
            }
        }catch(e){
            this.onError(e);
        }
    },
    onPair   : function(user){
        this.mirror.renderUser(user);
    },
    onWelcome   : function(user){
        this.mirror.renderUser(user);
    },
    onCommand   : function(){
        console.info(arguments)
    }
});