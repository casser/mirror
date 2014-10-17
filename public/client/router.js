/**
 * @class MirrorRouter
 */
MirrorEmitter.declare('MirrorRouter',{
    new : function(page){
        this.super();
        $(window).on('hashchange',this.go.bind(this));
        this.go(page);
    },
    go  : function(page){

        if(page.toString().charAt(0)!='#'){
            page = window.location.hash;
        }else{
            window.location.hash = page;
        }

        if(this.page != page){
            this.page=page;
            $('.page').hide();
            $(this.page).show();
            this.emit('go',this.page);
        }
    }
});