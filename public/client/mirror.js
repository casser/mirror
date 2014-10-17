/**
 * @class Mirror
 */
Object.declare('Mirror',{

    new : function(page){
        this.router = MirrorRouter.new(page);
        this.setup();
    },

    setup : function () {
        (this.helpButton = $('#help-button')).bind('click',this.onHelpClick.bind(this));
        (this.supportButton = $('#support-button')).bind('click',this.onSupportClick.bind(this));
        (this.logoutButton = $('#logout-button')).bind('click',this.onLogoutClick.bind(this)).hide();
        (this.clientsSelector = $('#clients-selector')).hide();
        (this.userNameField = $('#username-field')).hide();
        (this.pairNameField = $('#pairname-field')).hide();
    },

    logout              : function(){
        this.helpButton.show();
        this.helpButton.show();
        this.supportButton.show();
        this.clientsSelector.hide();
        this.logoutButton.hide();
        this.userNameField.hide();
        this.pairNameField.hide();
        if(this.socket){
            this.socket.close();
        }
    },

    login               : function(mode){
        this.logout();
        this.helpButton.hide();
        this.supportButton.hide();
        this.logoutButton.show();
        switch (this.mode = mode){
            case MirrorConfig.MODE_CUSTOMER :
                this.socket = MirrorClient.new(this).on('close',this.logout,this);
            break;
            case MirrorConfig.MODE_OFFICER  :
                this.socket = MirrorServer.new(this).on('close',this.logout,this);
                this.clientsSelector.show();
            break;
        }
    },

    prompt              : function(name){
        return (prompt(MirrorConfig.NAME_PROMPT,name) || name)
    },
    renderUser          : function(user){
        this.userNameField.html('<span>Welcome «<b>'+user.name+'</b>»</span>').show();
        if(user.customer){
            this.pairNameField.html('<span>Supporting to «<b>'+user.customer.name+'</b>»</span>').show();
        }else
        if(user.officers && user.officers.length){
            var names = []
            user.officers.forEach(function(officer){
                names.push(officer.name);
            });

            if(names.length>2){
                names = '<b>'+names.shift()+'</b>, <b>'+names.shift()+"</b> and <b>"+names.length+"</b> more.";
            }else
            if(names.length>1){
                names = '<b>'+names.shift()+'</b> and <b>'+names.shift()+'</b>';
            }else{
                names = '<b>'+names[0]+'</b>';
            }
            this.pairNameField.html('<span>Supported by «'+names+'»</span>').show();
        }else{
            this.pairNameField.hide();
        }


    },
    renderClients       : function(clients){
        console.info(clients);
        var cs = this.clientsSelector.find('.dropdown-menu').empty();
        clients.forEach(function(u){
            cs.append($('<li><a id="'+u.id+'">'+ u.name+'</a></li>')
                .click(this.socket.join.bind(this.socket,u.id)));
        }.bind(this))
    },
    onHelpClick         : function(){
        return !!this.login(MirrorConfig.MODE_CUSTOMER);
    },

    onSupportClick      : function(){
        return !!this.login(MirrorConfig.MODE_OFFICER);
    },

    onLogoutClick       : function(){
        return !!this.logout();
    }

});
