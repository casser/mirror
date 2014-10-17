/**
 * @class MirrorEmitter
 */
Object.declare('MirrorEmitter',{
    new : function(){
        Object.defineProperty(this,'listeners',{
            value : {}
        })
    },
    on  : function(event,listener,target){
        if(!this.listeners[event]){
            this.listeners[event] = [[listener,target]]
        }else{
            this.listeners[event].push([listener,target])
        }
        return this;
    },
    off : function(event,cb){
        var listeners = this.listeners[event];
        if(listeners){
            if(cb){
                this.listeners[event] = listeners.filter(function(listener){
                    return listener[0] != cb;
                })
            }else{
                delete this.listeners[event];
            }
        }
    },
    emit : function(){
        var args = Array.prototype.slice.call(arguments);
        var event = args.shift();
        var listeners = this.listeners[event];
        if(listeners){
            listeners.forEach(function(listener){
                listener[0].bind(listener[1]).apply(null,args);
            });
        }
    }
});