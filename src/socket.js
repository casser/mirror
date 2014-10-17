with(require('ozero')(module)) {
    require('nodejs-websocket', "WebSocket");
    require('./emitter');
    /**
     * @class SocketConnection
     */
    declare('SocketConnection',Emitter,{
        new      : function(socket,original){
            this.super();
            Object.defineProperties(this,{
                socket              : {
                    value           : socket
                },
                original            : {
                    value           : original
                },
                STATE               : {
                    value           : {
                        CONNECTING  : 0,
                        OPEN        : 1,
                        CLOSING     : 2,
                        CLOSED      : 3
                    }
                }
            });
            this.register();
        },
        id       : function(){
            return this.original.key;
        },
        type     : function(){
            if(!this.original.type){
                this.original.type = this.original.path.split('/')[1];
            }
            return this.original.type;
        },
        name     : function(){
            if(!this.original.name){
                this.original.name = decodeURI(this.original.path.split('/')[2]);
            }
            return this.original.name;
        },
        user     : function(){
            return {
                id   : this.id(),
                type : this.type(),
                name : this.name()
            }
        },
        register : function(){
            this.socket.cs[this.id()]=this;
            this.original.mirror=this;
            this.id = this.original.key;
            this.original.on("binary", this.onBinary.bind(this));
            this.original.on("text", this.onText.bind(this));
            this.original.on("close", this.onClose.bind(this));
            this.welcome();
        },
        destroy     : function(){
            delete this.socket.cs[this.id()];
            delete this.original.mirror;
        },
        sendBinary    : function (data){
            if(this.original.readyState === this.STATE.OPEN){
                this.original.sendBinary(data)
            }
        },
        sendText      : function (data){
            if(this.original.readyState === this.STATE.OPEN) {
                this.original.sendText(data)
            }
        },
        sendCommand   : function (){
            if(this.original.readyState === this.STATE.OPEN) {
                this.original.sendText(JSON.stringify(Array.prototype.slice.call(arguments)))
            }
        },
        welcome     : function(){
            this.sendText('welcome');
        },
        onBinary    : function (data){
            this.socket.broadcast(str);
        },
        onText      : function (data){
            try{
                data = JSON.parse(data);
            }catch(ex){
                data = [0,data];
            }
            this.onCommand(data.shift(),data);
        },
        onCommand   : function(cmd,params){
            console.info(cmd,params);
        },
        onClose     : function (){
            this.destroy();
        },
        toJSON      : function(){
            return this.user();
        }
    });
    /**
     * @class CustomerConnection
     */
    declare('CustomerConnection',SocketConnection,{
        welcome     : function(){
            this.sendCommand(1,this.user());
        },
        user        : function(){
            var user = this.super();
            user.officers = [];
            for(var o in this.links){
                var officer = this.links[o];
                user.officers.push({
                    id   : officer.id(),
                    name : officer.name()
                });
            }
            if(!user.officers.length){
                delete user.officers;
            }
            return user;
        },

        destroy     : function(){
            this.unlink();
            this.super();
        },
        link        : function(officer){
            if(!this.links){
                this.links = {};
            }
            this.links[officer.id()] = officer;
            this.sendCommand(2,this.user());
        },
        unlink      : function(c){
            if(this.links){
                for(var i in this.links){
                    if(c){
                        if(c.id()==i){
                            this.links[i].unlink(this);
                            delete this.links[i];
                        }
                    }else{
                        this.links[i].unlink(this);
                        delete this.links[i];
                    }
                }
                if(!c){
                    delete this.links;
                }
            }
            this.sendCommand(2,this.user());
        },
        broadcast    : function(cmd,params){
            if(this.links){
                for(var i in this.links){
                    this.links[i].sendCommand.apply(this.links[i],[cmd].concat(params));
                }
            }
        },
        onCommand   : function(cmd,params){
            switch(cmd){
                case 211 :
                case 212 :
                case 213 :
                case 214 :
                case 215 :
                    this.broadcast(cmd,params);
                break;
            }
        }
    });

    /**
     * @class OfficerConnection
     */
    declare('OfficerConnection',SocketConnection,{
        welcome     : function(){
            this.sendCommand(1,this.user(),this.socket.customers());
        },
        destroy     : function(){
            this.unlink();
            this.super();
        },
        user        : function(){
            var user = this.super();
            if(this.customer){
                user.customer = {
                    id   : this.customer.id(),
                    name : this.customer.name()
                };
            }
            return user;
        },
        link       : function(customer){
            this.customer = customer;
            this.customer.link(this);
            this.sendCommand(2,this.user());
        },
        unlink     : function(){
            var customer = this.customer;
            if(customer){
                delete this.customer;
                customer.unlink(this);
            }
            this.sendCommand(2,this.user());
        },
        onCommand   : function(cmd,params){
            switch(cmd){
                case 100 : this.onJoin(params[0]);break;
            }
        },
        onJoin      : function(cid){
            var customer = this.socket.cs[cid];
            if(customer){
                this.link(customer);
            }else{
                console.info('invalid customer id '+cid);
            }
        }
    });

    /**
     * @class HttpSocket
     */
    declare(public,'HttpSocket',{
        new                  : function(){
            Object.defineProperties(this,{
                ws : {
                    value : WebSocket.createServer(this.onConnectionOpen.bind(this))
                },
                cs : {
                    value:{}
                }
            });
        },
        start                : function(port){
            this.ws.listen(port)
        },
        officers             : function(){
            return this.connections(function(conn){
                return conn.type()=='officer';
            })
        },
        customers            : function(){
            return this.connections(function(conn){
                return conn.type()=='customer';
            })
        },
        connections          : function (filter) {
            var conns = [];
            for(var id in this.cs){
                if(filter(this.cs[id])){
                    conns.push(this.cs[id])
                }
            }
            return conns;
        },
        onConnectionOpen     : function (connection) {
            switch(connection.path.split('/')[1]){
                case 'officer'  : OfficerConnection.new(this,connection); break;
                case 'customer' : CustomerConnection.new(this,connection); break;
                default:
                    connection.close(4001,'invalid connection type');
                break
            }
        }

    });
}
