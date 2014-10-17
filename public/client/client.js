/**
 * @class MirrorClient
 */
MirrorSocket.declare('MirrorClient',{
    ':commands'      : {
        GO       : 211,
        SCROLL   : 212,
        FOCUS    : 213,
        CLICK    : 214,
        CHANGE   : 215
    },
    new     : function(mirror){
        this.super(mirror);
        this.connect(
            MirrorConfig.MODE_CUSTOMER,
            this.mirror.prompt(MirrorConfig.NAME_DEFAULT.CUSTOMER)
        );
        this.setup();
    },
    setup  : function(){
        this.mirror.router.on('go',this.sayGo.bind(this));
        window.onscroll = this.sayScroll.bind(this);
        var that = this;
        $('[data-mirror]').each(function(i,el){
            var id   = el.getAttribute('data-mirror');
            var type = el.nodeName;

            switch(type){
                case 'INPUT' :
                    el.onchange  =
                    el.onkeyup   = that.sayChange.bind(that,id);
                    el.onfocus   = that.sayFocus.bind(that,id);
                break;
                case 'BUTTON' :
                    el.onclick  = that.sayClick.bind(that,id);
                    el.onchange = that.sayChange.bind(that,id);
                    el.onfocus  = that.sayFocus.bind(that,id);
                break;
                case 'A':
                    el.onclick = that.sayClick.bind(that,id)
            }
        });

    },
    sayGo  : function(page){
        this.send(this.command.go,page);
    },
    sayScroll  : function(page){
        this.send(this.command.scroll,window.pageXOffset,window.pageYOffset);
    },
    sayFocus  : function(id){
        this.send(this.command.focus,id);
    },
    sayClick  : function(id){
        this.send(this.command.click,id);
    },
    sayChange  : function(id,event){
        this.send(this.command.change,id,event.target.value);
    }
});