/**
 * @class MirrorServer
 */
MirrorSocket.declare('MirrorServer',{
    ':commands' : {
        JOIN    : 100
    },
    new         : function(mirror){
        this.super(mirror);
        this.connect(
            MirrorConfig.MODE_OFFICER,
            this.mirror.prompt(MirrorConfig.NAME_DEFAULT.OFFICER)
        );
    },
    join        : function(user){
        this.send(this.command.join,user);
    },
    select      : function(id){
        return window.document.querySelector('[data-mirror="'+id+'"]');
    },
    onWelcome   : function(user,clients){
        this.super(user);
        this.mirror.renderClients(clients);
    },
    onCustomer  : function(clients){
        this.mirror.renderClients(clients);
    },
    onGo        : function(path){
        this.mirror.router.go(path);
    },
    onScroll    : function(x,y){
        window.scrollTo(x,y);
    },
    onChange    : function(id,value){
        this.select(id).value = value;
    },
    onFocus    : function(id){
        this.select(id).focus();
    },
    onClick    : function(id){
        this.select(id).click();
    }
});